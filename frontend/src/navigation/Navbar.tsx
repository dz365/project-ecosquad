import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import SignOutButton from "./SignoutButton";

interface Navbar {
  iconSize?: "sm" | "md" | "lg";
}
const Navbar: React.FC<Navbar> = ({ iconSize = "md" }) => {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const [menuState, setMenuState] = useState<"" | "show" | "hide">("");

  const { isAuthenticated } = useAuth0();

  return (
    <>
      <button onClick={() => setMenuState("show")}>
        <div
          className={`${sizes[iconSize]} bg-menu bg-contain bg-center bg-no-repeat`}
        ></div>
      </button>
      <div
        className={`fixed top-0 -left-72 w-72 z-30 h-screen bg-white ${
          menuState === "show" && "animate-slidein"
        } ${menuState === "hide" && "animate-slideout"}`}
      >
        <div className="h-screen py-4 px-8 flex flex-col items-center gap-8 bg-green-600  text-green-50">
          <div className="self-stretch flex justify-between items-center">
            <div className="bg-gray-50 rounded-full p-3">
              <img src="/logo.png" className="w-8" />
            </div>
            <button
              className="w-8 h-8 bg-xmark-light bg-no-repeat bg-center"
              onClick={() => setMenuState("hide")}
            ></button>
          </div>

          <NavLink to="/">Explore</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <p>Credits</p>

          {isAuthenticated && (
            <>
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
