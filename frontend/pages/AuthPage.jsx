import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {showLogin ? (
        <Login onSwitchToSignup={() => setShowLogin(false)} />
      ) : (
        <SignUp onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </>
  );
}

export default AuthPage;
