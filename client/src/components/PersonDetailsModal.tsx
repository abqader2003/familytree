import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Briefcase,
  MessageCircle,
  Calendar,
  Lock,
  Edit,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  bio?: string;
  whatsapp?: string;
  role?: "admin" | "user" | "none";
}

interface PersonDetailsModalProps {
  person: Person | null;
  open: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  canEdit?: boolean;
  onEdit?: (person: Person) => void;
}

export default function PersonDetailsModal({
  person,
  open,
  onClose,
  isLoggedIn = false,
  canEdit = false,
  onEdit,
}: PersonDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!person) return null;

  const handleCopyWhatsApp = () => {
    if (person.whatsapp) {
      navigator.clipboard.writeText(person.whatsapp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-person-details">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {person.firstName} {person.lastName}
                </DialogTitle>
                {person.age && (
                  <DialogDescription className="text-base mt-1">
                    {person.age} سنة
                  </DialogDescription>
                )}
              </div>
            </div>
            {person.role && person.role !== "none" && (
              <Badge
                variant={person.role === "admin" ? "default" : "secondary"}
                className="text-sm"
              >
                {person.role === "admin" ? "مدير" : "مستخدم"}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {person.residence && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  الإقامة
                </h4>
                <p className="text-base">{person.residence}</p>
              </div>
            </div>
          )}

          {person.occupation && (
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  العمل
                </h4>
                <p className="text-base">{person.occupation}</p>
              </div>
            </div>
          )}

          {person.bio && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  نبذة
                </h4>
                <p className="text-base leading-relaxed">{person.bio}</p>
              </div>
            </div>
          )}

          {isLoggedIn && person.whatsapp && (
            <div className="bg-accent/30 rounded-lg p-4 border border-accent-border">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                    رقم الواتساب
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-mono">{person.whatsapp}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopyWhatsApp}
                      className="h-8 w-8"
                      data-testid="button-copy-whatsapp"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    سجل دخولك لعرض معلومات الاتصال الخاصة
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="pt-4 border-t border-border mt-6">
            <Button
              onClick={() => onEdit && onEdit(person)}
              className="w-full"
              data-testid="button-edit-person"
            >
              <Edit className="w-4 h-4 ml-2" />
              تعديل البيانات
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
