import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";

interface PageLayout {
  children: JSX.Element;
}

const PageLayout: React.FC<PageLayout> = ({ children }) => {
  const { user } = useAuth0();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [displayProfileCard, setDisplayProfileCard] = useState(false);
  const resizeListener = () => {
    setIsMobile(window.innerWidth < 640);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  return (
    <>
      <div
        className="z-10 w-full h-screen"
        onClick={() => setDisplayProfileCard(false)}
      >
        {children}
      </div>
      <button
        className={`z-20 fixed ${
          isMobile ? "bottom-2 left-4" : "top-2 right-4"
        } bg-white rounded-full cursor-pointer shadow`}
        onClick={() => setDisplayProfileCard(!displayProfileCard)}
      >
        <img
          src={`${process.env.REACT_APP_API_SERVER_URL}/users/${user!
            .sub!}/avatar`}
          alt="avatar"
          className="w-12 h-12 rounded-full border"
        />
      </button>

      {displayProfileCard && (
        <div
          className={`z-20 fixed ${
            isMobile ? "bottom-20 left-4" : "top-20 right-4"
          }`}
        >
          <ProfileCard />
        </div>
      )}
    </>
  );
};

export default PageLayout;
