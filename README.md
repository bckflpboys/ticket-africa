# Ticket Africa

A modern and robust ticket booking platform designed for events across Africa. Built with Next.js 15+ and modern web technologies, this platform provides a seamless experience for event discovery, ticket booking, and event management.

## Core Features

- **Event Discovery**
  - Browse and search events
  - Featured events showcase
  - Event categories and filtering
  - Detailed event pages with rich information

- **Ticket Management**
  - Secure ticket booking via Paystack
  - Digital ticket generation
  - Ticket validation system
  - Booking history

- **User Features**
  - Authentication with NextAuth.js
  - User profiles and preferences
  - Booking history tracking
  - Saved events

- **Event Management**
  - Event creation and editing
  - Ticket inventory management
  - Event analytics and reporting
  - Real-time updates using Socket.IO

## Tech Stack

- **Frontend**
  - Next.js 15+
  - React 19
  - TypeScript
  - Tailwind CSS with DaisyUI
  - Framer Motion for animations

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - Socket.IO for real-time features

- **Authentication & Payments**
  - NextAuth.js
  - Paystack Payment Gateway
  - JWT for API authentication

- **Cloud Services**
  - Cloudinary for media storage
  - MongoDB Atlas for database

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB instance
- Paystack account for payments
- Cloudinary account for media storage

### Environment Setup

Create a `.env.local` file with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=your_paystack_secret_key
CLOUDINARY_URL=your_cloudinary_url
```

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

## Project Structure

```
├── src/
│   ├── app/          # Next.js 13+ App Router pages and layouts
│   │   ├── events/   # Event-related pages
│   │   ├── blog/     # Blog section
│   │   └── about/    # About pages
│   ├── components/   # Reusable React components
│   │   └── layout/   # Layout components like Navbar
│   ├── lib/          # Utility functions and configurations
│   └── models/       # MongoDB/Mongoose models
├── public/           # Static assets
└── config files      # Various configuration files
```

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
