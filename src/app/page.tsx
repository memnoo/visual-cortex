import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Memnō
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Apprenez plus vite avec des flashcards intelligentes générées par
            l'IA
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-lg font-semibold mb-2">IA Personnalisée</h3>
            <p className="text-gray-600">
              Génération automatique de flashcards adaptées à votre niveau
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Suivi Intelligent</h3>
            <p className="text-gray-600">
              Algorithme d'espacement répété pour optimiser votre mémorisation
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold mb-2">Multi-Domaines</h3>
            <p className="text-gray-600">
              Langues, sciences, médecine... Apprenez ce que vous voulez
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link
            href="/login"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Commencer gratuitement
          </Link>

          <Link
            href="/about"
            className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-indigo-200"
          >
            En savoir plus
          </Link>
        </div>

        <div className="mt-16 text-gray-500 text-sm">
          <p>Rejoignez des milliers d'apprenants qui utilisent Memnō</p>
        </div>
      </div>
    </main>
  );
}
