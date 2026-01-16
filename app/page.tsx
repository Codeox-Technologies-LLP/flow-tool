import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  // Redirect based on authentication status
  if (authToken) {
    redirect("/flow-tool");
  } else {
    redirect("/auth/login");
  }
}
