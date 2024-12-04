import React from "react";
import "./Container.scss";

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="container">
      <div className="container-child">{children}</div>
    </div>
  );
};

export default Container;
