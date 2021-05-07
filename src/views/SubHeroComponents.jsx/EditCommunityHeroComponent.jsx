import AddIcon from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";
import { editCommunity, setActive } from "../../store/actions/community.action";
import EditIcon from "@material-ui/icons/Edit";
import { TagInputComponent } from "../FormComponents";
import { TagBubbleComponent } from "../GeneralComponents";
// import { currentUser, firestore } from "../../firebase";

function EditCommunityHeroComponent(props) {
  const communityID = props.communities.active;
  const [communityDetails, setCommunityDetails] = useState({});

  useEffect(() => {
    setCommunityDetails(props.communityDetails[`details@${communityID}`]);
    setTitleInput(props.communityDetails[`details@${communityID}`]?.title);
    setDescriptionInput(
      props.communityDetails[`details@${communityID}`]?.description
    );
    setPreviewImage(props.communityDetails[`details@${communityID}`]?.photoURL);
    setTagList(props.communityDetails[`details@${communityID}`]?.tags);
    setTagList(props.communityDetails[`details@${communityID}`]?.tags);
  }, [communityID, props.communityDetails]);

  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [taginput, settaginput] = useState("");
  const [tag, settag] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [removedTagList, setRemovedTagList] = useState([]);
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

  const imageInputHandler = (event) => {
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

  const handleTitleInputChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleDescriptionInputChnage = (event) => {
    setDescriptionInput(event.target.value);
  };

  const handleChange = (event) => {
    settaginput(event.target.value);
    event.target.value.length > 0
      ? setclassnames("")
      : setclassnames("disabled");
    settag(event.target.value);
  };

  const handleTagInputChange = () => {
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
    const localRemovedTagList = removedTagList;
    tagList.map((tag, index) => {
      if (index != event.target.id) {
        localTagList.push(tag);
      } else {
        console.log(`${tag.tagName} removed`);
        if (tag.docID !== null) localRemovedTagList.push(tag);
      }
      setRemovedTagList(localRemovedTagList);
      setTagList(localTagList);
    });
  };

  const handleTagAdd = (event) => {
    const localRemovedTagList = [];
    const localTagList = tagList;
    removedTagList.map((tag, index) => {
      if (index != event.target.id) {
        localRemovedTagList.push(tag);
      } else {
        console.log(`${tag.tagName} added back`);
        localTagList.push(tag);
      }
      setRemovedTagList(localRemovedTagList);
      setTagList(localTagList);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { communitytitle, communitydescription } = event.target.elements;
    const title = communitytitle.value;
    const description = communitydescription.value;
    props
      .editCommunity({
        communityID,
        title,
        description,
        tagList,
        removedTagList,
        imageFile,
      })
      .then(history.push("/"));
  };
  if (!communityID) return <Redirect to="/" />;
  else
    return (
      <section className="inner--hero sub--hero">
        <form
          className="form"
          onSubmit={handleSubmit}
          id="create--community"
          autoComplete="off"
          action="./chat"
        >
          <h1 className="title">Edit the Community</h1>
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
              onChange={imageInputHandler}
            />
            <label htmlFor="image--input">
              <EditIcon className="circle icon light" />
            </label>
          </div>
          <div className="horizontal--separator"></div>
          <input
            required
            type="text"
            id="communitytitle"
            placeholder="Title"
            value={titleInput}
            onChange={handleTitleInputChange}
          />
          <textarea
            required
            id="communitydescription"
            placeholder="Add a description"
            maxLength="100"
            value={descriptionInput}
            onChange={handleDescriptionInputChnage}
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
            <button
              type="button"
              className={classnames}
              onClick={handleTagInputChange}
            >
              <AddIcon className="icon light" />
            </button>
          </div>
          {tagList && tagList.length > 0 && (
            <fieldset>
              <legend>
                <h1 className="meta">Tags</h1>
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
          {removedTagList.length > 0 && (
            <fieldset>
              <legend>
                <h1 className="meta">Removed from existing tags</h1>
              </legend>
              <div className="tag--container scrollable scroll-direction-y">
                {removedTagList.map((element, index) => {
                  return (
                    <TagBubbleComponent
                      key={index}
                      index={index}
                      title={element.tagName}
                      handleTagAdd={handleTagAdd}
                      editable
                      addable
                    />
                  );
                })}
              </div>
            </fieldset>
          )}
          <button type="submit" className="cta">
            Edit Community
          </button>
        </form>
      </section>
    );
}
const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    communities: state.communities,
    communityDetails: state.communityDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    editCommunity: (data) => dispatch(editCommunity(data)),
    setActive: (communityid) => dispatch(setActive(communityid)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCommunityHeroComponent);
