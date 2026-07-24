import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 shadow-sm bg-white">
        <h1 className="text-3xl font-bold text-blue-600">
          FinPilot AI
        </h1>

        <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          Login
        </button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-24">

        <h1 className="text-6xl font-bold text-gray-900">
          Your Intelligent
        </h1>

        <h1 className="text-6xl font-bold text-blue-600 mt-2">
          Financial Copilot
        </h1>

        <p className="mt-8 max-w-3xl text-lg text-gray-600">
          Upload your financial documents, analyze your financial health,
          and receive personalized recommendations using AI and live market data.
        </p>

        <Link href="/upload">
          <button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700">
            Get Started
          </button>
        </Link>

      </section>

      {/* Features */}

      <section className="grid md:grid-cols-3 gap-8 px-10 mt-28 pb-20">

        <div className="rounded-2xl bg-white shadow-lg p-8">
          <h2 className="text-xl font-bold text-blue-600">
            AI Document Analysis
          </h2>

          <p className="mt-4 text-gray-600">
            Upload salary slips and bank statements. AI extracts your financial profile automatically.
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-lg p-8">
          <h2 className="text-xl font-bold text-blue-600">
            Financial Health Score
          </h2>

          <p className="mt-4 text-gray-600">
            Instantly know your income, expenses, savings and financial stability.
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-lg p-8">
          <h2 className="text-xl font-bold text-blue-600">
            Smart Recommendations
          </h2>

          <p className="mt-4 text-gray-600">
            Before buying gold, bikes or taking loans, AI checks whether you can afford them.
          </p>
        </div>

      </section>

    </main>
  );
}