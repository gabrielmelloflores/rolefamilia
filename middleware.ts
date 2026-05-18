import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const loginUrl = new URL("/entrar", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
