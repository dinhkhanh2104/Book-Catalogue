import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <nav className="flex gap-x-2 w-full h-20 justify-center items-center">
      {isAuthenticated ? (
        <div className="flex gap-5 items-center text-lg mr-5">
          <p>
            Welcome{" "}
            {currentUser.displayName
              ? currentUser.displayName
              : currentUser.email}
            , you are now signed in !!!
          </p>
          <button
            onClick={handleSignOut}
            className="text-lg text-blue-600 hover:opacity-70"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-8 mr-5">
          <p className="font-semibold text-xl">Book Catalogue</p>
          <div className="flex gap-5 justify-center text-lg text-blue-600 ">
            <NavLink
              className="text-lg text-blue-600 hover: opacity-70"
              to={"/signin"}
            >
              Sign In
            </NavLink>
            <NavLink
              className="text-lg text-blue-600 hover: opacity-70"
              to={"/signup"}
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
      <div className="flex gap-5">
        <button className="text-lg text-blue-600">
          <NavLink
            exact
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 underline"
                : "text-blue-600 hover:opacity-70"
            }
            to="/"
          >
            Home
          </NavLink>
        </button>
        <button className="text-lg text-blue-600">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 underline"
                : "text-blue-600 hover:opacity-70"
            }
            to="/user"
          >
            User
          </NavLink>
        </button>
      </div>
    </nav>
  );
};

export default Header;
