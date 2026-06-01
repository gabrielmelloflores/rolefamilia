import type { NextAuthConfig } from "next-auth";

// Configuração leve para o middleware (Edge-compatible, sem Prisma/bcrypt)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/entrar",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [],
};
