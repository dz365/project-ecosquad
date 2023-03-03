import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import SignInButton from "./SigninButton";
import SignOutButton from "./SignoutButton";
import SignUpButton from "./SignupButton";

const Navbar = () => {
  const [menuState, setMenuState] = useState("default");

  const { isAuthenticated } = useAuth0();

  return (
    <div>
      <button
        className="w-8 h-8 bg-no-repeat bg-center animate-rotate360"
        style={{ backgroundImage: "url('/icons/menu.svg')" }}
        onClick={() => setMenuState(menuState === "show" ? "hide" : "show")}
      ></button>
      <div
        className={`fixed top-0 -left-72 ${
          menuState === "show" && "animate-slidein"
        } ${menuState === "hide" && "animate-slideout"}
        } w-72 h-screen py-4 flex flex-col gap-4 bg-green-600 items-center text-green-50`}
      >
        <button
          className="w-8 h-8 bg-no-repeat bg-center animate-rotate360"
          style={{ backgroundImage: "url('/icons/menu.svg')" }}
          onClick={() => setMenuState(menuState === "show" ? "hide" : "show")}
        ></button>
        <div className="bg-gray-50 rounded-full p-3">
          <img src="/icons/logo.png" className="w-8" />
        </div>
        <NavLink to="/">Explore</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <p>Credits</p>
        <div>
          {!isAuthenticated && (
            <div className="flex gap-4">
              <SignInButton />
              <SignUpButton />
            </div>
          )}
          {isAuthenticated && (
            <>
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
