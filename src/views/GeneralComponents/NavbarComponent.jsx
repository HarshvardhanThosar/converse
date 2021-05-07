import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// Material UI Imports
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// Component Imports
import { SignOutButtonComponent } from "../FormComponents";
import { LogoComponent } from ".";

function NavbarComponent(props) {
  const [dropDown, setDropDown] = useState(false);
  let dropDownClassNames = "dropdown";
  const openDropDownMenu = () => {
    setDropDown(!dropDown);
  };

  if (dropDown) {
    dropDownClassNames = "dropdown active";
  } else {
    dropDownClassNames = "dropdown";
  }
  return (
    <div className="navbar">
      <LogoComponent />
      {props.auth.uid && (
        <div id="accountTrigger">
          <AccountCircleIcon
            className="icon light"
            onClick={openDropDownMenu}
          />
          <ul className={dropDownClassNames} id="dropdown">
            <Link to="/profile">
              <li className="listitem">Profile</li>
            </Link>
            <Link to="/settings">
              <li className="listitem">Settings</li>
            </Link>
            <SignOutButtonComponent
              dropDown={dropDown}
              setDropDown={setDropDown}
            />
          </ul>
        </div>
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};
export default connect(mapStateToProps, null)(memo(NavbarComponent));
