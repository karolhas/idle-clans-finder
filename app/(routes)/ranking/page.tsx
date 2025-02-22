//hooks
import Link from "next/link";

export default function RankingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-4xl mb-4">Soon...</h1>
      <Link href="/">
        <p className="text-emerald-500 text-center">
          Use menu button or click here
          <br />
          to back to Home
        </p>
      </Link>
    </div>
  );
}
