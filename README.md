# AppMusic

A modern music streaming application built with Next.js, TypeScript, and PostgreSQL.

## Features

### Authentication System
- ✅ User registration with secure password hashing (bcrypt)
- ✅ Login with NextAuth.js credentials provider
- ✅ JWT-based session management
- ✅ Protected routes with automatic redirect to login
- ✅ Form validation with react-hook-form and zod

### User Interface
- ✅ Dark theme design inspired by modern music streaming apps
- ✅ Responsive layout with sidebar navigation
- ✅ Dashboard with Home, Search, Library, Playlists, and Liked Songs
- ✅ User profile dropdown with sign out functionality
- ✅ Player bar placeholder (ready for audio implementation)

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: react-hook-form with zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Oscartorrepastor/AppMusic.git
cd AppMusic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/appmusic?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

4. Set up the database:
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
AppMusic/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   ├── page.tsx         # Home page
│   │   └── library/         # Library page
│   ├── api/
│   │   └── auth/            # Authentication API routes
│   │       ├── [...nextauth]/ # NextAuth configuration
│   │       └── register/    # User registration endpoint
│   ├── login/               # Login page
│   └── register/            # Registration page
├── components/
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── PlayerBar.tsx
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── auth.ts             # Auth helper functions
│   ├── prisma.ts           # Prisma client singleton
│   └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
├── types/
│   ├── index.ts            # Global type definitions
│   └── next-auth.d.ts      # NextAuth type extensions
└── public/                 # Static assets
```

## Database Schema

The application uses the following main models:

- **User**: User accounts with email and password
- **Song**: Music tracks with metadata
- **Album**: Album information
- **Playlist**: User-created playlists
- **Favorite**: User's liked songs

See `prisma/schema.prisma` for the complete schema.

## Authentication Flow

1. User registers via `/register` with name, email, and password
2. Password is hashed with bcrypt (12 rounds)
3. User can log in via `/login` with email and password
4. NextAuth.js creates a JWT session
5. Protected routes check for valid session
6. Unauthenticated users are redirected to `/login`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Code Style

This project follows:
- TypeScript strict mode
- ESLint configuration from Next.js
- Tailwind CSS for styling
- Conventional Commits for commit messages

## Security

- Passwords are hashed with bcrypt (12 rounds)
- JWT sessions with secure secret
- Environment variables for sensitive data
- Input validation with zod
- Protected API routes
- CSRF protection via NextAuth.js

## Security Summary

### Implemented Security Measures
✅ Password hashing with bcrypt (12 rounds)
✅ JWT-based session management
✅ Input validation on all forms
✅ Environment variables for secrets
✅ No hardcoded credentials
✅ Protected routes with authentication checks
✅ Secure password requirements (min 6 characters)

### No Known Vulnerabilities
The codebase has been reviewed and contains no known security vulnerabilities at the time of implementation.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
