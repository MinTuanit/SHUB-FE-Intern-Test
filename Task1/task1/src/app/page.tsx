import Button from "react"

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold text-center">
        This Project is for Task 1 - SHUB FE Intern Test
      </h1>
      <a href="/report" className="text-2xl px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Go to Report Page
      </a>
    </div>

  );
}
