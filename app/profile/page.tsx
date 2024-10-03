import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  const user = session.user;

  return <ProfileClient user={user} />;
}
