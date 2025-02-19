# Ticket Africa

A modern and robust ticket booking platform designed for events across Africa. Built with Next.js 15+ and modern web technologies, this platform provides a seamless experience for event discovery, ticket booking, and event management.

## Current Features

### Event Discovery & Browsing
- Browse events with detailed event pages
- Advanced search functionality with filters for:
  - Categories (Music, Technology, Business, etc.)
  - Location (Countries and Cities across Africa)
  - Date
  - Price Range
  - Tags
- Featured events showcase on homepage
- Event image galleries with smooth navigation
- Event details including descriptions, schedules, and locations

### Ticket Management
- Multiple ticket types (Regular, VIP, VVIP)
- Optional Cooler Box Pass for events
- Shopping cart functionality with:
  - Individual ticket type tracking
  - Quantity management
  - Price calculations
  - Service fee (5%) calculation
  - Cart persistence

### User Interface
- Responsive design for all screen sizes
- Modern UI with DaisyUI components
- Smooth animations and transitions
- Intuitive navigation
- Search bar with advanced filtering
- Mobile-friendly navigation menu

## Planned Features

### Authentication & User Management
- User registration and login
- Social media authentication
- User profiles and preferences
- Booking history tracking
- Saved events functionality

### Payment Integration
- Secure payment processing
- Multiple payment methods
- Transaction history
- Refund management

### Event Management
- Event creation for organizers
- Ticket inventory management
- Event analytics and reporting
- Real-time updates

## Tech Stack

### Frontend
- Next.js 15+
- React 19
- TypeScript
- Tailwind CSS with DaisyUI
- Context API for state management

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- Git for version control

## Project Structure
```
src/
├── app/                    # Next.js 13+ App Router pages
│   ├── events/            # Event-related pages
│   ├── blog/             # Blog section
│   └── contact/          # Contact pages
├── components/            # React components
│   ├── layout/           # Layout components (Navbar, Footer)
│   ├── events/           # Event-related components
│   ├── search/           # Search components
│   ├── home/             # Homepage components
│   └── blog/             # Blog components
├── contexts/             # React Context providers
│   └── cart.tsx         # Shopping cart context
├── lib/                  # Utility functions
└── models/              # Data models
```

## Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd ticket-africa
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details
