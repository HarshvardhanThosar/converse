import { useEffect, useRef, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
// Component Imports
import { AppBarComponent } from "../GeneralComponents";
import {
  MessageTileComponent,
  ValidationTileCommponent,
} from "../TileComponents";
import { connect } from "react-redux";
import { sendMessage } from "../../store/actions/conversation.action";
import { ChatDetailsComponent } from "../ChatComponents";
import { setActive } from "../../store/actions/community.action";

function ChatContainerHeroComponent(props) {
  const history = useHistory();
  const [conversation, setconversation] = useState([]);
  const [details, setdetails] = useState({});
  const [userRelation, setUserRelation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [sendButtonClassNames, setSendButtonClassNames] = useState(
    "cta icon--button disabled"
  );
  const communityID = props.communities.active;
  const latest = useRef();

  const [detailsTabOpen, setDetailsTabOpen] = useState(false);
  const [chatContainerClassNames, setChatContainerClassNames] =
    useState("chat--container");
  const openDetailsTab = () => {
    console.log(`Details tab opened.`);
    setDetailsTabOpen(true);
  };
  const closeDetailsTab = () => {
    console.log(`Details tab closed.`);
    setDetailsTabOpen(false);
  };

  useEffect(() => {
    if (detailsTabOpen) {
      setChatContainerClassNames("chat--container active");
    } else if (!detailsTabOpen) {
      setChatContainerClassNames("chat--container");
    }
  }, [detailsTabOpen]);

  useEffect(() => {
    const communityUserCol = props.users[`users@${communityID}`];
    communityUserCol &&
      communityUserCol.forEach((user) => {
        if (user.id === props.auth.uid) setUserRelation(user);
        return;
      });
  }, [communityID, props.auth.uid, props.users]);

  useEffect(() => {
    setDetailsTabOpen(false);
    setChatContainerClassNames("chat--container");
  }, [communityID]);

  useEffect(() => {
    setdetails(props.communityDetails[`details@${communityID}`]);
  }, [communityID, props.communityDetails[`details@${communityID}`]]);

  useEffect(() => {
    setconversation(props.conversations[`conversations@${communityID}`]);
  }, [communityID, props.conversations[`conversations@${communityID}`]]);

  const closeChatSection = () => {
    console.log(`Chat section closed.`);
    history.push("/");
    props.setActive({ communityID: null });
  };

  const handleChange = (event) => {
    setMessageInput(event.target.value);
  };

  useEffect(() => {
    messageInput
      ? setSendButtonClassNames("cta icon--button")
      : setSendButtonClassNames("cta icon--button disabled");
  }, [messageInput]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (messageInput.trim())
      props.sendMessage({ communityID, message: messageInput });
    setMessageInput("");
    setTimeout(() => {
      latest.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 50);
  };

  if (!communityID) return <Redirect to="/" />;
  else
    return (
      <div className={chatContainerClassNames}>
        <div className="content">
          <AppBarComponent
            openSuccessorTabHandler={openDetailsTab}
            title={details.title}
            collapsible
            photoURL={details.photoURL}
            chatBar
            closeCurrentTabHandler={closeChatSection}
          />
          {userRelation?.left || userRelation?.removed ? (
            userRelation?.left ? (
              <div className="cartoon--container">
                <img
                  src="/assets/gfx/sad.webp"
                  alt="Cartoon"
                  className="cartoon"
                />
                <ValidationTileCommponent
                  type="warning"
                  title="You can not view this section because you left this community."
                />
              </div>
            ) : (
              userRelation?.removed && (
                <div className="cartoon--container">
                  <img
                    src="/assets/gfx/sad.webp"
                    alt="Cartoon"
                    className="cartoon"
                  />
                  <ValidationTileCommponent
                    type="error"
                    title="You can not view this section because you were removed from the community"
                  />
                </div>
              )
            )
          ) : (
            <>
              <div className="chat scrollable scroll-direction-y">
                {conversation.map((message, index) => {
                  return (
                    <MessageTileComponent
                      {...message}
                      index={index}
                      key={message.id}
                    />
                  );
                })}
                <div ref={latest}></div>
              </div>
              <form id="typing--area" onSubmit={sendMessage} autoComplete="off">
                {/* <AttachFileIcon className="icon light" /> */}
                <input
                  type="text"
                  name=""
                  id="messageinput"
                  placeholder="Type here"
                  value={messageInput}
                  onChange={handleChange}
                />
                <button
                  id="send"
                  type="submit"
                  className={sendButtonClassNames}
                >
                  <SendIcon className="icon light" />
                  Send
                </button>
              </form>
            </>
          )}
        </div>
        {detailsTabOpen && (
          <ChatDetailsComponent closeCurrentTabHandler={closeDetailsTab} />
        )}
      </div>
    );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communities: state.communities,
    communityDetails: state.communityDetails,
    conversations: state.conversations,
    users: state.users,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (data) => dispatch(sendMessage(data)),
    setActive: (data) => dispatch(setActive(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainerHeroComponent);
