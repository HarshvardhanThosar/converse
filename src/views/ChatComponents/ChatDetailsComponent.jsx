import { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
// Component Imports
import { AppBarComponent } from "../GeneralComponents";

import { connect } from "react-redux";
import {
  CommunityInfoTileComponent,
  UserInfoTileComponent,
} from "../TileComponents";
import { deleteCommunity } from "../../store/actions/community.action";

function ChatDetailsComponent(props) {
  const [communityDetails, setCommunityDetails] = useState({});
  const [communityUsers, setCommunityUsers] = useState([]);
  const communityID = props.communities.active;
  const [viewerType, setViewerType] = useState("user");

  useEffect(() => {
    setCommunityDetails(props.communityDetails[`details@${communityID}`]);
  }, [communityID, props.communityDetails]);

  useEffect(() => {
    setCommunityUsers(props.users[`users@${communityID}`]);
  }, [communityID, props.users]);

  useEffect(() => {
    props.auth.uid === communityDetails?.createdBy && setViewerType("admin");
  }, [props.auth.uid, communityDetails]);

  const onDelete = (event) => {
    props
      .deleteCommunity({ communityID })
      .then(console.log(`${communityID} deactivated`));
  };

  return (
    <div className="chat--details">
      <AppBarComponent
        title="Details"
        collapsible
        closeCurrentTabHandler={props.closeCurrentTabHandler}
      />
      <div className="details--container">
        <CommunityInfoTileComponent {...communityDetails} />
        <fieldset>
          <legend>
            <h1 className="meta">Users ● {communityUsers.length}</h1>
          </legend>
          <div className="user--container scrollable scroll-direction-y">
            {communityUsers?.map((user) => {
              const userDetails = props.users[`userDetails@${user.id}`];
              return (
                <UserInfoTileComponent
                  key={user.id}
                  {...user}
                  {...userDetails}
                  viewerType={viewerType}
                  communityid={communityID}
                />
              );
            })}
          </div>
        </fieldset>
        {viewerType === "admin" && (
          <button
            type="button"
            className="cta--danger icon--button"
            onClick={onDelete}
          >
            <DeleteIcon className="icon light" />
            Deactivate Community
          </button>
        )}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communities: state.communities,
    communityDetails: state.communityDetails,
    users: state.users,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteCommunity: (data) => dispatch(deleteCommunity(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatDetailsComponent);
