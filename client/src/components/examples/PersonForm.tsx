import PersonForm from "../PersonForm";

const mockPersons = [
  { id: "1", firstName: "أحمد", lastName: "السالم" },
  { id: "2", firstName: "فاطمة", lastName: "العلي" },
  { id: "3", firstName: "محمد", lastName: "السالم" },
];

export default function PersonFormExample() {
  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center" dir="rtl">
      <PersonForm
        availablePersons={mockPersons}
        onSubmit={(data) => {
          console.log("Form data:", data);
          alert(`تم إضافة: ${data.firstName} ${data.lastName}`);
        }}
        onCancel={() => console.log("Form cancelled")}
        isLoading={false}
      />
    </div>
  );
}
