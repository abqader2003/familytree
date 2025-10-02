import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import FamilyTreeCanvas from "@/components/FamilyTreeCanvas";
import PersonDetailsModal from "@/components/PersonDetailsModal";
import LoginForm from "@/components/LoginForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// Interface must reflect the sanitized data returned by /api/persons
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  bio?: string;
  whatsapp?: string; // Only provided if logged in
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  role: "admin" | "user" | "none";
  sideRelations: { id: string; relationType: string }[];
}

interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    role: "admin" | "user" | "none";
  };
}

// Custom hook to fetch the tree data
const usePersonsQuery = () =>
  useQuery<Person[]>({
    queryKey: ["persons"],
    // queryFn is handled by the defaultOptions in queryClient.ts for this example: fetch(key.join('/'))
  });

// Custom hook to fetch auth status
const useAuthStatus = () =>
  useQuery<AuthStatus>({
    queryKey: ["status"],
    queryFn: async () => {
      const res = await fetch("/api/status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch auth status");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // Keep status fresh for 5 minutes
  });

export default function Home() {
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showPersonDetails, setShowPersonDetails] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: personsData, isLoading: isLoadingPersons, isError: isErrorPersons } = usePersonsQuery();
  const { data: authStatus, isLoading: isLoadingAuth } = useAuthStatus();

  const persons = personsData || [];
  const isLoggedIn = authStatus?.isAuthenticated || false;
  const currentUser = authStatus?.user;
  const isAdmin = currentUser?.role === "admin";
  const currentPersonId = currentUser?.id;

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setShowPersonDetails(true);
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoggingIn(true);
    try {
      await apiRequest("POST", "/api/login", { username, password });
      
      // Invalidate both persons and status query to refresh data and header
      await queryClient.invalidateQueries({ queryKey: ["status"] });
      await queryClient.invalidateQueries({ queryKey: ["persons"] });
      
      setShowLoginDialog(false);
      toast({ title: "تم تسجيل الدخول بنجاح", description: `مرحباً بك، ${username}` });
      
    } catch (error) {
      toast({ 
          title: "فشل تسجيل الدخول", 
          description: "تأكد من اسم المستخدم وكلمة المرور.",
          variant: "destructive" 
      });
      console.error(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      // Invalidate queries to update UI
      await queryClient.invalidateQueries({ queryKey: ["status"] });
      await queryClient.invalidateQueries({ queryKey: ["persons"] });
      toast({ title: "تم تسجيل الخروج", description: "لقد خرجت من حسابك." });
    } catch (error) {
      toast({ title: "فشل تسجيل الخروج", description: "حدث خطأ أثناء محاولة تسجيل الخروج.", variant: "destructive" });
      console.error(error);
    }
  };
  
  // Logic to handle Edit Person from modal (re-used logic for current user editing their own profile)
  const handleEditOwnProfile = (person: Person) => {
      if (currentPersonId && currentPersonId === person.id) {
        // Here we would typically show a dedicated UserSettings/EditProfile form
        // For simplicity, we'll navigate to Admin Panel if they are an admin, 
        // or just log the intent for a simple user, as a dedicated "Settings" page is complex.
        toast({ title: "ميزة غير مكتملة", description: "سيتم توجيهك إلى صفحة الإعدادات لتعديل بياناتك." });
        console.log("Navigating to settings/profile edit for:", person.id);
      }
  };
  
  // Logic to determine if the currently logged-in user can edit the selected person
  const canEditSelectedPerson = useMemo(() => {
      if (!isLoggedIn || !selectedPerson) return false;
      if (isAdmin) return true;
      // Normal user can only edit their own profile
      return selectedPerson.id === currentPersonId && selectedPerson.role !== 'none';
  }, [isLoggedIn, isAdmin, selectedPerson, currentPersonId]);


  return (
    <div className="h-screen flex flex-col" dir="rtl">
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        username={currentUser?.username}
        onLoginClick={() => setShowLoginDialog(true)}
        onLogoutClick={handleLogout}
        onAdminClick={() => setLocation("/admin")}
        onSettingsClick={() => toast({ title: "الإعدادات", description: "هذه الميزة غير مكتملة بعد." })}
      />

      <div className="flex-1 overflow-hidden">
        {isLoadingPersons || isLoadingAuth ? (
          <div className="flex items-center justify-center h-full">
             <p className="text-xl text-muted-foreground">جاري تحميل شجرة العائلة...</p>
          </div>
        ) : isErrorPersons ? (
          <div className="flex items-center justify-center h-full">
             <p className="text-xl text-destructive">فشل تحميل بيانات العائلة.</p>
          </div>
        ) : (
          <FamilyTreeCanvas
            persons={persons}
            onPersonClick={handlePersonClick}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

      <PersonDetailsModal
        person={selectedPerson}
        open={showPersonDetails}
        onClose={() => setShowPersonDetails(false)}
        isLoggedIn={isLoggedIn}
        canEdit={canEditSelectedPerson}
        onEdit={handleEditOwnProfile}
      />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <LoginForm onLogin={handleLogin} isLoading={isLoggingIn} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
