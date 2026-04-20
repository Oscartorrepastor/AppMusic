import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export const middleware = withAuth(
  function middleware(request: NextRequest) {
    // The token is available as request.nextauth.token
    // You can add additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Specify which routes require authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - api/public (public endpoints)
     * - api/music (free external music endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     */
    "/((?!api/auth|api/public|api/music|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
