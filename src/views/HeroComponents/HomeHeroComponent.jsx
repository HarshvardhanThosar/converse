import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
// Action Creator Imports
import { loadCommunities } from "../../store/actions/community.action";
import { loadCommunityDetails } from "../../store/actions/communitydetails.action";
import { loadLaunchConversation } from "../../store/actions/conversation.action";
// Component Imports
import { ChatNavListComponent } from "../ChatComponents";
import {
  ChatContainerHeroComponent,
  CreateCommunityHeroComponent,
  EditCommunityHeroComponent,
  JoinCommunityHeroComponent,
} from "../SubHeroComponents.jsx";
// Styling Import
import "../../assets/css/chatherosection.css";
import { loadCommunityUsers } from "../../store/actions/users.action";
import { ErrorHeroComponent, ExploreComponent } from ".";

function HomeHeroComponent(props) {
  // Getting current user details
  const [communities, setCommunities] = useState([]);

  // Load communities as per the logged in user
  useEffect(() => {
    props.loadCommunities();
  }, [props.auth.uid]);

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
      return true;
    });
  }, [communities]);

  useEffect(() => {
    console.log("Community Details Updated"); // Console when community details are updated
  }, [props.loadCommunityDetails]);

  useEffect(() => {
    setCommunities(props.communities.userCommunities); // Frequently get linked communities from state and update user interface
  });

  if (!props.auth.uid) {
    return <Redirect to="/login" />; // Redirect to login page is sessioned user is null
  } else {
    return (
      <section className="hero chat--section" id="chat--section">
        <ChatNavListComponent />
        <Switch>
          <Route exact path="/" component={ExploreComponent} />
          {/* <Route exact path="/" /> */}
          <Route exact path="/chat" component={ChatContainerHeroComponent} />
          <Route path="/explore" component={ExploreComponent} />
          <Route
            exact
            path="/explore/:filter/:refid/:title"
            component={ExploreComponent}
          />
          <Route
            exact
            path="/createCommunity"
            component={CreateCommunityHeroComponent}
          />
          <Route
            exact
            path="/editCommunity"
            component={EditCommunityHeroComponent}
          />
          <Route
            exact
            path="/joinCommunity"
            component={JoinCommunityHeroComponent}
          />
          <Route
            exact
            path="/joinCommunity/:communityID"
            component={JoinCommunityHeroComponent}
          />
          <Route component={ErrorHeroComponent} />
        </Switch>
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
export default connect(mapStateToProps, mapDispatchToProps)(HomeHeroComponent);
