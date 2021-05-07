import AddIcon from "@material-ui/icons/Add";
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  createCommunity,
  setActive,
} from "../../store/actions/community.action";
import EditIcon from "@material-ui/icons/Edit";
import { TagInputComponent } from "../FormComponents";
import { TagBubbleComponent } from "../GeneralComponents";
// import { currentUser, firestore } from "../../firebase";

function CreateCommunityHeroComponent(props) {
  const [taginput, settaginput] = useState("");
  const [tag, settag] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [classnames, setclassnames] = useState("disabled");
  const [previewImage, setPreviewImage] = useState(
    "https://freepikpsd.com/wp-content/uploads/2019/10/default-user-profile-image-png-2-Transparent-Images-1.png"
  );
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState(
    "No file selected as new diplay image."
  );
  const allowedType = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/svg",
    "image/ico",
  ];
  const history = useHistory();

  let imageHandler = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreviewImage(reader.result);
      }
    };
    if (event.target.files.length == 1) {
      setImageFile(event.target.files[0]);
      setImageFileName(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleChange = (event) => {
    settaginput(event.target.value);
    event.target.value.length > 0
      ? setclassnames("")
      : setclassnames("disabled");
    settag(event.target.value);
  };

  const handleTagInput = () => {
    console.log(`${taginput} added`);
    if (tag !== null) {
      const localTagList = [...tagList, { docID: null, tagName: tag }];
      setTagList(localTagList);
    }
    settag(null);
    settaginput("");
    setclassnames("disabled");
  };

  const handleTagRemove = (event) => {
    const localTagList = [];
    tagList.map((tag, index) => {
      if (index != event.target.id) {
        localTagList.push(tag);
      } else {
        console.log(`${tag.tagName} removed`);
      }
      return setTagList(localTagList);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { communitytitle, communitydescription } = event.target.elements;
    const title = communitytitle.value;
    const description = communitydescription.value;
    props
      .createCommunity({ title, description, tagList, imageFile })
      .then(history.push("/"));
  };

  return (
    <section className="inner--hero sub--hero">
      <form
        className="form"
        onSubmit={handleSubmit}
        id="create--community"
        autoComplete="off"
        action="./chat"
      >
        <h1 className="title">Create a Community</h1>
        <div className="preview--container">
          <img
            className="image--preview"
            id="image--preview"
            src={previewImage}
          />
          <p id="image--file" className="meta" title="">
            {imageFileName}
          </p>
          <input
            type="file"
            name="image--input"
            id="image--input"
            className="hidden"
            accept="image/*"
            onChange={imageHandler}
          />
          <label htmlFor="image--input">
            <EditIcon className="circle icon light" />
          </label>
        </div>
        <div className="horizontal--separator"></div>
        <input required type="text" id="communitytitle" placeholder="Title" />
        <textarea
          required
          id="communitydescription"
          placeholder="Add a description"
          maxLength="100"
        ></textarea>
        {/* <TagInputComponent /> */}
        <div className="add--bar">
          <input
            type="text"
            name="taginput"
            id="tag--input"
            className="tag--input"
            placeholder="Add a tag"
            onChange={handleChange}
            value={taginput}
          />
          <button type="button" className={classnames} onClick={handleTagInput}>
            <AddIcon className="icon light" />
          </button>
        </div>
        {tagList.length > 0 && (
          <fieldset>
            <legend>
              <h1 className="meta">Tags ● {tagList.length}</h1>
            </legend>
            <div className="tag--container scrollable scroll-direction-y">
              {tagList.map((element, index) => {
                return (
                  <TagBubbleComponent
                    key={index}
                    index={index}
                    title={element.tagName}
                    handleTagRemove={handleTagRemove}
                    editable
                    removable
                  />
                );
              })}
            </div>
          </fieldset>
        )}
        <button type="submit" className="cta">
          Create Community
        </button>
      </form>
    </section>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    createCommunity: (data) => dispatch(createCommunity(data)),
    setActive: (communityid) => dispatch(setActive(communityid)),
  };
};
export default connect(null, mapDispatchToProps)(CreateCommunityHeroComponent);
