import React, { useState } from "react";
// Material UI Imports
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SearchIcon from "@material-ui/icons/Search";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { AvatarComponent } from "../GeneralComponents";
import { SearchBarComponent } from "../FormComponents";

export default function AppBarComponent(props) {
  const title = props.title;
  const photoURL = props.photoURL;
  // const appBarType = props.appBarType;
  const collapsible = props.collapsible;
  const searchable = props.searchable;

  const [searchBarOpen, setSearchBarOpen] = useState(false);
  let appBarClassNames = "app--bar";
  const openSearchBar = () => {
    setSearchBarOpen(true);
  };
  if (searchBarOpen) {
    appBarClassNames = "app--bar active";
  }

  return (
    <div className={appBarClassNames}>
      <div className="title--bar">
        {collapsible && (
          <button className="icon--only" onClick={props.closeCurrentTabHandler}>
            <ArrowBackIcon className="icon light" />
          </button>
        )}
        {photoURL && <AvatarComponent src={photoURL} />}
        <h1 className="title">{title}</h1>
        <div className="action--bar">
          {searchable && (
            <button className="icon--only" onClick={openSearchBar}>
              <SearchIcon className="icon light" />
            </button>
          )}
          {props.chatBar && (
            <button
              className="icon--only"
              onClick={props.openSuccessorTabHandler}
            >
              <InfoOutlinedIcon className="icon light" />
            </button>
          )}
        </div>
      </div>
      {searchable && <SearchBarComponent setSearchBarOpen={setSearchBarOpen} />}
    </div>
  );
}
