import Navbar from "../navigation/Navbar";
import SignInButton from "../navigation/SigninButton";
import SignUpButton from "../navigation/SignupButton";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-white flex justify-between p-4">
        <div></div>
        <div className="flex gap-4">
          <SignInButton />
          <SignUpButton />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
