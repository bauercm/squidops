import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">That page doesn&apos;t exist, or it moved.</p>
      <Link href="/" className="mt-6 inline-block text-accent underline">
        Back home
      </Link>
    </div>
  );
}
