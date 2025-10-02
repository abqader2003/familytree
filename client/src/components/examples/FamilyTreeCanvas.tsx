import FamilyTreeCanvas from "../FamilyTreeCanvas";

const mockPersons = [
  {
    id: "1",
    firstName: "أحمد",
    lastName: "السالم",
    age: 85,
    residence: "الرياض",
    occupation: "متقاعد",
    bio: "جد العائلة",
  },
  {
    id: "2",
    firstName: "فاطمة",
    lastName: "العلي",
    age: 80,
    residence: "الرياض",
    occupation: "ربة منزل",
    bio: "جدة العائلة",
    spouseId: "1",
  },
  {
    id: "3",
    firstName: "محمد",
    lastName: "السالم",
    age: 55,
    residence: "جدة",
    occupation: "مهندس",
    fatherId: "1",
  },
  {
    id: "4",
    firstName: "سارة",
    lastName: "الأحمد",
    age: 52,
    residence: "جدة",
    occupation: "معلمة",
    spouseId: "3",
  },
  {
    id: "5",
    firstName: "خالد",
    lastName: "السالم",
    age: 28,
    residence: "الرياض",
    occupation: "طبيب",
    fatherId: "3",
  },
];

export default function FamilyTreeCanvasExample() {
  return (
    <div className="w-full h-screen">
      <FamilyTreeCanvas
        persons={mockPersons}
        onPersonClick={(person) => console.log("Person clicked:", person)}
        isLoggedIn={false}
      />
    </div>
  );
}
