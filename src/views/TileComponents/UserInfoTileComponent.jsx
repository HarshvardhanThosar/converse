import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { connect } from "react-redux";
import { removeUser } from "../../store/actions/community.action";
import { AvatarComponent } from "../GeneralComponents";

function UserInfoTileComponent(props) {
  const deleteUser = (event) => {
    props.removeUser({ userUID: props.id, communityID: props.communityid });
  };
  return (
    <div className="user__info__tile">
      <AvatarComponent src={props.photoURL} />
      <div className="user__info">
        <h1 id="title" className="overflow__ellipsis" title={props.displayName}>
          {props.displayName}
        </h1>
        <p id="subtitle" className="overflow__ellipsis" title={props.email}>
          {props.email}
        </p>
      </div>
      <div className="action--bar">
        {props.viewerType === "admin" && props.auth.uid !== props.id && (
          <button
            className="danger icon--only"
            id={props.id}
            title="Delete user"
            onClick={deleteUser}
          >
            <DeleteOutlineOutlinedIcon className="icon light" id={props.id} />
          </button>
        )}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communityDetails: state.communityDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    removeUser: (data) => dispatch(removeUser(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfoTileComponent);
