import { useEffect, useState } from "react";

export default function AvatarComponent(props) {
  let imagesrc = null;
  const [size, setSize] = useState("");
  const [networkStatus, setNetworkStatus] = useState(null);

  useEffect(() => {
    setSize(props.size);
  }, [props.size]);

  if (props.src) {
    imagesrc = props.src;
  } else {
    imagesrc =
      "https://freepikpsd.com/wp-content/uploads/2019/10/default-user-profile-image-png-2-Transparent-Images-1.png";
  }

  switch (size) {
    case "small":
      return (
        <div className="avatar__container small">
          <img
            src={imagesrc}
            alt="Avatar"
            className="avatar skeleton--loader"
          />
        </div>
      );
    case "big":
      return (
        <div className="avatar__container">
          {networkStatus && <div id="network__status"></div>}
          <img src={imagesrc} alt="Avatar" className="avatar" />
        </div>
      );
    default:
      return (
        <div className="avatar__container">
          {networkStatus && <div id="network__status"></div>}
          <img src={imagesrc} alt="Avatar" className="avatar" />
        </div>
      );
  }
}
