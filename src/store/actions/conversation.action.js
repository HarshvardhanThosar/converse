const pageSize = 50;

export const loadLaunchConversation = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();

    const conversationCol = `conversations@${communityID}`;
    const conversations = state.conversations[conversationCol];

    if (conversations !== undefined) {
      console.log("Already subscribed");
    } else {
      // return firestore
      //   .collection(conversationCol)
      //   .orderBy("timestamp")
      //   .limit(pageSize)
      //   .get()
      //   .then((snapshot) => {
      //     let dataRetrieved = [];
      //     snapshot.docs.map((doc) => {
      //       const data = { ...doc.data(), id: doc.id };
      //       dataRetrieved.push(data);
      //     });
      //     dispatch({
      //       type: "LOAD_CONVERSATION",
      //       id: communityID,
      //       data: dataRetrieved,
      //     });
      //   });

      return firestore
        .collection(conversationCol)
        .orderBy("timestamp")
        .limit(pageSize)
        .onSnapshot((snapshot) => {
          let dataRetrieved = [];
          snapshot.docs.map((doc) => {
            const data = { ...doc.data(), id: doc.id };
            return dataRetrieved.push(data);
          });
          dispatch({
            type: "LOAD_CONVERSATION",
            id: communityID,
            data: dataRetrieved,
          });
        });
    }
  };
};

export const loadLatestConversation = ({ communityID }) => {
  console.log("Trying to load new messages");
  return (dispatch, getState, { getFirestore }) => {
    // const firestore = getFirestore();
    const state = getState();
    console.log(`Community ID: ${communityID}`);

    const conversationCol = `conversations@${communityID}`;

    const conversation = state.conversations[conversationCol];

    if (conversation) {
      const lastMessage = conversation[conversation.length - 1];

      console.log(lastMessage);
    }

    // console.log("Hey");
    // const firestore = getFirestore();
    // const state = getState();
    // const detailsCol = `details@${communityid}`;
    // const details = state.communityDetails[detailsCol];
    // console.log(`Latest message: ${details.lastMessage}`);
    // const conversationCol = `conversations@${communityid}`;
    // const conversation = state.conversations[conversationCol];
    // let dataRetrieved = conversation;
    // console.log(`Downloaded last message: ${messageid}`);
    // if (details.lastMessage != messageid) {
    //   return firestore
    //     .collection(conversationCol)
    //     .orderBy("timestamp")
    //     .startAfter(messageid)
    //     .limit(pageSize)
    //     .get()
    //     .then((snapshot) => {
    //       snapshot.docs.map((doc) => {
    //         const data = { ...doc.data(), id: doc.id };
    //         dataRetrieved.push(data);
    //       });
    //       dispatch({
    //         type: "LOAD_LATEST_CONVERSATION",
    //         id: communityid,
    //         data: dataRetrieved,
    //       });
    //     });
    // }
  };
};

// export const loadPreviousConversation = ({ communityid, messageid }) => {
//   return (dispatch, getState, { getFirestore }) => {
//     const firestore = getFirestore();
//     const state = getState();

//     const conversationCol = `conversations@${communityid}`;
//     const conversations = state.conversations[conversationCol];

//     while (conversations.lastMessage !== messageid) {
//       return firestore
//         .collection(conversationCol)
//         .orderBy("timestamp")
//         .endBefore(messageid)
//         .limit(pageSize)
//         .get()
//         .then((snapshot) => {
//           let dataRetrieved = [];
//           snapshot.docs.map((doc) => {
//             const data = { ...doc.data(), id: doc.id };
//             return dataRetrieved.push(data);
//           });
//           dispatch({
//             type: "LOAD_PREVIOUS_CONVERSATION",
//             id: communityid,
//             data: dataRetrieved,
//           });
//         });
//     }
//   };
// };

export const sendMessage = ({ communityID, message, media }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();

    const auth = state.firebase.auth;

    let type = "message";

    if (media) type = "media";

    if (message || media) {
      const conversationCol = `conversations@${communityID}`;
      const communityDocRef = firestore
        .collection("communities")
        .doc(communityID);
      return firestore
        .collection(conversationCol)
        .add({
          sender: auth.uid,
          message,
          type,
          timestamp: new Date(),
        })
        .then((docRef) => {
          communityDocRef.set(
            {
              lastMessage: docRef.id,
              lastUpdatedAt: new Date(),
            },
            { merge: true }
          );
        });
    }
  };
};
