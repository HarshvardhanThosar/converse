const initState = {
  isLoaded: false,
};
const communityDetailsReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_COMMUNITY_DETAILS": // Successful login, user extra details were verified from user profiles //
      const consolemessage = `Loaded details of ${action.id}`;
      console.log(consolemessage);
      return {
        ...state,
        isLoaded: true,
        [`details@${action.id}`]: { ...action.data },
      };
    default:
      return state;
  }
};
export default communityDetailsReducer;
