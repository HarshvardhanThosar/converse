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
  const [userRelation, setUserRelation] = useState(null);

  const communityUserCol = props.users[`users@${communityID}`];
  useEffect(() => {
    communityUserCol &&
      communityUserCol.forEach((user) => {
        user.id === props.auth.uid && setUserRelation(user);
      });
  }, [communityUserCol]);

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
        <CommunityInfoTileComponent
          {...communityDetails}
          userRelation={userRelation}
        />
        {!userRelation?.removed && !userRelation?.left && (
          <fieldset>
            <legend>
              <h1 className="meta">Users</h1>
            </legend>
            <div className="user--container scrollable scroll-direction-y">
              {communityUsers?.map((user) => {
                if (!user?.removed && !user?.left) {
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
                }
                return;
              })}
            </div>
          </fieldset>
        )}

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
    users: state.users,
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
