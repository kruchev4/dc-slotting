import Link from "next/link";

export default function Page() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">DC Slotting</h1>
      <Link className="text-blue-600 underline" href="/map-builder">
        Go to Map Builder
      </Link>
    </main>
  );
}
