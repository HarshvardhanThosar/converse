// import firebase, { auth, setupUserInFirestore } from "../../firebase";
import { connect } from "react-redux";
// Action Creators Imports
import { signInWithGoogle } from "../../store/actions/auth.actions";

function SignInButtonComponent(props) {
  const signInUserWithGoogle = (event) => {
    event.preventDefault();
    // const authProvider = new firebase.auth.GoogleAuthProvider();
    // auth.signInWithPopup(authProvider).then((result) => {
    //   props.authHandler(result);
    //   setupUserInFirestore(result);
    // });
    props.signInWithGoogle();
  };
  return (
    <button className="button cta" id="login" onClick={signInUserWithGoogle}>
      Sign In With Google
    </button>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    signInWithGoogle: (credentials) => dispatch(signInWithGoogle(credentials)),
  };
};
export default connect(null, mapDispatchToProps)(SignInButtonComponent);
