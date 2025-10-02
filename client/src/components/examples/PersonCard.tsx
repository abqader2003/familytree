import PersonCard from "../PersonCard";

export default function PersonCardExample() {
  return (
    <div className="p-8 flex flex-col gap-6 bg-background">
      <PersonCard
        firstName="محمد"
        lastName="السالم"
        age={55}
        residence="جدة، المملكة العربية السعودية"
        occupation="مهندس برمجيات"
        bio="مهندس برمجيات متخصص في تطوير التطبيقات الحديثة، له خبرة 20 عاماً في المجال"
        role="admin"
        onClick={() => console.log("Card clicked")}
        isLoggedIn={false}
      />
      
      <PersonCard
        firstName="سارة"
        lastName="الأحمد"
        age={28}
        residence="الرياض"
        occupation="طبيبة"
        role="user"
        onClick={() => console.log("Card clicked")}
        isLoggedIn={true}
      />
    </div>
  );
}
