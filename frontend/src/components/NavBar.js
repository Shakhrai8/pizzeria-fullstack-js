import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Log In</Link>
      <Link to="/profile">Profile</Link>
      {/* Add other links as needed */}
    </nav>
  );
};

export default NavBar;
