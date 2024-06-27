import React from "react";
import "./CmsContent.scss";

const CmsContent = ({ data }: any) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: data?.body }} className="test" />
    </div>
  );
};

export default CmsContent;
