import { format } from "date-fns";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AvatarComponent } from "../GeneralComponents";

function MessageTileComponent(props) {
  const [type, settype] = useState(props.type);
  const [message, setmessage] = useState(null);
  const [senderDisplayName, setSenderDisplayName] = useState(null);
  const [senderPhotoURL, setSenderPhotoURL] = useState("");
  const [unixtime, setunixtime] = useState(props.timestamp.seconds);
  const [date, setdate] = useState(format(unixtime * 1000, "PPPP"));

  const userDetailsDoc = `userDetails@${props.sender}`;

  useEffect(() => {
    settype(props.type);
    // setsender(props.sender === props.auth.uid ? "You" : props.sender);
    setSenderDisplayName(
      props.sender === props.auth.uid
        ? "You"
        : props.users[userDetailsDoc]?.displayName
    );
    setSenderPhotoURL(props.users[userDetailsDoc]?.photoURL);
  }, [props.sender, props.type, props.users, props.auth.uid, userDetailsDoc]);

  useEffect(() => {
    setunixtime(props.timestamp.seconds);
    switch (type) {
      case "notification":
        setmessage(`${senderDisplayName} ${props.message} ${date}`);
        break;
      case "message":
        setmessage(`${props.message}`);
        break;
      default:
        break;
    }
  }, [props, type, date, senderDisplayName]);

  useEffect(() => {
    if (unixtime) {
      switch (type) {
        case "notification":
          setdate(format(unixtime * 1000, "PPP"));
          break;
        case "message":
          setdate(format(unixtime * 1000, "p"));
          break;
        default:
          break;
      }
    }
  }, [unixtime, type]);

  switch (type) {
    case "notification":
      return (
        <div className="message__tile notification">
          <div className="message" id="message">
            <div id="content">{message}</div>
          </div>
        </div>
      );
    case "message":
      if (props.sender !== props.auth.uid)
        return (
          <div className="message__tile received">
            {!props.join && (
              <AvatarComponent size="small" src={senderPhotoURL} />
            )}
            <div className="message" id="message">
              {!props.join && <h1 id="sender">{senderDisplayName}</h1>}
              <div id="content">{message}</div>
              <p id="timestamp">{date}</p>
            </div>
          </div>
        );
      else {
        return (
          <div className="message__tile sent">
            <div className="message" id="message">
              {!props.join && <h1 id="sender">{senderDisplayName}</h1>}
              <div id="content">{message}</div>
              <p id="timestamp">{date}</p>
            </div>
          </div>
        );
      }
    case "media":
      return;
    default:
      return <></>;
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    users: state.users,
  };
};
export default connect(mapStateToProps, null)(MessageTileComponent);
