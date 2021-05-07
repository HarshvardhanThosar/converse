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
          const userDetails = state.users[`userDetails@${doc.id}`];

          // Check if details of this user is loaded
          if (userDetails !== undefined) {
            console.log(`User ${doc.id}'s data is already loaded`);
          } else {
            firestore
              .collection(`users`)
              .doc(doc.id)
              .get()
              .then((doc) => {
                dispatch({
                  type: "LOAD_USER_DETAILS",
                  id: doc.id,
                  data: doc.data(),
                });
              });
          }

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
