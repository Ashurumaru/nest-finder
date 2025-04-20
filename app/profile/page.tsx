// ProfilePage.tsx (Server Component)
import { auth } from "@/auth";
import ProfileClient from "@/components/profile/ProfileClient";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Личный кабинет - Управление профилем",
  description: "Управление личными данными, настройка аккаунта и просмотр избранной недвижимости",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin?callbackUrl=/profile");
  }

  const user = session.user;

  return <ProfileClient user={user} />;
}