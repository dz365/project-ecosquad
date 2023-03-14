import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import SignOutButton from "./SignoutButton";

const Navbar = () => {
  const [menuState, setMenuState] = useState<"" | "show" | "hide">("");

  const { isAuthenticated } = useAuth0();

  return (
    <>
      <button
        className="fixed top-4 left-4 z-20 w-8 h-8 bg-menu bg-no-repeat bg-center"
        onClick={() => setMenuState("show")}
      ></button>
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
              className="w-8 h-8 bg-xmark bg-no-repeat bg-center"
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