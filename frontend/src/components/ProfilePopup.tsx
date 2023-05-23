import { useEffect, useRef, useState } from "react";
import ProfileCard from "./ProfileCard";
import { useAuth0 } from "@auth0/auth0-react";

const ProfilePopup = () => {
  const { user } = useAuth0();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [showDisplay, setShowDisplay] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const toggleDisplay = () => setShowDisplay(!showDisplay);

  useEffect(() => {
    const resizeListener = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        divRef.current &&
        toggleRef.current &&
        !divRef.current.contains(event.target) &&
        !toggleRef.current.contains(event.target)
      ) {
        setShowDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user?.sub) return <></>
  return (
    <>
      <button
        ref={toggleRef}
        className={`z-20 fixed ${
          isMobile ? "bottom-2 left-4" : "top-2 right-4"
        } bg-white rounded-full cursor-pointer shadow`}
        onClick={toggleDisplay}
      >
        <img
          src={`${process.env.REACT_APP_API_SERVER_URL}/users/${user!
            .sub!}/avatar`}
          alt="avatar"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/default_avatar.png";
          }}
          className="w-12 h-12 rounded-full border"
        />
      </button>
      {showDisplay && (
        <div
          ref={divRef}
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

export default ProfilePopup;
