import React from "react";
import "./Empty.scss";

interface EmptyProp {
  icon: JSX.Element;
  title: string;
  subTitle?: string;
}

const Empty = ({ icon, title, subTitle }: EmptyProp) => {
  return (
    <div className="empty center col">
      <div className="empty_icon_wrap">
        <div className="empty_icon">{icon}</div>
      </div>
      <div className="empty_title">{title}</div>
      <div className="empty_sub">{subTitle}</div>
    </div>
  );
};

export default Empty;
