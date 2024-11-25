import React from "react";

function ViewImage({ photo, index }) {
  return (
    <div className="view-image">
      <img src={photo} alt={"uploaded by user"} key={index} />
    </div>
  );
}

export default ViewImage;
