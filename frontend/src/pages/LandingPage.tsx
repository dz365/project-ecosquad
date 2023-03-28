import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../navigation/Navbar";
import SignInButton from "../navigation/SigninButton";
import SignUpButton from "../navigation/SignupButton";

const LandingPage = () => {
  const { error } = useAuth0();

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4">
        <Navbar />
      </div>
      <div className="bg-white flex justify-between p-4">
        <div></div>
        <div className="flex gap-4">
          <SignInButton />
          <SignUpButton />
        </div>
      </div>
      {error && (
        <div>
          <p>An unexpected error has occured</p>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
