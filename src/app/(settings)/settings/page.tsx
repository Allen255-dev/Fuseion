import { auth } from "~/app/(auth)/auth";
import { redirect } from "next/navigation";
import { SettingsContent } from "~/components/settings/settings-content";
import { UserInterface } from "~/types/user";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Cast user to UserInterface since we know what the shape is from auth.ts
  const user = session.user as unknown as UserInterface;

  return (
    <div className="w-full min-h-full flex items-start justify-center p-6 animate-in fade-in duration-500">
      <SettingsContent user={user} />
    </div>
  );
}
