"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white">
      <Image src="/app_logo_transparent.png" alt="Logo" height={303} width={254} className="opacity-80 w-32 mb-6" />

      <h1 className="text-4xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">Oops! The page you’re looking for doesn’t exist or has been moved.</p>

      <Button onClick={() => router.push("/")} className="text-white bg-primary hover:bg-primary/90">
        Go to Home
      </Button>
    </div>
  );
}
