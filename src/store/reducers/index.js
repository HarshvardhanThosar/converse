import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

import authReducer from "./auth.reducer";
import communityReducer from "./community.reducer";
import conversationReducer from "./conversation.reducer";
import communityDetailsReducer from "./communitydetails.reducer";
import usersReducer from "./users.reducers";

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  auth: authReducer,
  communities: communityReducer,
  communityDetails: communityDetailsReducer,
  conversations: conversationReducer,
  users: usersReducer,
});

export default rootReducer;
