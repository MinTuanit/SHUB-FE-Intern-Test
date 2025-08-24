import TransactionForm from "../components/transactionForm";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold text-center">
        This Project is for Task 2 - SHUB FE Intern Test
      </h1>
      <TransactionForm />
    </div>
  );
}
