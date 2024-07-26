import React, { Suspense, useState } from "react";
import "./mybets.scss";
import { BreadCrumb, SelectTab } from "@/_components";
import { MyBetsBlock } from "@/_blocks";

const Page = () => {
  return (
    <div className="mybets">
      <Suspense>
        <MyBetsBlock />
      </Suspense>
    </div>
  );
};

export default Page;
