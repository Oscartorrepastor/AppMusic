# AppMusic

A modern music streaming application built with Next.js, TypeScript, and PostgreSQL.

Una aplicación moderna de streaming musical construida con Next.js, TypeScript y PostgreSQL.

## Features / Funcionalidades

### Authentication System / Sistema de autenticación
- ✅ User registration with secure password hashing (bcrypt)
- ✅ Login with NextAuth.js credentials provider
- ✅ JWT-based session management
- ✅ Protected routes with automatic redirect to login
- ✅ Form validation with react-hook-form and zod

- ✅ Registro de usuario con hash seguro de contraseña (bcrypt)
- ✅ Inicio de sesión con proveedor de credenciales de NextAuth.js
- ✅ Gestión de sesiones con JWT
- ✅ Rutas protegidas con redirección automática al login
- ✅ Validación de formularios con react-hook-form y zod

### User Interface / Interfaz de usuario
- ✅ Dark theme design inspired by modern music streaming apps
- ✅ Responsive layout with sidebar navigation
- ✅ Dashboard with Home, Search, Library, Playlists, and Liked Songs
- ✅ User profile dropdown with sign out functionality
- ✅ Player bar placeholder (ready for audio implementation)

- ✅ Diseño en tema oscuro inspirado en apps modernas de streaming musical
- ✅ Diseño responsive con navegación en barra lateral
- ✅ Panel con Inicio, Buscar, Biblioteca, Listas de reproducción y Canciones guardadas
- ✅ Menú de perfil de usuario con opción de cerrar sesión
- ✅ Barra de reproducción como marcador de posición (lista para implementación de audio)

### Tech Stack / Tecnologías
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: react-hook-form with zod validation
- **Icons**: Lucide React

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js v4
- **Componentes UI**: shadcn/ui con Radix UI
- **Estilos**: Tailwind CSS
- **Formularios**: react-hook-form con validación zod
- **Iconos**: Lucide React

## Getting Started / Comenzando

### Prerequisites / Requisitos previos
- Node.js 20+ 
- PostgreSQL database
- npm or yarn

- Node.js 20+
- Base de datos PostgreSQL
- npm o yarn

### Installation / Instalación

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

1. Clona el repositorio:
```bash
git clone https://github.com/Oscartorrepastor/AppMusic.git
cd AppMusic
```

2. Instala dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita `.env` con tu configuración:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/appmusic?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-aqui"
NODE_ENV="development"
```

4. Configura la base de datos:
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Project Structure / Estructura del proyecto

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

```
AppMusic/
├── app/
│   ├── (dashboard)/          # Rutas protegidas del panel
│   │   ├── layout.tsx       # Layout del panel con barra lateral
│   │   ├── page.tsx         # Página principal
│   │   └── library/         # Página de biblioteca
│   ├── api/
│   │   └── auth/            # Rutas API de autenticación
│   │       ├── [...nextauth]/ # Configuración de NextAuth
│   │       └── register/    # Endpoint de registro de usuario
│   ├── login/               # Página de inicio de sesión
│   └── register/            # Página de registro
├── components/
│   ├── layout/              # Componentes de layout
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── PlayerBar.tsx
│   └── ui/                  # Componentes shadcn/ui
├── lib/
│   ├── auth.ts             # Funciones de ayuda de autenticación
│   ├── prisma.ts           # Cliente Prisma singleton
│   └── utils.ts            # Funciones utilitarias
├── prisma/
│   └── schema.prisma       # Esquema de base de datos
├── types/
│   ├── index.ts            # Definiciones globales de tipos
│   └── next-auth.d.ts      # Extensiones de tipos de NextAuth
└── public/                 # Activos estáticos
```

## Database Schema / Esquema de Base de Datos

The application uses the following main models:

- **User**: User accounts with email and password
- **Song**: Music tracks with metadata
- **Album**: Album information
- **Playlist**: User-created playlists
- **Favorite**: User's liked songs

See `prisma/schema.prisma` for the complete schema.

La aplicación usa los siguientes modelos principales:

- **Usuario**: Cuentas de usuario con correo electrónico y contraseña
- **Canción**: Pistas musicales con metadatos
- **Álbum**: Información del álbum
- **Lista de reproducción**: Listas creadas por el usuario
- **Favorito**: Canciones guardadas por el usuario

Consulta `prisma/schema.prisma` para ver el esquema completo.

## Authentication Flow / Flujo de autenticación

1. User registers via `/register` with name, email, and password
2. Password is hashed with bcrypt (12 rounds)
3. User can log in via `/login` with email and password
4. NextAuth.js creates a JWT session
5. Protected routes check for valid session
6. Unauthenticated users are redirected to `/login`

1. El usuario se registra en `/register` con nombre, correo electrónico y contraseña
2. La contraseña se cifra con bcrypt (12 rondas)
3. El usuario puede iniciar sesión en `/login` con correo y contraseña
4. NextAuth.js crea una sesión JWT
5. Las rutas protegidas verifican una sesión válida
6. Los usuarios no autenticados son redirigidos a `/login`

## Development / Desarrollo

### Available Scripts / Scripts disponibles

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run prisma:generate` - Genera el cliente de Prisma
- `npm run prisma:migrate` - Ejecuta migraciones de base de datos
- `npm run prisma:studio` - Abre Prisma Studio

### Code Style / Estilo de código

This project follows:
- TypeScript strict mode
- ESLint configuration from Next.js
- Tailwind CSS for styling
- Conventional Commits for commit messages

Este proyecto sigue:
- Modo estricto de TypeScript
- Configuración ESLint de Next.js
- Tailwind CSS para estilos
- Commits con Conventional Commits

## Security / Seguridad

- Passwords are hashed with bcrypt (12 rounds)
- JWT sessions with secure secret
- Environment variables for sensitive data
- Input validation with zod
- Protected API routes
- CSRF protection via NextAuth.js

- Las contraseñas se cifran con bcrypt (12 rondas)
- Sesiones JWT con secreto seguro
- Variables de entorno para datos sensibles
- Validación de entrada con zod
- Rutas API protegidas
- Protección CSRF con NextAuth.js

## Security Summary / Resumen de seguridad

### Implemented Security Measures / Medidas de seguridad implementadas
✅ Password hashing with bcrypt (12 rounds)
✅ JWT-based session management
✅ Input validation on all forms
✅ Environment variables for secrets
✅ No hardcoded credentials
✅ Protected routes with authentication checks
✅ Secure password requirements (min 6 characters)

✅ Hash de contraseñas con bcrypt (12 rondas)
✅ Gestión de sesiones basada en JWT
✅ Validación de entradas en todos los formularios
✅ Variables de entorno para secretos
✅ No hay credenciales codificadas
✅ Rutas protegidas con comprobación de autenticación
✅ Requisitos seguros de contraseña (mínimo 6 caracteres)

### No Known Vulnerabilities / Sin vulnerabilidades conocidas
The codebase has been reviewed and contains no known security vulnerabilities at the time of implementation.

El código ha sido revisado y no contiene vulnerabilidades conocidas en el momento de la implementación.

## Contributing / Contribuir

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

1. Haz un fork del repositorio
2. Crea una rama de características (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add amazing feature'`)
4. Sube la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## License / Licencia

This project is private and proprietary.

Este proyecto es privado y propietario.

## Acknowledgments / Agradecimientos

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
