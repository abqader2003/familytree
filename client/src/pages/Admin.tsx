import { useState } from "react";
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

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  residence?: string;
  occupation?: string;
  role?: "admin" | "user" | "none";
}

const mockPersons: Person[] = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "السالم",
    age: 85,
    residence: "الرياض",
    role: "none",
  },
  {
    id: "2",
    firstName: "محمد",
    lastName: "السالم",
    age: 55,
    residence: "جدة",
    occupation: "مهندس معماري",
    role: "admin",
  },
  {
    id: "3",
    firstName: "سارة",
    lastName: "الأحمد",
    age: 52,
    residence: "جدة",
    occupation: "معلمة",
    role: "user",
  },
];

export default function Admin() {
  const [persons, setPersons] = useState<Person[]>(mockPersons);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);

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
      console.log("Delete person:", deletingPersonId);
      setPersons(persons.filter((p) => p.id !== deletingPersonId));
      setDeletingPersonId(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setShowPersonForm(false);
    setEditingPerson(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header
        isLoggedIn={true}
        isAdmin={true}
        username="محمد السالم"
        onLogoutClick={() => console.log("Logout")}
        onSettingsClick={() => console.log("Settings")}
      />

      <AdminPanel
        persons={persons}
        onAddPerson={handleAddPerson}
        onEditPerson={handleEditPerson}
        onDeletePerson={handleDeletePerson}
        onExportData={() => console.log("Export data")}
        onImportData={() => console.log("Import data")}
        onChangePassword={(id) => console.log("Change password:", id)}
      />

      <Dialog open={showPersonForm} onOpenChange={setShowPersonForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <PersonForm
            initialData={
              editingPerson
                ? {
                    ...editingPerson,
                    age: editingPerson.age?.toString(),
                  }
                : undefined
            }
            availablePersons={persons}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowPersonForm(false)}
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
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
