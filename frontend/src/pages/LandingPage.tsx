import MapLibre from "../components/Maps/MapLibre";
import Navbar from "../navigation/Navbar";
import SignInButton from "../navigation/SigninButton";
import SignUpButton from "../navigation/SignupButton";
import PageLayout from "./PageLayout";

const LandingPage = () => {
  return (
    <PageLayout>
      <div className="absolute top-0 left-0 w-full h-screen">
        <div className="z-10 w-72 absolute top-48 left-4 sm:left-20 flex flex-col gap-4 bg-white p-4 rounded-xl">
          <h1 className="text-green-600 text-3xl">Ecosquad</h1>
          <p className="text-gray-500">
            A web app that gives everyone the chance to learn more about nature
            in their local community and develop a sense of curiosity as to
            what's out there.
          </p>
          <div className="flex gap-4">
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
        <MapLibre data={null} pointClickHandler={() => {}} />
      </div>
    </PageLayout>
  );
};

export default LandingPage;
