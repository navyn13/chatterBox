import "./Video_thumbnail.css";
import React from "react";

function Video_thumbnail() {
  return (
    <div className="Video_thumbnail">
      <div className="thumbnail">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi5kWgpFCKbm_68FpyYGXpQoN5U_DiU8RG4Q&usqp=CAU"></img>
      </div>
      <div className="data">
        <div className="title">Valorant Live stream</div>
        <div className="channel_pic">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdyTh5ljvubR6s3LeERqK8DHldWwD3DcwBLw&usqp=CAU"></img>
          <div className="channel_name">tenZ</div>
        </div>
      </div>
    </div>
    // </div>
  )
}
export default Video_thumbnail;
