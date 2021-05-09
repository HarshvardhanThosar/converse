import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import LabelImportantRoundedIcon from "@material-ui/icons/LabelImportantRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import { useEffect, useState } from "react";

export default function ValidationTileCommponent(props) {
  const [classNames, setclassNames] = useState("validation__tile");
  const [iconElement, setIconElement] = useState(props.icon);
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (props.type) {
      case "error":
        setclassNames("validation__tile error");
        setIconElement(<ErrorOutlineIcon className="icon" />);
        break;
      case "success":
        setclassNames("validation__tile success");
        setIconElement(<CheckCircleOutlineIcon className="icon" />);
        break;
      case "warning":
        setclassNames("validation__tile warning");
        setIconElement(<WarningRoundedIcon className="icon" />);
        break;
      case "instruction":
        setclassNames("validation__tile instruction");
        setIconElement(<LabelImportantRoundedIcon className="icon" />);
        break;
      default:
        setclassNames("validation__tile");
        setIconElement(<StarRoundedIcon className="icon" />);
    }
  }, [props.type]);

  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);

  return (
    <div className={classNames}>
      {iconElement}
      <h2 className="title">{title}</h2>
    </div>
  );
}
