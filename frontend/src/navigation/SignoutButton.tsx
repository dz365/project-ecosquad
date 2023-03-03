import { useAuth0 } from "@auth0/auth0-react";

const SignOutButton = () => {
  const { logout } = useAuth0();

  const onSignOut = () => logout();

  return (
    <button
      onClick={onSignOut}
      className="py-1 px-2 rounded-lg bg-gray-50 text-green-700 text-sm"
    >
      Log Out
    </button>
  );
};

export default SignOutButton;
