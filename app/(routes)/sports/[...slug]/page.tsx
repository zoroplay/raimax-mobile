"use client";
import {
  AllSports,
  Banner,
  Competition,
  Empty,
  Sport,
} from "@/_components";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { BiSearchAlt } from "react-icons/bi";
import { LeaguesTab } from "@/_components";

const Page = () => {
  const router = useParams();

  let Component;
  if (router.slug[0] === "all") {
    Component = <AllSports />;
  } else if (router.slug.length === 2 && router.slug[0] !== "all") {
    Component = <Sport />;
  } else if (router.slug.length > 2) {
    Component = <Competition />;
  } else {
    Component = <Empty title="Nothing Found" icon={<BiSearchAlt />} />;
  }

  return (
    <div>
      <LeaguesTab />
      <Banner />
      {Component}
    </div>
  );
};

export default Page;
