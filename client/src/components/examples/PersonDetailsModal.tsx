import { useState } from "react";
import PersonDetailsModal from "../PersonDetailsModal";
import { Button } from "@/components/ui/button";

const mockPerson = {
  id: "1",
  firstName: "محمد",
  lastName: "السالم",
  age: 55,
  residence: "جدة، المملكة العربية السعودية",
  occupation: "مهندس برمجيات",
  bio: "مهندس برمجيات متخصص في تطوير التطبيقات الحديثة، له خبرة 20 عاماً في المجال. يعمل حالياً كمدير تقني في شركة تقنية رائدة.",
  whatsapp: "+966501234567",
  role: "admin" as const,
};

export default function PersonDetailsModalExample() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="p-8 flex flex-col gap-4" dir="rtl">
      <div className="flex gap-4">
        <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
          فتح التفاصيل
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          data-testid="button-toggle-login"
        >
          {isLoggedIn ? "تسجيل خروج" : "تسجيل دخول"}
        </Button>
      </div>

      <PersonDetailsModal
        person={mockPerson}
        open={open}
        onClose={() => setOpen(false)}
        isLoggedIn={isLoggedIn}
        canEdit={isLoggedIn}
        onEdit={(person) => console.log("Edit person:", person)}
      />
    </div>
  );
}
