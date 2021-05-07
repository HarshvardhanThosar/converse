const initState = {
  isLoaded: false,
};
const conversationReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOAD_CONVERSATION": // Successful login, user extra details were verified from user profiles //
      const consolemessage = `Loaded conversation at ${action.id}`;
      console.log(consolemessage);
      return {
        ...state,
        isLoaded: true,
        [`conversations@${action.id}`]: action.data,
      };
    case "LOAD_LATEST_CONVERSATION": // Successful login, user extra details were verified from user profiles //
      // consolemessage = `Loaded latest conversation at ${action.id}`;
      console.log(consolemessage);
      return {
        ...state,
        isLoaded: true,
        [`conversations@${action.id}`]: action.data,
      };
    default:
      return state;
  }
};
export default conversationReducer;
