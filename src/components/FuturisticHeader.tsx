
import React from 'react';

const FuturisticHeader = () => {
  return (
    <header className="relative p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-background rounded-full pulse-glow"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
              QUANTUM STORE
            </h1>
            <p className="text-sm text-muted-foreground">Neural Phone Management System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-primary text-sm font-mono">SYS STATUS</div>
            <div className="text-xs text-accent">ONLINE</div>
          </div>
          <div className="w-2 h-12 bg-gradient-to-t from-primary to-accent rounded-full pulse-glow"></div>
        </div>
      </div>
      
      {/* Neural scan line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent">
        <div className="h-full w-20 bg-primary animate-neural-scan"></div>
      </div>
    </header>
  );
};

export default FuturisticHeader;
