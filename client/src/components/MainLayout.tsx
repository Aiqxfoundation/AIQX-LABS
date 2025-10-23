import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  currentChainId?: string;
}

export default function MainLayout({ children, currentChainId }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar currentChainId={currentChainId} />
      <div className="ml-64">
        {/* Top Navigation Bar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-end px-8">
          <button
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            data-testid="button-theme-toggle"
          >
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
