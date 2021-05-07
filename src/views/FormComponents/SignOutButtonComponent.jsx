import React from "react";
import { connect } from "react-redux";
// Action Creators Imports
import { signOut } from "../../store/actions/auth.actions";

function SignOutButtonComponent(props) {
  const signOut = () => {
    props.setDropDown(!props.dropDown);
    props.signOut();
  };
  return (
    <button className="cta" onClick={signOut}>
      Sign Out
    </button>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    signOut: (credentials) => dispatch(signOut(credentials)),
  };
};
export default connect(null, mapDispatchToProps)(SignOutButtonComponent);
