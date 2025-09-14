"use client";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <Image
              src="/window.svg"
              alt="Logo"
              width={48}
              height={48}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold tracking-tight">
              Distraction Tracker
            </h1>
            <p className="text-muted-foreground">
              Track and improve your focus one distraction at a time
            </p>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Background pattern */}
      <div className="hidden lg:block relative bg-muted">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/10" />
        <div className="absolute bottom-8 left-8 right-8 text-center text-muted-foreground">
          <p className="text-sm">Built with Next.js, shadcn/ui, and MongoDB</p>
        </div>
      </div>
    </div>
  );
}
