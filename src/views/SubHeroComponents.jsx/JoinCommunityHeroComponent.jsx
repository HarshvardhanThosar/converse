import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getFirestore } from "redux-firestore";
import { joinCommunity } from "../../store/actions/community.action";
import { ValidationTileCommponent } from "../TileComponents";

function JoinCommunityHeroComponent(props) {
  const history = useHistory();
  let { communityID } = useParams();
  const [communityShareCode, setCommunityShareCode] = useState("");
  const [warning, setWarning] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setCommunityShareCode(communityID);
  }, [communityID]);

  const handleChange = (event) => {
    setWarning(null);
    setError(null);
    setSuccess(null);
    setCommunityShareCode(event.target.value.trim());
  };

  const handleSubmit = (event) => {
    const firestore = getFirestore();
    event.preventDefault();
    firestore
      .collection("communities")
      .doc(communityShareCode)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          // Check if the user is already a participant of the community
          props.communities &&
          props.communities.some(
            (community) =>
              community.id.toString() === communityShareCode.toString()
          )
            ? setWarning("You are already a participant of this community")
            : // If not only then join the community
              props
                .joinCommunity({ communityID: communityShareCode })
                .then(() => {
                  setSuccess("You have successfully joined a new community");
                  history.push("/");
                });
        } else {
          setError("No community with such share code was found.");
        }
      });
  };
  return (
    <section className="inner--hero sub--hero">
      <form
        onSubmit={handleSubmit}
        className="form"
        id="join--community"
        autoComplete="off"
      >
        <h1 className="title">Join a Community</h1>
        <input
          required
          type="text"
          id="communityid"
          placeholder="Share Code"
          value={communityID}
          onChange={handleChange}
        />
        <button type="submit" className="cta">
          Join Community
        </button>
        {warning && <ValidationTileCommponent type="warning" title={warning} />}
        {error && <ValidationTileCommponent type="error" title={error} />}
        {success && <ValidationTileCommponent type="error" title={success} />}
      </form>
    </section>
  );
}
const mapStateToProps = (state) => {
  return {
    communities: state.communities.userCommunities,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    joinCommunity: (data) => dispatch(joinCommunity(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinCommunityHeroComponent);
