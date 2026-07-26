export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue-600">
        FinPilot AI
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">Demo User</p>
          <p className="text-sm text-gray-500">
            Financial Dashboard
          </p>
        </div>

        <img
          src="https://ui-avatars.com/api/?name=Demo+User&background=2563eb&color=fff"
          className="w-12 h-12 rounded-full"
          alt="profile"
        />
      </div>
    </nav>
  );
}