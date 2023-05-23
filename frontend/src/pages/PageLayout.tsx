import Navbar from "../navigation/Navbar";
import ProfilePopup from "../components/ProfilePopup";

interface PageLayout {
  showNavbar?: boolean;
  showAvatar?: boolean;
  children: JSX.Element;
}

const PageLayout: React.FC<PageLayout> = ({
  showNavbar = true,
  showAvatar = true,
  children,
}) => {
  return (
    <>
      <div className="z-10 w-full h-screen">
        {showNavbar && (
          <div className="fixed top-4 left-4 z-50">
            <Navbar />
          </div>
        )}
        {children}
      </div>
      {showAvatar && <ProfilePopup />}
    </>
  );
};

export default PageLayout;
