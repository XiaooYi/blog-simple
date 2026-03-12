import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}