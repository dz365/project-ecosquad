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

  return <button onClick={onSignIn}>Sign In</button>;
};

export default SignInButton;
