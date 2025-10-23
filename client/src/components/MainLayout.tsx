import { useState } from "react";
import Sidebar from "./Sidebar";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  currentChainId?: string;
}

export default function MainLayout({ children, currentChainId }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        currentChainId={currentChainId} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div 
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-56"
        )}
      >
        {/* Top Navigation Bar */}
        <div className="h-14 bg-card border-b border-border flex items-center justify-end px-6">
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
