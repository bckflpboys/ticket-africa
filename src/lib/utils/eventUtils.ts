export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
  organizer?: string;
  capacity?: number;
  ticketsAvailable?: number;
}

export const formatEventDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

export const categorizeEvents = (events: Event[]): Record<string, Event[]> => {
  return events.reduce((acc, event) => {
    const category = event.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
};

export const filterEvents = (
  events: Event[],
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    searchQuery?: string;
  }
): Event[] => {
  return events.filter(event => {
    const matchesCategory = !filters.category || event.category === filters.category;
    const matchesPrice = (!filters.minPrice || event.price >= filters.minPrice) &&
                        (!filters.maxPrice || event.price <= filters.maxPrice);
    const matchesLocation = !filters.location || 
                          event.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesSearch = !filters.searchQuery ||
                         event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesCategory && matchesPrice && matchesLocation && matchesSearch;
  });
};
