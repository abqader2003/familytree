import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Briefcase, Lock } from "lucide-react";

interface PersonCardProps {
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  bio?: string;
  role?: "admin" | "user" | "none";
  onClick?: () => void;
  isLoggedIn?: boolean;
}

export default function PersonCard({
  firstName,
  lastName,
  age,
  residence,
  occupation,
  bio,
  role,
  onClick,
  isLoggedIn,
}: PersonCardProps) {
  return (
    <Card
      className="w-full max-w-sm hover-elevate active-elevate-2 cursor-pointer transition-all duration-200"
      onClick={onClick}
      data-testid={`card-person-${firstName}-${lastName}`}
    >
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {firstName} {lastName}
              </h3>
              {age && (
                <p className="text-sm text-muted-foreground">{age} سنة</p>
              )}
            </div>
          </div>
          {role && role !== "none" && (
            <Badge
              variant={role === "admin" ? "default" : "secondary"}
              className="text-xs"
            >
              {role === "admin" ? "مدير" : "مستخدم"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {residence && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{residence}</span>
          </div>
        )}
        
        {occupation && (
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{occupation}</span>
          </div>
        )}

        {bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t border-card-border">
            {bio}
          </p>
        )}

        {!isLoggedIn && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-card-border">
            <Lock className="w-3 h-3" />
            <span>سجل دخولك لعرض معلومات الاتصال</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
