"use client";

interface ComingSoonProps {
  dictionary: {
    title: string;
    subtitle: string;
    description: string;
    stayTuned: string;
  };
}

export function ComingSoon({ dictionary }: ComingSoonProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50" />
      
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Brand name */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
          {dictionary.title}
        </h1>
        
        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
        </div>
        
        {/* Subtitle */}
        <h2 className="text-2xl md:text-3xl font-light text-primary tracking-widest uppercase mb-8">
          {dictionary.subtitle}
        </h2>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 font-light">
          {dictionary.description}
        </p>
        
        {/* Stay tuned badge */}
        <div className="inline-flex items-center gap-3 px-8 py-4 border border-border/50 rounded-full bg-card/50 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-sm font-medium tracking-wider uppercase text-foreground">
            {dictionary.stayTuned}
          </span>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
    </div>
  );
}
