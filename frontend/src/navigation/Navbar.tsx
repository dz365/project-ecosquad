import { useAuth0 } from "@auth0/auth0-react";
import SignInButton from "./SigninButton";
import SignOutButton from "./SignoutButton";
import SignUpButton from "./SignupButton";

const Navbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <>
          <SignUpButton />
          <SignInButton />
        </>
      )}
      {isAuthenticated && (
        <>
          <SignOutButton />
        </>
      )}
    </div>
  );
};

export default Navbar;
