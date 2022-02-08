import React, { useContext } from "react";

import DisplayContext from "../../context/DisplayContext";

function TimeLeft() {
  const displayContext = useContext(DisplayContext);
  const { userInfo } = displayContext;

  function formatTime(part) {
    if (userInfo["daysLeft"] === undefined) return "";

    let daysLeft = userInfo["daysLeft"];
    if (part === "d") return Math.floor(daysLeft);
    if (part === "h") return Math.floor((daysLeft - Math.floor(daysLeft)) * 24);
    if (part === "m")
      return Math.floor(
        (daysLeft -
          Math.floor(daysLeft) -
          Math.floor(daysLeft - Math.floor(daysLeft))) *
          60
      );
    return undefined;
  }

  return (
    <>
      <div className="time-left-label">
        <div>Time Left</div>
        <div className="time">
          <div>
            <div>{formatTime("d")}</div>
            <div>days</div>
          </div>
          <div>
            <div>{formatTime("h")}</div>
            <div>hours</div>
          </div>
          <div>
            <div>{formatTime("m")}</div>
            <div>mins</div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}

export default TimeLeft;
