import { connect } from "react-redux";
import { CommunityTileComponent } from "../TileComponents";

function ChatListComponent(props) {
  let communities = props.communities.userCommunities;
  let isLoaded = props.communities.userCommunitiesLoaded;

  return (
    <div className="chat--list scrollable scroll-direction-y">
      {isLoaded ? (
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
