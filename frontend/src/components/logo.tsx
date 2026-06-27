import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export function Logo({
  className,
  size = "md",
  variant = "default",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size])}
      >
        <path
          d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4Z"
          fill={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          fillOpacity="0.1"
          stroke={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="2"
        />
        <path
          d="M32 16V48"
          stroke={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M20 28L44 28"
          stroke={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M16 36L48 36"
          stroke={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M24 44L40 44"
          stroke={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M24 20L40 20"
          stroke={variant === "default" ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={cn(
          "font-bold tracking-tight",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
          variant === "default" ? "text-primary" : "text-white",
        )}
      >
        Split<span className="text-indigo-500">Flow</span>
      </span>
    </div>
  );
}
