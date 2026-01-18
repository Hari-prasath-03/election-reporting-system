import { cn } from "@/lib/utils";
import { User } from "@/types";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const getInitial = () => user.display_name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <div
      className={cn(
        sizeClasses[size],
        "rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold shadow-md"
      )}
    >
      {getInitial()}
    </div>
  );
}
