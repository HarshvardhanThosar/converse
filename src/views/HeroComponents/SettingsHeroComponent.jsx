import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { loadCommunities } from "../../store/actions/community.action";
import { loadCommunityDetails } from "../../store/actions/communitydetails.action";
import { loadLaunchConversation } from "../../store/actions/conversation.action";
import { loadCommunityUsers } from "../../store/actions/users.action";

function SettingsHeroComponent(props) {
  // Getting current user details
  const { auth } = props;
  const [communities, setCommunities] = useState([]);

  // Load communities as per the logged in user
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
      <section className="hero settings--section">
        <form className="form">
          <h1 className="title">Settings</h1>
          <div>
            <h1 className="meta">Dark mode</h1>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </form>
      </section>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communities: state.communities,
    communityDetails: state.communityDetails,
    users: state.users,
    conversations: state.conversations,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loadCommunities: () => dispatch(loadCommunities()),
    loadCommunityDetails: (data) => dispatch(loadCommunityDetails(data)),
    loadCommunityUsers: (data) => dispatch(loadCommunityUsers(data)),
    loadLaunchConversation: (data) => dispatch(loadLaunchConversation(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsHeroComponent);
