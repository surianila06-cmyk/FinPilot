export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8">

        <h1 className="text-3xl font-bold text-blue-600">
          FinPilot AI
        </h1>

        <div className="border rounded-xl mt-6 h-96 overflow-y-auto p-5">

          <div className="flex justify-end">
            <div className="bg-blue-600 text-white rounded-xl px-5 py-3">
              Can I buy 1kg gold?
            </div>
          </div>

          <div className="mt-6 flex">
            <div className="bg-gray-100 rounded-xl px-5 py-3">
              Based on your financial profile, purchasing 1kg of gold is not recommended.
            </div>
          </div>

        </div>

        <div className="flex mt-6">

          <input
            placeholder="Ask FinPilot AI..."
            className="flex-1 border rounded-l-xl p-4"
          />

          <button className="bg-blue-600 text-white px-8 rounded-r-xl">
            Send
          </button>

        </div>

      </div>

    </main>
  );
}