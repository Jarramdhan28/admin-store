// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

import { authMiddleware } from "@clerk/nextjs/server";  


export default authMiddleware({
  publicRoutes: ["/api/:path*"]
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"
    
    // // Skip Next.js internals and all static files, unless found in search params
    // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // // Always run for API routes
    // '/(api|trpc)(.*)',
  ],
};

