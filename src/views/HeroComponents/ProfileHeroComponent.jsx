import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { loadCommunities } from "../../store/actions/community.action";
import { loadCommunityDetails } from "../../store/actions/communitydetails.action";
import { loadLaunchConversation } from "../../store/actions/conversation.action";
import { AvatarComponent } from "../GeneralComponents";
import { CommunityTileComponent } from "../TileComponents";

function ProfileHeroComponent(props) {
  const [communities, setCommunities] = useState(
    props.communities.userCommunities
  );
  // Getting current user details
  const { auth } = props;

  useEffect(() => {
    props.loadCommunities();
  }, [auth.uid]);

  useEffect(() => {
    communities.map((community) => {
      const details = props.communityDetails[`details@${community.id}`];
      const conversation = props.conversations[`conversations@${community.id}`];
      const users = props.users[`users@${community.id}`];
      /*
        // Load details and conversations from state
        // If already existing, do not fetch from firstore
        // If details or converstaion does not exist in the state, try fetching them from firestore
      */
      if (details === undefined) {
        props.loadCommunityDetails({ communityID: community.id });
      }
      if (users === undefined) {
        props.loadCommunityUsers({ communityID: community.id });
      }
      if (conversation === undefined) {
        props.loadLaunchConversation({ communityID: community.id });
      }
      return;
    });
  }, [communities]);

  useEffect(() => {
    console.log("Community Details Updated"); // Console when community details are updated
  }, [props.loadCommunityDetails]);

  useEffect(() => {
    setCommunities(props.communities.userCommunities); // Frequently get linked communities from state and update user interface
  });

  if (!auth.uid) {
    return <Redirect to="/login" />; // Redirect to login page is sessioned user is null
  } else {
    return (
      <section className="hero profile--section">
        <form className="form">
          <h1 className="title">Profile</h1>
          <div className="user--info">
            <AvatarComponent src={props.auth.photoURL} />
            <h1 className="link" id="name">
              {props.auth.displayName}
            </h1>
            <h1 className="meta" id="email">
              {props.auth.email}
            </h1>
          </div>
          <fieldset>
            <legend>
              <h1 className="meta">Communities ● {communities.length}</h1>
            </legend>
            <div className="community--container scrollable scroll-direction-y">
              {communities.map((element, index) => {
                return (
                  <CommunityTileComponent
                    key={element.id}
                    // index={index}
                    id={element.id}
                    communityid={element.id}
                  />
                );
              })}
            </div>
          </fieldset>
        </form>
      </section>
    );
  }
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
    loadCommunities: () => dispatch(loadCommunities()),
    loadCommunityDetails: (communityid) =>
      dispatch(loadCommunityDetails(communityid)),
    loadLaunchConversation: (data) => dispatch(loadLaunchConversation(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileHeroComponent);
