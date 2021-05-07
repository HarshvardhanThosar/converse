const initState = {
  active: null,
  userCommunities: [],
  userCommunitiesLoaded: false,
};
const communityReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_COMMUNITY_SUCCESS": // Successful login, user extra details were verified from user profiles //
      // console.log("Loaded your linked communities");
      return {
        ...state,
        userCommunities: action.localUserCommunities,
        userCommunitiesLoaded: true,
      };
    case "LOAD_COMMUNITY_ERROR": // Unsuccessful login, user did not provide valid details //
      console.error(action.error.message);
      return state;
    case "SET_ACTIVE": // Setting up active tab
      return {
        ...state,
        active: action.communityID,
      };
    default:
      // Default case //
      return state;
  }
};
export default communityReducer;
