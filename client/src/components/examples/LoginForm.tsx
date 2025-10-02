import LoginForm from "../LoginForm";

export default function LoginFormExample() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background" dir="rtl">
      <LoginForm
        onLogin={(username, password) => {
          console.log("Login:", username, password);
          alert(`تسجيل الدخول باسم: ${username}`);
        }}
        isLoading={false}
      />
    </div>
  );
}
