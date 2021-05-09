export const loadCommunityUsers = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();

    const userCol = `users@${communityID}`;
    const users = state.users[userCol];

    if (users !== undefined) {
      console.log("Already subscribed");
    } else {
      return firestore.collection(userCol).onSnapshot((snapshot) => {
        let dataRetrieved = [];
        snapshot.docs.map((doc) => {
          const data = { ...doc.data(), id: doc.id };
          return dataRetrieved.push(data);
        });
        dispatch({
          type: "LOAD_COMMUNITY_USERS",
          id: communityID,
          data: dataRetrieved,
        });
      });
    }
  };
};

export const loadUserDetails = ({ useruid }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();

    const loggedInUser = state.firebase.auth.uid;
    const userDetails = state.users[`userDetails@${useruid}`];

    // // Check if details of this user is loaded
    if (userDetails !== undefined) {
      console.log(`User ${useruid}'s data is already loaded`);
    } else {
      firestore
        .collection(`users`)
        .doc(useruid)
        .get()
        .then((doc) => {
          dispatch({
            type: "LOAD_USER_DETAILS",
            id: doc.id,
            data: doc.data(),
          });
        });
    }
  };
};
