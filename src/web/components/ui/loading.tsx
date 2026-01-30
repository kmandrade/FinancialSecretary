"use client";

import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({
  size = "md",
  text,
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  const containerSizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {/* Animated logo container */}
      <div className="relative">
        {/* Pulsing ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl bg-primary/20 animate-ping",
            containerSizeClasses[size]
          )}
        />
        
        {/* Outer glow ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl bg-gradient-to-r from-primary/40 to-accent/40 animate-pulse",
            containerSizeClasses[size]
          )}
        />
        
        {/* Main icon container */}
        <div
          className={cn(
            "relative flex items-center justify-center rounded-xl bg-primary shadow-lg",
            containerSizeClasses[size]
          )}
        >
          <TrendingUp
            className={cn(
              "text-primary-foreground animate-bounce",
              sizeClasses[size]
            )}
            style={{
              animationDuration: "1s",
              animationTimingFunction: "ease-in-out",
            }}
          />
        </div>

        {/* Floating particles effect */}
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-ping" style={{ animationDelay: "0.2s" }} />
        <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-primary animate-ping" style={{ animationDelay: "0.5s" }} />
      </div>

      {/* Loading text */}
      {text && (
        <p className={cn("font-medium text-muted-foreground animate-pulse", textSizeClasses[size])}>
          {text}
        </p>
      )}

      {/* Loading bar */}
      <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-loading-bar" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export function LoadingOverlay({
  isLoading,
  children,
  text,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-lg">
          <Loading size="sm" text={text} />
        </div>
      )}
    </div>
  );
}

export function PageLoading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

export function ButtonLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-4 w-4">
        <TrendingUp className="h-4 w-4 text-current animate-bounce" style={{ animationDuration: "0.8s" }} />
      </div>
    </div>
  );
}
