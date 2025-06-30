import LoginForm from "@/components/features/authentication/LoginForm";
import React from "react";

const LoginPage = () => {
  return (
    // This div centers the login form on the page
    <div className="flex items-center justify-center py-12">
      <LoginForm />
    </div>
  );
};

export default LoginPage;