import React from "react";
// Material UI Imports
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

export default function SearchBarComponent(props) {
  const closeSearchBar = () => {
    props.setSearchBarOpen(false);
  };

  return (
    <form className="search--bar">
      <input
        type="text"
        name="search"
        id="search--input"
        className="search--input"
        placeholder="Search here..."
        autoComplete="off"
      />
      {/* <button type="submit" className="disabled">
        <SearchIcon className="icon light" />
      </button> */}
      <button type="reset" onClick={closeSearchBar}>
        <ClearIcon className="icon light" />
      </button>
    </form>
  );
}
