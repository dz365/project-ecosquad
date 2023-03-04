import { useAuth0 } from "@auth0/auth0-react";

const SignInButton = () => {
  const { loginWithRedirect } = useAuth0();

  const onSignIn = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
    <button
      onClick={onSignIn}
      className="py-1 px-2 rounded-lg bg-green-600 text-green-50"
    >
      Sign In
    </button>
  );
};

export default SignInButton;
