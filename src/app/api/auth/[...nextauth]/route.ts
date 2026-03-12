import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 在实际生产环境中建议使用环境变量存储账号密码
        const ADMIN_USER = process.env.ADMIN_USER || "admin";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";

        if (
          credentials?.username === ADMIN_USER &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
