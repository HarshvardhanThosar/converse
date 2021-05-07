import { formatDistance } from "date-fns";
import { useEffect, useMemo, useReducer, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActive } from "../../store/actions/community.action";
import { loadLatestConversation } from "../../store/actions/conversation.action";
// Component Imports
import { AvatarComponent } from "../GeneralComponents";

const communityReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_LOCAL_COMMUNITY_DETAILS":
      return { ...state, details: action.payload };
    case "LOAD_LOCAL_COMMUNITY_USER_RELATION":
      return { ...state, userRelation: action.payload };
    case "LOAD_LOCAL_COMMUNITY_CONVERSATION":
      return { ...state, conversation: action.payload };
    case "LOAD_LOCAL_UPDATED_LAST_MESSAGE":
      return { ...state, updatedLastMessage: action.payload };
    case "LOAD_LOCAL_DOWNLOADED_LAST_MESSAGE":
      return { ...state, downloadedLastMessage: action.payload };
    case "LOAD_FINAL_LAST_MESSAGE":
      return { ...state, lastMessage: action.payload };
    default:
      return state;
  }
};

const initialSate = {
  // Details
  details: null,
  // User-Community Relation
  userRelation: null,
  // Conversation
  conversation: [],
  updatedLastMessage: null,
  downloadedLastMessage: null,
  // Last Message
  lastMessage: null,
};

function CommunityTileComponent(props) {
  const history = useHistory();
  // Using reducer to subscribe to a realtime update on redux data
  const [state, dispatch] = useReducer(communityReducer, initialSate);
  // Commuinty details
  const [communityID, setCommunityID] = useState(props.id);
  const [title, setTitle] = useState("");
  const [titleClassNames, setTitleClassNames] = useState(
    "overflow__ellipsis skeleton--loader"
  );
  // Previewed message details
  const [sender, setSender] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleClassNames, setSubtitleClassNames] = useState(
    "overflow__ellipsis skeleton--loader"
  );
  // Previewed message time details
  let currentDate = useMemo(() => new Date(), []);
  const [unixTime, setUnixTime] = useState(null);
  const [date, setDate] = useState(null);
  const [timeDistance, setTimeDistance] = useState(null);
  // Notifications
  const [notification, setNotification] = useState(null);
  // Setting up community id
  useEffect(() => {
    setCommunityID(props.id);
  }, [props.id]);
  // Subscribing to the local details of the particular community
  useEffect(() => {
    dispatch({
      type: "LOAD_LOCAL_COMMUNITY_DETAILS",
      payload: props.communityDetails[`details@${communityID}`],
    });
  }, [communityID, props.communityDetails]);
  useEffect(() => {
    setTitle(state.details?.title);
    setTitleClassNames("overflow__ellipsis");
  }, [state.details]);
  // Subscribing to the local conversations of the particular community
  useEffect(() => {
    dispatch({
      type: "LOAD_LOCAL_COMMUNITY_CONVERSATION",
      payload: props.conversations[`conversations@${communityID}`],
    });
  }, [communityID, props.conversations]);
  useEffect(() => {
    const length = state.conversation?.length;
    length &&
      dispatch({
        type: "LOAD_FINAL_LAST_MESSAGE",
        payload: state.conversation[length - 1],
      });
  }, [state.conversation]);
  useEffect(() => {
    const userDetailsDoc = `userDetails@${state.lastMessage?.sender}`;
    state.lastMessage?.sender &&
      setSender(
        state.lastMessage?.sender.toString() === props.auth.uid.toString()
          ? "You"
          : props.users[userDetailsDoc]?.displayName
      );
    setNotification(true);
  }, [state.lastMessage, props.users, props.auth.uid]);
  useEffect(() => {
    const communityUserCol = props.users[`users@${communityID}`];
    communityUserCol &&
      communityUserCol.forEach((user) => {
        if (user.id === props.auth.uid)
          dispatch({
            type: "LOAD_LOCAL_COMMUNITY_USER_RELATION",
            payload: user,
          });
        return;
      });
  }, [communityID, props.auth.uid, props.users]);
  useEffect(() => {
    if (state.details?.isDeactivated === true) {
      setSubtitle("Community is discontinued");
      setUnixTime(state.details?.deactivatedOn);
      if (state.details?.deactivatedOn) {
        let timedisatnce = formatDistance(
          state.details?.deactivatedOn.seconds * 1000,
          currentDate,
          { addSuffix: true }
        );
        setTimeDistance(`${timedisatnce}`);
      }
    } else {
      if (state.userRelation?.left === true) {
        setSubtitle("You left this community");
        setUnixTime(state.userRelation?.leftAt);
        if (state.userRelation?.leftAt) {
          let timedisatnce = formatDistance(
            state.userRelation?.leftAt.seconds * 1000,
            currentDate,
            { addSuffix: true }
          );
          setTimeDistance(`${timedisatnce}`);
        }
      } else if (state.userRelation?.removed === true) {
        setSubtitle("You were removed from this community");
        setUnixTime(state.userRelation?.removedAt);
        if (state.userRelation?.removedAt) {
          let timedisatnce = formatDistance(
            state.userRelation?.removedAt.seconds * 1000,
            currentDate,
            { addSuffix: true }
          );
          setTimeDistance(`${timedisatnce}`);
        }
      } else {
        switch (state.lastMessage?.type) {
          case "notification":
            setSubtitle(`${sender} ${state.lastMessage?.message} ${date}`);
            break;
          case "message":
            setSubtitle(`${sender}: ${state.lastMessage?.message}`);
            break;
          default:
            setSubtitle(`${sender}: ${state.lastMessage?.message}`);
            break;
        }
        setUnixTime(state.lastMessage?.timestamp);
        // Setting up last message's time distance
        if (state.lastMessage?.timestamp) {
          let timedisatnce = formatDistance(
            state.lastMessage?.timestamp.seconds * 1000,
            currentDate,
            { addSuffix: true }
          );
          setTimeDistance(`${timedisatnce}`);
        }
      }
    }
    setSubtitleClassNames("overflow__ellipsis");
  }, [state.details, state.userRelation, sender, state.lastMessage]);
  useEffect(() => {
    setDate(Date(unixTime * 1000));
  }, [unixTime]);

  const handleOnClick = () => {
    setNotification(false);
    history.push("/chat");
    props.setActive({ communityID: props.communityID });
  };

  return (
    <div className="chat__tile" onClick={handleOnClick}>
      <AvatarComponent src={state.details?.photoURL} />
      <div className="chat__tile__content">
        <h1 id="title" className={titleClassNames} title={title}>
          {title}
        </h1>
        <p id="subtitle" className={subtitleClassNames} title={subtitle}>
          {subtitle}
        </p>
      </div>
      <div className="chat__tile__notification">
        <h2 id="notification__count">
          {notification && <span className="notifier"></span>}
        </h2>
        <p id="notification__time">{timeDistance}</p>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    communities: state.communities,
    communityDetails: state.communityDetails,
    users: state.users,
    conversations: state.conversations,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setActive: (data) => dispatch(setActive(data)),
    loadLatestConversation: (data) => dispatch(loadLatestConversation(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityTileComponent);
