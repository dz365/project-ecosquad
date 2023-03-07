import { useAuth0 } from "@auth0/auth0-react";

const SignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  const onSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/updateprofile",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <button onClick={onSignUp} className="text-green-600">
      Sign Up
    </button>
  );
};

export default SignUpButton;
