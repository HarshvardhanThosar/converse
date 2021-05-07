export const loadCommunityDetails = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();

    const communityDetails = state.communityDetails;

    if (communityDetails[`details@${communityID}`] !== undefined) {
      console.log("Already subscribed");
    } else {
      const communityDocRef = firestore
        .collection("communities")
        .doc(communityID);
      return communityDocRef.onSnapshot((doc) => {
        const data = { ...doc.data(), id: doc.id };
        console.table(data);
        dispatch({
          type: "LOAD_COMMUNITY_DETAILS",
          id: communityID,
          data,
        });
      });
    }
  };
};
