import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { joinCommunity } from "../../store/actions/community.action";

function JoinCommunityHeroComponent(props) {
  const history = useHistory();
  let { communityID } = useParams();
  const [communityShareCode, setCommunityShareCode] = useState("");
  useEffect(() => {
    setCommunityShareCode(communityID);
  }, [communityID]);
  const handleChange = (event) => {
    setCommunityShareCode(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const { communityid } = event.target.elements;
    props
      .joinCommunity({ communityID: communityid.value })
      .then(history.push("/"));
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
      </form>
    </section>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    joinCommunity: (data) => dispatch(joinCommunity(data)),
  };
};
export default connect(null, mapDispatchToProps)(JoinCommunityHeroComponent);
