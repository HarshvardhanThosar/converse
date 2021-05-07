import { memo } from "react";
import { Link } from "react-router-dom";
// Component Imports
import { AppBarComponent } from "../GeneralComponents";
import { ChatListComponent } from "./";

function ChatNavListComponent(props) {
  return (
    <div className="chat--nav--list">
      <AppBarComponent title="Communities" />
      <ChatListComponent />
      <div className="action--bar">
        <Link to="/joinCommunity">
          <button>Join Community</button>
        </Link>
        <Link to="/createCommunity">
          <button className="cta">Create Community</button>
        </Link>
      </div>
    </div>
  );
}
export default memo(ChatNavListComponent);
