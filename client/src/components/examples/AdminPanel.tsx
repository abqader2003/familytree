import AdminPanel from "../AdminPanel";

const mockPersons = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "السالم",
    age: 85,
    residence: "الرياض",
    occupation: "متقاعد",
    role: "none" as const,
  },
  {
    id: "2",
    firstName: "محمد",
    lastName: "السالم",
    age: 55,
    residence: "جدة",
    occupation: "مهندس",
    role: "admin" as const,
  },
  {
    id: "3",
    firstName: "سارة",
    lastName: "الأحمد",
    age: 52,
    residence: "جدة",
    occupation: "معلمة",
    role: "user" as const,
  },
  {
    id: "4",
    firstName: "خالد",
    lastName: "السالم",
    age: 28,
    residence: "الرياض",
    occupation: "طبيب",
    role: "user" as const,
  },
];

export default function AdminPanelExample() {
  return (
    <div className="min-h-screen bg-background">
      <AdminPanel
        persons={mockPersons}
        onAddPerson={() => console.log("Add person")}
        onEditPerson={(person) => console.log("Edit person:", person)}
        onDeletePerson={(id) => console.log("Delete person:", id)}
        onExportData={() => console.log("Export data")}
        onImportData={() => console.log("Import data")}
        onChangePassword={(id) => console.log("Change password for:", id)}
      />
    </div>
  );
}
