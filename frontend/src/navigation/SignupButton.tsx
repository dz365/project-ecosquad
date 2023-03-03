import { useAuth0 } from "@auth0/auth0-react";

const SignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  const onSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
        action: "signup",
      },
    });
  };

  return (
    <button onClick={onSignUp} className="text-green-50">
      Sign Up
    </button>
  );
};

export default SignUpButton;
