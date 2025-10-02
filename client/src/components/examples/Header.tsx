import { useState } from "react";
import Header from "../Header";

export default function HeaderExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isLoggedIn}
        username="محمد السالم"
        onLoginClick={() => {
          console.log("Login clicked");
          setIsLoggedIn(true);
        }}
        onLogoutClick={() => {
          console.log("Logout clicked");
          setIsLoggedIn(false);
        }}
        onAdminClick={() => console.log("Admin clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
      />
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">
          {isLoggedIn ? "مسجل دخول" : "غير مسجل دخول"}
        </p>
      </div>
    </div>
  );
}
