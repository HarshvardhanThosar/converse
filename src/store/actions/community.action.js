export const loadCommunities = () => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const auth = state.firebase.auth;

    // Getting all user's linked communities
    let localUserCommunities = [];
    return firestore
      .collection("users")
      .doc(auth.uid)
      .collection("communities")
      .onSnapshot((snapshot) => {
        const userCommunitiesArray = [];
        snapshot.forEach((doc) => {
          userCommunitiesArray.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        localUserCommunities = userCommunitiesArray;
        dispatch({
          type: "LOAD_COMMUNITY_SUCCESS",
          localUserCommunities,
        });
      });
  };
};

export const createCommunity = ({ title, description, tagList, imageFile }) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const firebase = getFirebase();
    const storage = firebase.storage();
    // Set allowed file types

    let percentage = 0;
    // Get data from state
    const userUID = state.firebase.auth.uid;
    // Get data from component that called the function

    // Steps of executions
    /* 
      // 1. 
      // Create a document for the community in "communities" collection with provided "title", "description, "image file"
      // & store the document ID using ref of the newly created record in variable for future use.
    */
    return firestore
      .collection("communities")
      .add({
        createdBy: userUID,
        description,
        title,
        // Add more details as per your need
      })
      .then(
        /*
          // 2.
          // Create collections for the community as "conversations@communityid" and "users@communityid" for conversation and users of the community respectively
        */
        // Get document ref to get the ID of the document created
        (docRef) => {
          console.log("Community created");
          const communityID = docRef.id;

          const customConversationsCollection = `conversations@${communityID}`;
          const customUsersCollection = `users@${communityID}`;
          const communityDocRef = firestore
            .collection("communities")
            .doc(communityID);
          const tagsColRef = firestore.collection("tags");

          // Creating a collection for users with a document for creator user as "admin"
          firestore
            .collection(customUsersCollection)
            .doc(userUID)
            .set(
              {
                joinedAt: new Date(),
                userType: "admin",
                // Add more details as per your need
              },
              { merge: true }
            )
            .then(console.log("User added to community"))
            .catch((error) => {
              console.error(
                `Error occured while adding user to community: ${error}`
              );
            });

          // Creating a collection for conversation with a document for in-chat notification
          firestore
            .collection(customConversationsCollection)
            .add({
              type: "notification",
              message: "created this community on",
              timestamp: new Date(),
              sender: userUID,
              // This adds an initial document to create a collection, use 'type' attribute and alter the user interface for in-chat notifcations, messages, removed user notification. added user notification
            })
            .then((docRef) => {
              const lastMessageID = docRef.id;
              // Update the latest message and last updated for the commnity
              communityDocRef
                .set(
                  {
                    lastMessage: lastMessageID,
                    lastUpdatedAt: new Date(),
                  },
                  { merge: true }
                )
                .then(() => {
                  console.log(`Created the conversation notifaction`);
                  firestore
                    .collection("users")
                    .doc(userUID)
                    .collection("communities")
                    .doc(communityID)
                    .set(
                      {
                        // id: classroomdocref,
                        closedAt: null,
                        joinedAt: new Date(),
                        openedAt: new Date(),
                        lastViewedMessage: lastMessageID,
                      },
                      { merge: true }
                    )
                    .then(
                      console.log(`Commnity created and added to your profile`)
                    )
                    .catch((error) => {
                      console.error(
                        `Error occured while adding community details to your profile: ${error}`
                      );
                    });
                })
                .catch((error) => {
                  console.error(
                    `Error occured while adding in-chat notification to conversation: ${error}`
                  );
                });
            })
            .catch((error) => {
              console.error(
                `Error occured while creating conversation: ${error}`
              );
            });

          // Add photoURL
          if (imageFile) {
            const storageRef = storage.ref(`profile-image/${communityID}`);
            storageRef.put(imageFile).on(
              "state_changed",
              (snapshot) => {
                percentage =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(percentage);
              },
              (error) => {
                console.log(
                  `Error occured while uploading photoURL for community: ${error}`
                );
              },
              async () => {
                const photoURL = await storageRef.getDownloadURL();
                console.log(photoURL);
                communityDocRef.set(
                  {
                    photoURL,
                  },
                  { merge: true }
                );
              }
            );
          }

          // Add tags
          let verifiedTagList = [];
          let tagIDList = [];
          tagList &&
            tagList.map((tag, index) => {
              tagsColRef
                .where("tagName", "==", tag.tagName)
                .get()
                .then((snapshot) => {
                  // If snapshot has data
                  snapshot.forEach((doc) => {
                    console.log(
                      `${tag} was found and community added to tag's list`
                    );
                    verifiedTagList.push({
                      docID: doc.id,
                      tagName: tag.tagName,
                    });
                    tagIDList.push(doc.id);
                    // communityDocRef.collection(`tags`).doc(doc.id).set(
                    //   {
                    //     tagID: doc.id,
                    //     tagName: tag.tagName,
                    //   },
                    //   { merge: true }
                    // );

                    communityDocRef
                      .update({
                        tags: firebase.firestore.FieldValue.arrayUnion({
                          id: doc.id,
                          tagName: tag.tagName,
                        }),
                      })
                      .then(
                        console.log(
                          `${communityID} community got updated with latest tags`
                        )
                      )
                      .catch((error) => console.error(error));

                    tagsColRef
                      .doc(doc.id)
                      .collection("communities")
                      .doc(communityID)
                      .set({ communityID }, { merge: true })
                      .then(
                        console.log(
                          `${communityID} community got associated with tag ${tag.tagName}`
                        )
                      )
                      .catch((error) => console.error(error));
                  });

                  // If no documents were retrieved with such tagname, create a new tag
                  if (snapshot.docs.length === 0 && tag.docID === null) {
                    console.log(`${tag.tagName} was not found`);
                    tagsColRef
                      .add({
                        tagName: tag.tagName,
                      })
                      .then((docRef) => {
                        console.log(`${tag.tagName} was created`);
                        verifiedTagList.push({
                          docID: docRef.id,
                          tagName: tag.tagName,
                        });
                        tagIDList.push(docRef.id);
                        // communityDocRef.collection(`tags`).doc(tag.docID).set(
                        //   {
                        //     tagID: tag.docID,
                        //     tagName: tag.tagName,
                        //   },
                        //   { merge: true }
                        // );

                        communityDocRef
                          .update({
                            tags: firebase.firestore.FieldValue.arrayUnion({
                              id: docRef.id,
                              tagName: tag.tagName,
                            }),
                          })
                          .then(
                            console.log(
                              `${communityID} community got updated with latest tags`
                            )
                          )
                          .catch((error) => console.error(error));

                        tagsColRef
                          .doc(docRef.id)
                          .collection("communities")
                          .doc(communityID)
                          .set({ communityID }, { merge: true })
                          .then(
                            console.log(
                              `${communityID} community got associated with new tag ${tag.tagName}`
                            )
                          )
                          .catch((error) => console.error(error));
                      })
                      .catch((error) => {
                        console.error(`Error while creating tag: ${error}`);
                      });

                    // communityDocRef
                    //   .update({
                    //     tags: firebase.firestore.FieldValue.arrayUnion(
                    //       ...tagIDList
                    //     ),
                    //   })
                    //   .then(
                    //     console.log(
                    //       `${communityID} community got updated with latest tags`
                    //     )
                    //   )
                    //   .catch((error) => console.error(error));

                    // console.log(verifiedTagList);
                  }
                })
                .catch((error) => {
                  console.error(
                    `Error while linking community with tags: ${error}`
                  );
                });

              // If tag not found
              return console.log(`No such tag was found`);
            });
        }
      )
      .catch((error) => {
        console.error(`Error occured while creating community: ${error}`);
      });

    // 2. Check if "taglist" exists, if not skip to step 5 else if taglist has value continue to step 3.
    // 3. For all element in the "taglist", if "id" exists then goto to the document with the same "id" ( inside "tags" collection ) and add the "document id" of community created is step 1.
    // 4. For all elements in the "taglist", if "id" does not exist then create a document of the tag in "tags" collection with "title" as "title" of the tag element and an array of "commuities" containing above created community's "id" as an array item.
    // 5.
  };
};

export const editCommunity = ({
  communityID,
  title,
  description,
  tagList,
  removedTagList,
  imageFile,
}) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const firebase = getFirebase();
    const storage = firebase.storage();
    // Set allowed file types

    let percentage = 0;
    // Get data from state
    const userUID = state.firebase.auth.uid;
    // Get data from component that called the function

    const communityDocRef = firestore
      .collection("communities")
      .doc(communityID);
    const tagsColRef = firestore.collection("tags");

    // Steps of executions
    /* 
      // 1. 
      // Create a document for the community in "communities" collection with provided "title", "description, "image file"
      // & store the document ID using ref of the newly created record in variable for future use.
    */
    return firestore
      .collection("communities")
      .doc(communityID)
      .set(
        {
          createdBy: userUID,
          description,
          title,
          // Add more details as per your need
        },
        { merge: true }
      )
      .then(
        /*
          // 2.
          // Create collections for the community as "conversations@communityid" and "users@communityid" for conversation and users of the community respectively
        */
        // Get document ref to get the ID of the document created
        (docRef) => {
          // Add photoURL
          if (imageFile) {
            const storageRef = storage.ref(`profile-image/${communityID}`);
            storageRef.put(imageFile).on(
              "state_changed",
              (snapshot) => {
                percentage =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(percentage);
              },
              (error) => {
                console.log(
                  `Error occured while uploading photoURL for community: ${error}`
                );
              },
              async () => {
                const photoURL = await storageRef.getDownloadURL();
                console.log(photoURL);
                communityDocRef.set(
                  {
                    photoURL,
                  },
                  { merge: true }
                );
              }
            );
          }

          removedTagList && removedTagList.map((tag, index) => {});

          // Add tags
          let verifiedTagList = [];
          let tagIDList = [];
          tagList &&
            tagList.map((tag, index) => {
              tagsColRef
                .where("tagName", "==", tag.tagName)
                .get()
                .then((snapshot) => {
                  // If snapshot has data
                  snapshot.forEach((doc) => {
                    console.log(
                      `${tag} was found and community added to tag's list`
                    );
                    verifiedTagList.push({
                      docID: doc.id,
                      tagName: tag.tagName,
                    });
                    tagIDList.push(doc.id);

                    // communityDocRef
                    //   .update({
                    //     tags: firebase.firestore.FieldValue.arrayUnion({
                    //       id: doc.id,
                    //       tagName: tag.tagName,
                    //     }),
                    //   })
                    //   .then(
                    //     console.log(
                    //       `${communityID} community got updated with latest tags`
                    //     )
                    //   )
                    //   .catch((error) => console.error(error));

                    // tagsColRef
                    //   .doc(doc.id)
                    //   .collection("communities")
                    //   .doc(communityID)
                    //   .set({ communityID }, { merge: true })
                    //   .then(
                    //     console.log(
                    //       `${communityID} community got associated with tag ${tag.tagName}`
                    //     )
                    //   )
                    //   .catch((error) => console.error(error));
                  });

                  // If no documents were retrieved with such tagname, create a new tag
                  if (snapshot.docs.length === 0 && tag.docID === null) {
                    console.log(`${tag.tagName} was not found`);
                    tagsColRef
                      .add({
                        tagName: tag.tagName,
                      })
                      .then((docRef) => {
                        console.log(`${tag.tagName} was created`);
                        verifiedTagList.push({
                          docID: docRef.id,
                          tagName: tag.tagName,
                        });
                        tagIDList.push(docRef.id);

                        communityDocRef
                          .update({
                            tags: firebase.firestore.FieldValue.arrayUnion({
                              id: docRef.id,
                              tagName: tag.tagName,
                            }),
                          })
                          .then(
                            console.log(
                              `${communityID} community got updated with latest tags`
                            )
                          )
                          .catch((error) => console.error(error));

                        tagsColRef
                          .doc(docRef.id)
                          .collection("communities")
                          .doc(communityID)
                          .set({ communityID }, { merge: true })
                          .then(
                            console.log(
                              `${communityID} community got associated with new tag ${tag.tagName}`
                            )
                          )
                          .catch((error) => console.error(error));
                      })
                      .catch((error) => {
                        console.error(`Error while creating tag: ${error}`);
                      });
                  }
                })
                .catch((error) => {
                  console.error(
                    `Error while linking community with tags: ${error}`
                  );
                });

              // If tag not found
              return console.log(`No such tag was found`);
            });
        }
      )
      .catch((error) => {
        console.error(`Error occured while creating community: ${error}`);
      });

    // 2. Check if "taglist" exists, if not skip to step 5 else if taglist has value continue to step 3.
    // 3. For all element in the "taglist", if "id" exists then goto to the document with the same "id" ( inside "tags" collection ) and add the "document id" of community created is step 1.
    // 4. For all elements in the "taglist", if "id" does not exist then create a document of the tag in "tags" collection with "title" as "title" of the tag element and an array of "commuities" containing above created community's "id" as an array item.
    // 5.
  };
};

export const deactivateCommunity = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const userUID = state.firebase.auth.uid;

    const communityDocRef = firestore
      .collection("communities")
      .doc(communityID);

    return communityDocRef.set(
      {
        isDeactivated: true,
        deactivatedOn: new Date(),
      },
      { merge: true }
    );
  };
};

export const reactivateCommunity = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const userUID = state.firebase.auth.uid;

    const communityDocRef = firestore
      .collection("communities")
      .doc(communityID);

    return communityDocRef.set(
      {
        isDeactivated: false,
        deactivatedOn: null,
      },
      { merge: true }
    );
  };
};

export const joinCommunity = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const userUID = state.firebase.auth.uid;

    const customConversationsCollection = `conversations@${communityID}`;
    const customUsersCollection = `users@${communityID}`;
    const communityDocRef = firestore
      .collection("communities")
      .doc(communityID);

    return firestore
      .collection(customUsersCollection)
      .doc(userUID)
      .set(
        {
          joinedAt: new Date(),
          userType: "user",
          removed: false,
          left: false,
          // Add more details as per your need
        },
        { merge: true }
      )
      .then(() => {
        console.log("User added to community");
        firestore
          .collection(customConversationsCollection)
          .add({
            type: "notification",
            message: "joined this community on",
            timestamp: new Date(),
            sender: userUID,
            // This adds an initial document to create a collection, use 'type' attribute and alter the user interface for in-chat notifcations, messages, removed user notification. added user notification
          })
          .then((docRef) => {
            const lastMessageID = docRef.id;
            // Update the latest message and last updated for the commnity
            communityDocRef
              .set(
                {
                  lastMessage: lastMessageID,
                  lastUpdatedAt: new Date(),
                },
                { merge: true }
              )
              .then(() => {
                console.log(`Created the conversation notifaction`);
                firestore
                  .collection("users")
                  .doc(userUID)
                  .collection("communities")
                  .doc(communityID)
                  .set(
                    {
                      // id: classroomdocref,
                      closedAt: null,
                      joinedAt: new Date(),
                      openedAt: new Date(),
                      lastViewedMessage: lastMessageID,
                    },
                    { merge: true }
                  )
                  .then(console.log(`Commnity added to your profile`))
                  .catch((error) => {
                    console.error(
                      `Error occured while adding community details to your profile: ${error}`
                    );
                  });
              })
              .catch((error) => {
                console.error(
                  `Error occured while adding in-chat notification to conversation: ${error}`
                );
              });
          })
          .catch((error) => {
            console.error(`Error occured while sending notification: ${error}`);
          });
      })
      .catch((error) => {
        console.error(`Error occured while adding user to community: ${error}`);
      });
  };
};

export const leaveCommunity = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();
    const userUID = state.firebase.auth.uid;

    const customConversationsCollection = `conversations@${communityID}`;
    const customUsersCollection = `users@${communityID}`;
    const communityDocRef = firestore
      .collection("communities")
      .doc(communityID);

    return firestore
      .collection(customUsersCollection)
      .doc(userUID)
      .set(
        {
          removed: false,
          left: true,
          leftAt: new Date(),
        },
        { merge: true }
      )
      .then(() => {
        console.log("User left from community");
        firestore
          .collection(customConversationsCollection)
          .add({
            type: "notification",
            message: "left this community on",
            timestamp: new Date(),
            sender: userUID,
            // This adds an initial document to create a collection, use 'type' attribute and alter the user interface for in-chat notifcations, messages, removed user notification. added user notification
          })
          .then((docRef) => {
            const lastMessageID = docRef.id;
            // Update the latest message and last updated for the commnity
            communityDocRef
              .set(
                {
                  lastMessage: lastMessageID,
                  lastUpdatedAt: new Date(),
                },
                { merge: true }
              )
              .then(() => {
                console.log(`Created the conversation notifaction`);
                firestore
                  .collection("users")
                  .doc(userUID)
                  .collection("communities")
                  .doc(communityID)
                  .set(
                    {
                      removed: false,
                      left: true,
                      leftAt: new Date(),
                    },
                    { merge: true }
                  )
                  .then(console.log(`Commnity removed from your profile`))
                  .catch((error) => {
                    console.error(
                      `Error occured while removing community details from your profile: ${error}`
                    );
                  });
              })
              .catch((error) => {
                console.error(
                  `Error occured while adding in-chat notification to conversation: ${error}`
                );
              });
          })
          .catch((error) => {
            console.error(`Error occured while sending notification: ${error}`);
          });
      })
      .catch((error) => {
        console.error(
          `Error occured while removing user from community: ${error}`
        );
      });
  };
};

export const removeUser = ({ userUID, communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const state = getState();

    const customConversationsCollection = `conversations@${communityID}`;
    const customUsersCollection = `users@${communityID}`;
    const communityDocRef = firestore
      .collection("communities")
      .doc(communityID);

    const sender = state.firebase.auth.uid;

    return firestore
      .collection(customUsersCollection)
      .doc(userUID)
      .set(
        {
          left: false,
          removed: true,
          removedAt: new Date(),
        },
        { merge: true }
      )
      .then(() => {
        console.log("User removed from community");
        firestore
          .collection(customConversationsCollection)
          .add({
            type: "notification",
            message: "was removed from this community on",
            timestamp: new Date(),
            sender: userUID,
            // This adds an initial document to create a collection, use 'type' attribute and alter the user interface for in-chat notifcations, messages, removed user notification. added user notification
          })
          .then((docRef) => {
            const lastMessageID = docRef.id;
            // Update the latest message and last updated for the commnity
            communityDocRef
              .set(
                {
                  lastMessage: lastMessageID,
                  lastUpdatedAt: new Date(),
                },
                { merge: true }
              )
              .then(() => {
                console.log(`Created the conversation notifaction`);
                firestore
                  .collection("users")
                  .doc(userUID)
                  .collection("communities")
                  .doc(communityID)
                  .set(
                    {
                      left: false,
                      removed: true,
                      removedAt: new Date(),
                    },
                    { merge: true }
                  )
                  .then(console.log(`Commnity removed from user's profile`))
                  .catch((error) => {
                    console.error(
                      `Error occured while removing community details to your profile: ${error}`
                    );
                  });
              })
              .catch((error) => {
                console.error(
                  `Error occured while adding in-chat notification to conversation: ${error}`
                );
              });
          })
          .catch((error) => {
            console.error(`Error occured while sending notification: ${error}`);
          });
      })
      .catch((error) => {
        console.error(
          `Error occured while removing user from community: ${error}`
        );
      });
  };
};

export const setActive = ({ communityID }) => {
  return (dispatch, getState, { getFirestore }) => {
    return dispatch({
      type: "SET_ACTIVE",
      communityID,
    });
  };
};
