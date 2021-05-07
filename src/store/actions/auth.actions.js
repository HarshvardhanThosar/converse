export const signInWithGoogle = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const authProvider = new firebase.auth.GoogleAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(authProvider)
      .then((response) => {
        const user = response.user;
        firestore.collection("users").doc(user.uid).set(
          {
            isOnline: true,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
          { merge: true }
        );
        dispatch({ type: "LOGIN_SUCCESS" });
      })
      .catch((error) => dispatch({ type: "LOGIN_ERROR", error }));
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const state = getState();
    const user = state.firebase.auth;
    return firestore
      .collection("users")
      .doc(user.uid)
      .set(
        {
          isOnline: false,
        },
        { merge: true }
      )
      .then(() => {
        return firebase
          .auth()
          .signOut()
          .then(dispatch({ type: "LOGOUT_SUCCESS" }))
          .catch((error) => {
            dispatch({ type: "LOGOUT_ERROR", error });
          });
      });
  };
};

export const resetState = () => {
  return (dispatch, getState) => {
    dispatch({
      type: "RESET_AUTH_STATE",
    });
  };
};
