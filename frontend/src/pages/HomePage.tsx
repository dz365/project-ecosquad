import { useAuth0 } from "@auth0/auth0-react";
import ExplorePage from "./ExplorePage";
import LandingPage from "./LandingPage";

const HomePage = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <ExplorePage /> : <LandingPage />;
};

export default HomePage;
