import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import {
  searchCommunity,
  resetSearchedCommunity,
  joinCommunity,
  leaveCommunity,
  editCommunity,
} from "../../store/actions/community.action";
import { AdvanceSearchBarComponent } from "../FormComponents";
import {
  CommunityInfoTileComponent,
  ValidationTileComponent,
} from "../TileComponents";

function ExploreComponent(props) {
  let { filter } = useParams();
  let { refid } = useParams();
  let { title } = useParams();
  const [searchFilter, setSearchFilter] = useState(null);
  const [searchedFilter, setSearchedFilter] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [searchedKey, setSearchedKey] = useState("");
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    props.resetSearchedCommunity();
  }, []);

  useEffect(() => {
    setSearchFilter(filter);
  }, [filter]);

  useEffect(() => {
    setSearchKey(title);
  }, [title]);

  const selectComponentOptions = [
    { id: "title", title: "Title" },
    { id: "tag", title: "Tag" },
  ];

  const searchFunction = (event) => {
    if (searchFilter) {
      if (searchKey !== "") {
        props.searchCommunity({ searchKey, searchFilter });
        setSearchedKey(searchKey);
        setSearchedFilter(searchFilter);
      } else {
        setSearchKey("");
        setSearchedKey("");
        setWarning("You did not type anything in the search field.");
      }
    } else {
      setSearchFilter(null);
      setSearchedFilter(null);
      setWarning("You did not choose appropiate filter in the search field.");
    }
  };

  return (
    <section className="explore--section">
      <div>
        <h1 className="title">
          explore/
          <span className="meta">
            {" "}
            &nbsp;new communities with tags or title
          </span>
        </h1>
      </div>
      <div className="horizontal--separator"></div>
      <AdvanceSearchBarComponent
        options={selectComponentOptions}
        setSearchFilter={setSearchFilter}
        setSearchKey={setSearchKey}
        searchFunction={searchFunction}
        setWarning={setWarning}
        setError={setError}
      />
      <div className="horizontal--separator"></div>
      {searchedKey && (
        <p className="meta">
          Search results for '<b>{searchedKey}</b>' as{" "}
          <i>
            <b>{searchedFilter}</b>
          </i>
        </p>
      )}
      {warning && <ValidationTileComponent type="warning" title={warning} />}
      {error && <ValidationTileComponent type="error" title={error} />}
      {props.communities.searchResults?.length && (
        <div className="community--container">
          {props.communities.searchResults.map((resultCommunity) => {
            let communityID = resultCommunity.id;
            let communityUsersCol = props.users[`users@${communityID}`];
            let userRelation = {};
            communityUsersCol &&
              communityUsersCol.map((user) => {
                if (user.id === props.auth.uid) {
                  userRelation = user;
                }
              });
            return (
              <CommunityInfoTileComponent
                {...resultCommunity}
                key={resultCommunity.id}
                userRelation={userRelation}
              />
            );
          })}
        </div>
      )}

      {props.communities.searchResults?.length === 0 && searchedKey && (
        <p className="meta">No results found</p>
      )}
    </section>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communities: state.communities,
    users: state.users,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    searchCommunity: (data) => dispatch(searchCommunity(data)),
    resetSearchedCommunity: (data) => dispatch(resetSearchedCommunity()),
    joinCommunity: (data) => dispatch(joinCommunity(data)),
    editCommunity: (data) => dispatch(editCommunity(data)),
    leaveCommunity: (data) => dispatch(leaveCommunity(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ExploreComponent);
