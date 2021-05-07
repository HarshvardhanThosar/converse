import { Redirect } from "react-router-dom";
// Component Imports
import { SignInButtonComponent } from "../FormComponents";
import { connect } from "react-redux";
// Styling Imports
import "../../assets/css/herocomponents.css";
import "../../assets/css/formcomponents.css";

function SignInHeroComponent(props) {
  // Getting current user details
  const { auth } = props;
  if (auth.uid) {
    return <Redirect to="/" />; // Redirect to login page is sessioned user is null
  } else {
    return (
      <section className="hero signin--section">
        <form className="form">
          <h1 className="title">Connect With Your Interests.</h1>
          <h2 className="meta">
            Create or join communities that you find interesting.
          </h2>
          <SignInButtonComponent />
        </form>
      </section>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};
export default connect(mapStateToProps, null)(SignInHeroComponent);
