export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {children}
      </div>
    </div>
  );
}
