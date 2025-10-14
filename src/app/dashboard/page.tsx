import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/login/components/LogoutButton";
import FlashCard from "../components/FlashCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: cards } = await supabase
    .from("Card")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Memnō</h1>
              <p className="text-sm text-gray-600">Bienvenue, {user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {(cards ?? []).map((card) => (
            <FlashCard key={card.id} card={card} />
          ))}
        </div>
      </main>
    </div>
  );
}
