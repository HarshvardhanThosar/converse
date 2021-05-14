import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

export default function TagBubbleComponent(props) {
  const link = `/explore/tag/${props.id}/${props.title}`;
  return props.editable ? (
    <div className="tag--bubble">
      <h2>{props.title}</h2>
      {props.removable && (
        <button
          type="button"
          id={props.index}
          onClick={props.handleTagRemove}
          className="remove"
        >
          <RemoveIcon className="icon light" id={props.index} />
        </button>
      )}
      {props.addable && (
        <button
          type="button"
          id={props.index}
          onClick={props.handleTagAdd}
          className="add"
        >
          <AddIcon className="icon light" id={props.index} />
        </button>
      )}
    </div>
  ) : (
    <Link to={link}>
      <div className="tag--bubble">
        <h2>{props.title}</h2>
      </div>
    </Link>
  );
}
