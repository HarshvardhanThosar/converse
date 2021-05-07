import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
// Material UI Components
import ShareIcon from "@material-ui/icons/Share";
import FileCopyIcon from "@material-ui/icons/FileCopy";
// Component Imports
import { AvatarComponent, TagBubbleComponent } from "../GeneralComponents";
import { connect } from "react-redux";
import { leaveCommunity } from "../../store/actions/community.action";

function CommunityInfoTileComponent(props) {
  const history = useHistory();
  const [communityID, setCommunityID] = useState(props.id);
  useEffect(() => {
    setCommunityID(props.id);
  }, [props.id]);

  const copyLink = () => {
    const sharableLink = `http://localhost:3000/joinCommunity/${props.id}`;
    navigator.clipboard.writeText(`${sharableLink}`);
  };

  const copyCode = (event) => {
    navigator.clipboard.writeText(`${props.id}`);
  };

  const handleLeave = () => {
    props.leaveCommunity({ communityID }).then(history.push("/"));
  };

  return (
    <div className="community__info__tile" key={communityID}>
      <div className="row">
        <AvatarComponent src={props.photoURL} />
        <h2 className="link">{props.title}</h2>
      </div>
      <h2 className="meta">{props.description}</h2>
      {props.tags && (
        <fieldset>
          <legend>
            <h1 className="meta">Tags ● {props.tags.length}</h1>
          </legend>
          <div className="tag--container scrollable scroll-direction-y">
            {props.tags?.map((tag) => {
              // return <Link key={tag.id}>{tag.tagName}</Link>;
              return (
                <TagBubbleComponent
                  title={tag.tagName}
                  id={tag.id}
                  key={tag.id}
                />
              );
            })}
          </div>
          <div className="horizontal--separator"></div>
        </fieldset>
      )}
      <div className="action--bar">
        {props.communities.userCommunities.some(
          (community) => community.id === props.id
        ) ? (
          props.auth.uid === props.createdBy ? (
            <Link to="/editCommunity">
              <button>Edit Community</button>
            </Link>
          ) : (
            <button className="cta--danger" onClick={handleLeave}>
              Leave Community
            </button>
          )
        ) : (
          <button className="cta">Join Community</button>
        )}
        <button
          className="icon--only"
          title="Share this community to others"
          onClick={copyLink}
        >
          <ShareIcon className="icon light" id={props.index} />
        </button>
        <button
          className="icon--only"
          title="Copy share id of this community"
          onClick={copyCode}
        >
          <FileCopyIcon className="icon light" id={props.index} />
        </button>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communities: state.communities,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    leaveCommunity: (data) => dispatch(leaveCommunity(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityInfoTileComponent);
