# Ticket Africa

A modern and robust ticket booking platform designed for events across Africa. Built with Next.js 14+ and modern web technologies, this platform provides a seamless experience for event discovery, ticket booking, and event management.

## Features

### Event Management
- Create, edit, and manage events
- Multiple ticket types with customizable pricing
- Event analytics and performance tracking
- QR code-based ticket validation
- Real-time ticket scanning and validation
- Comprehensive event analytics dashboard

### User Management
- Role-based access control (Admin, Organizer, Staff, Scanner, User)
- User registration and authentication with NextAuth
- Social media authentication
- Profile management with avatar support
- Ticket purchase history
- Saved events functionality

### Payment Processing
- Secure payment integration with Paystack
- Multiple payment methods support
- Transaction history tracking
- Automated refund processing
- Service fee calculations

### Admin Dashboard
- Comprehensive analytics dashboard
- User management system
- Revenue tracking and reporting
- Event performance metrics
- Geographic data visualization
- Category performance analysis
- Real-time sales monitoring

### Event Discovery
- Advanced search with multiple filters
- Category-based browsing
- Location-based event discovery
- Price range filtering
- Date-based event filtering
- Featured events showcase

### Ticket Management
- Multiple ticket types support
- QR code generation for tickets
- Digital ticket delivery
- Ticket transfer capability
- Bulk ticket purchase
- Ticket validation system

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- DaisyUI
- Chart.js
- Socket.IO Client
- Framer Motion

### Backend
- Next.js API Routes
- MongoDB with Mongoose
- NextAuth.js
- Socket.IO
- JSON Web Tokens
- Cloudinary for image storage

### Payment Integration
- Paystack Payment Gateway

### Development Tools
- TypeScript
- ESLint
- Prettier
- PostCSS
- Autoprefixer

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard and management
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── events/            # Event pages
│   ├── profile/           # User profile pages
│   ├── scanner/           # Ticket scanning interface
│   └── tickets/           # Ticket management
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── auth/             # Authentication components
│   ├── event/            # Event-related components
│   ├── layout/           # Layout components
│   ├── profile/          # Profile components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── lib/                  # Utility functions
└── models/               # Mongoose models
```

## Key Features

### Admin Dashboard
- Real-time analytics
- User management
- Event oversight
- Revenue tracking
- Geographic analysis
- Performance metrics

### Event Management
- Event creation and editing
- Ticket type configuration
- Attendee management
- Sales tracking
- Analytics reporting

### User Features
- Profile customization
- Ticket purchasing
- Event browsing
- Order history
- Saved events
- QR code tickets

## Getting Started

### Prerequisites
- Node.js 16.8 or later
- MongoDB database
- Paystack account
- Cloudinary account

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url
PAYSTACK_SECRET_KEY=your_paystack_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ticket-africa.git
cd ticket-africa
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a .env.local file and add the required environment variables

4. Run the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
npm start
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
