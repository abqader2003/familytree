import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import AdminPanel from "@/components/AdminPanel";
import PersonForm from "@/components/PersonForm";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

// The full person interface, as Admin gets all data
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  role: "admin" | "user" | "none";
  bio?: string;
  whatsapp?: string;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  username?: string;
}

// Form data type for submission
interface PersonFormData {
  id?: string; // exists for edit mode
  firstName: string;
  lastName: string;
  age?: string; // kept as string for form
  residence?: string;
  occupation?: string;
  bio?: string;
  whatsapp?: string;
  role: "admin" | "user" | "none";
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  newUsername?: string;
  newPassword?: string;
}

// Fetch Persons Hook (Centralized for Admin and Home)
const usePersonsQuery = () =>
  useQuery<Person[]>({
    queryKey: ["persons"],
  });
  
// Custom hook to fetch auth status (copied from Home.tsx for a complete file structure)
interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    role: "admin" | "user" | "none";
  };
}
const useAuthStatus = () =>
  useQuery<AuthStatus>({
    queryKey: ["status"],
    queryFn: async () => {
      const res = await fetch("/api/status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch auth status");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

// Mutations for CRUD operations
const usePersonMutations = () => {
  const queryClient = useQueryClient();
  
  // Add/Edit Mutation
  const savePerson = useMutation({
    mutationFn: (data: PersonFormData) => {
      const payload = {
        ...data,
        age: data.age ? parseInt(data.age) : undefined, // Convert age back to number or undefined
      };
      
      if (data.id) {
        // Update existing person
        return apiRequest("PATCH", `/api/persons/${data.id}`, payload);
      } else {
        // Create new person
        return apiRequest("POST", "/api/persons", payload);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      const action = variables.id ? "تعديل" : "إضافة";
      toast({ title: `تم ${action} الفرد بنجاح`, description: `${variables.firstName} ${variables.lastName}` });
    },
    onError: (error) => {
      toast({ title: "فشل الحفظ", description: error.message, variant: "destructive" });
    },
  });
  
  // Delete Mutation
  const deletePerson = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/persons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persons"] });
      toast({ title: "تم الحذف بنجاح", description: "تم حذف الفرد من شجرة العائلة." });
    },
    onError: (error) => {
      toast({ title: "فشل الحذف", description: error.message, variant: "destructive" });
    },
  });
  
  // Change Password Mutation
  const changePassword = useMutation({
      mutationFn: ({ id, newPassword }: { id: string, newPassword: string }) => 
          apiRequest("PATCH", `/api/change-password/${id}`, { newPassword }),
      onSuccess: () => {
          toast({ title: "تم تغيير كلمة المرور", description: "تم تحديث كلمة مرور المستخدم بنجاح." });
      },
      onError: (error) => {
          toast({ title: "فشل تغيير كلمة المرور", description: error.message, variant: "destructive" });
      },
  });

  return { savePerson, deletePerson, changePassword };
};

export default function Admin() {
  const queryClient = useQueryClient();
  const { savePerson, deletePerson, changePassword } = usePersonMutations();
  const [location, setLocation] = useLocation();

  const { data: personsData, isLoading: isLoadingPersons } = usePersonsQuery();
  const { data: authStatus, isLoading: isLoadingAuth } = useAuthStatus();
  
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);
  
  // Auth Check
  if (isLoadingAuth || isLoadingPersons) {
    return <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl"><p className="text-xl">جاري التحقق من الصلاحيات...</p></div>;
  }
  
  const isAdmin = authStatus?.user?.role === "admin";
  const username = authStatus?.user?.username;

  if (!isAdmin) {
      // Redirect unauthenticated or non-admin users to home
      setLocation("/");
      return null;
  }


  const handleAddPerson = () => {
    setEditingPerson(null);
    setShowPersonForm(true);
  };

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setShowPersonForm(true);
  };

  const handleDeletePerson = (personId: string) => {
    setDeletingPersonId(personId);
  };

  const confirmDelete = () => {
    if (deletingPersonId) {
      deletePerson.mutate(deletingPersonId);
      setDeletingPersonId(null);
    }
  };

  const handleFormSubmit = (data: PersonFormData) => {
    savePerson.mutate(data, {
      onSuccess: () => {
        setShowPersonForm(false);
        setEditingPerson(null);
      },
    });
  };
  
  // Placeholder for Change Password Logic
  const handleChangePassword = (personId: string) => {
      const newPassword = prompt("أدخل كلمة المرور الجديدة:");
      if (newPassword) {
          changePassword.mutate({ id: personId, newPassword });
      }
  };
  
  // Placeholder for Import/Export
  const handleExportData = () => {
      // Direct link to the API endpoint, browser will download
      window.open("/api/export", "_blank");
      toast({ title: "بدء التصدير", description: "جاري تنزيل ملف البيانات JSON..." });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header
        isLoggedIn={true}
        isAdmin={isAdmin}
        username={username}
        onLogoutClick={async () => { await apiRequest("POST", "/api/logout"); setLocation("/"); }}
        onAdminClick={() => console.log("Admin clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
      />

      <AdminPanel
        persons={personsData || []}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        onExportData={handleExportData}
        onImportData={() => toast({ title: "استيراد", description: "ميزة الاستيراد غير مكتملة في هذا المثال.", variant: "secondary" })}
        onChangePassword={handleChangePassword}
      />

      <Dialog open={showPersonForm} onOpenChange={setShowPersonForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <PersonForm
            initialData={
              editingPerson
                ? {
                    ...editingPerson,
                    age: editingPerson.age?.toString(),
                    // Pass username field for display/edit
                    newUsername: editingPerson.username,
                  }
                : undefined
            }
            // Use current persons data excluding the one being edited as available parents/spouses
            availablePersons={personsData ? personsData.filter(p => p.id !== editingPerson?.id) : []}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowPersonForm(false)}
            isLoading={savePerson.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingPersonId} onOpenChange={() => setDeletingPersonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا الفرد نهائياً من شجرة العائلة. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePerson.isPending}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={deletePerson.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePerson.isPending ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
