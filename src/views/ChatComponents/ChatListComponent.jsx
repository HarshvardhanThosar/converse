import { connect } from "react-redux";
import {
  CommunityTileComponent,
  ValidationTileComponent,
} from "../TileComponents";

const arrangeLatestFirst = (a, b) => {
  return a.lastUpdatedAt - b.lastUpdatedAt;
};

function ChatListComponent(props) {
  let communities = props.communities.userCommunities;
  let isLoaded = props.communities.userCommunitiesLoaded;

  return (
    <div className="chat--list scrollable scroll-direction-y">
      {isLoaded ? (
        communities.length > 0 ? (
          communities.map((element, index) => {
            return (
              <CommunityTileComponent
                key={element.id}
                // index={index}
                id={element.id}
                communityID={element.id}
              />
            );
          })
        ) : (
          <>
            <div className="cartoon--container">
              <img
                src="/assets/gfx/sad.webp"
                alt="Cartoon"
                className="cartoon"
              />
            </div>
            <ValidationTileComponent title="You have no communities linked to your profile." />
            <ValidationTileComponent
              type="instruction"
              title="Join or create communities and connect to other people with similar interests."
            />
            <ValidationTileComponent
              type="instruction"
              title="Use the explore page to find interesting communities."
            />
          </>
        )
      ) : (
        <section className="section loader__hero">
          <div className="loader"></div>
        </section>
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    communities: state.communities,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatListComponent);
