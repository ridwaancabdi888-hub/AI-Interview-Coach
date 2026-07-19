import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">I</span>
      <span>Interviewly<span className="text-indigo-600">AI</span></span>
    </Link>
  );
}
