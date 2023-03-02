import { useAuth0 } from "@auth0/auth0-react";

const SignOutButton = () => {
  const { logout } = useAuth0();

  const onSignOut = () => logout();

  return <button onClick={onSignOut}>Log Out</button>;
};

export default SignOutButton;
