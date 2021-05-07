import React from "react";
import { Link } from "react-router-dom";

export default function LogoComponent() {
  return (
    <Link to="/">
      <h1 className="logo" id="logo">
        converse
      </h1>
    </Link>
  );
}
