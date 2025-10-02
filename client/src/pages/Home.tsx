import { useState } from "react";
import Header from "@/components/Header";
import FamilyTreeCanvas from "@/components/FamilyTreeCanvas";
import PersonDetailsModal from "@/components/PersonDetailsModal";
import LoginForm from "@/components/LoginForm";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  bio?: string;
  whatsapp?: string;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  role?: "admin" | "user" | "none";
}

const mockPersons: Person[] = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "السالم",
    age: 85,
    residence: "الرياض، المملكة العربية السعودية",
    occupation: "متقاعد",
    bio: "جد العائلة، أسس الأعمال التجارية للعائلة في الستينيات",
    whatsapp: "+966501111111",
    role: "none",
  },
  {
    id: "2",
    firstName: "فاطمة",
    lastName: "العلي",
    age: 80,
    residence: "الرياض، المملكة العربية السعودية",
    occupation: "ربة منزل",
    bio: "جدة العائلة، معلمة متقاعدة",
    whatsapp: "+966501111112",
    spouseId: "1",
    role: "none",
  },
  {
    id: "3",
    firstName: "محمد",
    lastName: "السالم",
    age: 55,
    residence: "جدة، المملكة العربية السعودية",
    occupation: "مهندس معماري",
    bio: "مهندس معماري متخصص في التصميم الحديث مع لمسات تراثية",
    whatsapp: "+966502222222",
    fatherId: "1",
    role: "admin",
  },
  {
    id: "4",
    firstName: "سارة",
    lastName: "الأحمد",
    age: 52,
    residence: "جدة، المملكة العربية السعودية",
    occupation: "معلمة لغة عربية",
    bio: "معلمة لغة عربية في مدرسة ثانوية",
    whatsapp: "+966502222223",
    spouseId: "3",
    role: "user",
  },
  {
    id: "5",
    firstName: "خالد",
    lastName: "السالم",
    age: 28,
    residence: "الرياض، المملكة العربية السعودية",
    occupation: "طبيب",
    bio: "طبيب أطفال في مستشفى حكومي",
    whatsapp: "+966503333333",
    fatherId: "3",
    role: "user",
  },
  {
    id: "6",
    firstName: "نورة",
    lastName: "السالم",
    age: 25,
    residence: "جدة، المملكة العربية السعودية",
    occupation: "مصممة جرافيك",
    bio: "مصممة جرافيك تعمل في شركة إعلانات",
    whatsapp: "+966503333334",
    fatherId: "3",
    role: "user",
  },
  {
    id: "7",
    firstName: "عبدالله",
    lastName: "السالم",
    age: 50,
    residence: "الدمام، المملكة العربية السعودية",
    occupation: "رجل أعمال",
    bio: "رجل أعمال في قطاع الاستيراد والتصدير",
    whatsapp: "+966504444444",
    fatherId: "1",
    role: "user",
  },
  {
    id: "8",
    firstName: "منى",
    lastName: "الحربي",
    age: 48,
    residence: "الدمام، المملكة العربية السعودية",
    occupation: "صيدلانية",
    bio: "صيدلانية تدير صيدلية خاصة",
    whatsapp: "+966504444445",
    spouseId: "7",
    role: "user",
  },
  {
    id: "9",
    firstName: "يوسف",
    lastName: "السالم",
    age: 22,
    residence: "الدمام، المملكة العربية السعودية",
    occupation: "طالب جامعي",
    bio: "طالب هندسة حاسب في السنة النهائية",
    whatsapp: "+966505555555",
    fatherId: "7",
    role: "user",
  },
  {
    id: "10",
    firstName: "عمر",
    lastName: "السالم",
    age: 48,
    residence: "الرياض، المملكة العربية السعودية",
    occupation: "محامي",
    bio: "محامي متخصص في القضايا التجارية",
    whatsapp: "+966506666666",
    fatherId: "1",
    role: "user",
  },
  {
    id: "11",
    firstName: "لينا",
    lastName: "القحطاني",
    age: 45,
    residence: "الرياض، المملكة العربية السعودية",
    occupation: "طبيبة أسنان",
    bio: "طبيبة أسنان تملك عيادة خاصة",
    whatsapp: "+966506666667",
    spouseId: "10",
    role: "user",
  },
  {
    id: "12",
    firstName: "ريم",
    lastName: "السالم",
    age: 20,
    residence: "الرياض، المملكة العربية السعودية",
    occupation: "طالبة جامعية",
    bio: "طالبة طب في السنة الثالثة",
    whatsapp: "+966507777777",
    fatherId: "10",
    role: "user",
  },
];

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showPersonDetails, setShowPersonDetails] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setShowPersonDetails(true);
  };

  const handleLogin = (username: string, password: string) => {
    console.log("Login:", username);
    setIsLoggedIn(true);
    setCurrentUser(username);
    setShowLoginDialog(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    console.log("Logged out");
  };

  return (
    <div className="h-screen flex flex-col" dir="rtl">
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isLoggedIn}
        username={currentUser || undefined}
        onLoginClick={() => setShowLoginDialog(true)}
        onLogoutClick={handleLogout}
        onAdminClick={() => console.log("Navigate to admin")}
        onSettingsClick={() => console.log("Navigate to settings")}
      />

      <div className="flex-1 overflow-hidden">
        <FamilyTreeCanvas
          persons={mockPersons}
          onPersonClick={handlePersonClick}
          isLoggedIn={isLoggedIn}
        />
      </div>

      <PersonDetailsModal
        person={selectedPerson}
        open={showPersonDetails}
        onClose={() => setShowPersonDetails(false)}
        isLoggedIn={isLoggedIn}
        canEdit={isLoggedIn}
        onEdit={(person) => console.log("Edit person:", person)}
      />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <LoginForm onLogin={handleLogin} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
