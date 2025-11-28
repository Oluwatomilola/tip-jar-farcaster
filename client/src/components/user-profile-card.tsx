import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import type { FarcasterUser } from "@shared/schema";

interface UserProfileCardProps {
  user: FarcasterUser | null;
  isLoading?: boolean;
}

export function UserProfileCard({ user, isLoading }: UserProfileCardProps) {
  if (isLoading) {
    return (
      <Card className="p-6" data-testid="card-user-profile-loading">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </Card>
    );
  }

  const displayName = user?.displayName || user?.username || "Anonymous";
  const username = user?.username ? `@${user.username}` : "";
  const fid = user?.fid || 0;

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-6" data-testid="card-user-profile">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage
              src={user?.pfpUrl}
              alt={displayName}
              data-testid="img-user-avatar"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-lg font-semibold">
              {initials || <User className="w-6 h-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <svg
              className="w-3 h-3 text-success-foreground"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <h2
            className="text-lg font-semibold text-foreground"
            data-testid="text-user-displayname"
          >
            {displayName}
          </h2>
          {username && (
            <p
              className="text-sm text-muted-foreground"
              data-testid="text-user-username"
            >
              {username}
            </p>
          )}
          {fid > 0 && (
            <p
              className="text-xs text-muted-foreground/70 font-mono"
              data-testid="text-user-fid"
            >
              FID: {fid.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
