import { auth } from "@/auth";
import ProfileClient from "@/components/Profile/ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  const user = session.user;

  return <ProfileClient user={user} />;
}
