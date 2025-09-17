import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      proprioProfile?: any;
      proProfile?: any;
    };
  }

  interface User {
    role: string;
    proprioProfile?: any;
    proProfile?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    proprioProfile?: any;
    proProfile?: any;
  }
}
