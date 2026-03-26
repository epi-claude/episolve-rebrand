import { ReactNode } from "react";

interface DiameticaLayoutProps {
  children: ReactNode;
}

export function DiameticaLayout({ children }: DiameticaLayoutProps) {
  return (
    <div className="min-h-screen bg-[#edf2f7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            GROUP TO GO{" "}
            <span className="text-[#e97316]">INC.</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Secure Travel Authorization Forms</p>
          <p className="text-xs text-gray-400">
            Complete the forms below to authorize Group To Go to book and pay for your travel.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Group To Go Inc. All rights reserved.
      </footer>
    </div>
  );
}
