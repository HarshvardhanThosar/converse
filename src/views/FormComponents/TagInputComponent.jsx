import AddIcon from "@material-ui/icons/Add";

export default function TagInputComponent() {
  return (
    <div className="add--bar">
      <input
        type="text"
        name="taginput"
        id="tag--input"
        className="tag--input"
        placeholder="Add a tag"
        autoComplete="off"
      />
      <button type="button" className="disabled">
        <AddIcon className="icon light" />
      </button>
    </div>
  );
}
