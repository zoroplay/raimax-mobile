"use client";
import React, { useEffect, useState } from "react";
import "./MyBetsBlock.scss";
import { PlacedBets, BreadCrumb, SelectTab, SettledBets } from "@/_components";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/_hooks";

const tab = ["PLACED", "SETTLED"];

const MyBetsBlock = () => {
  const [current, setCurrent] = useState<string>("PLACED");

  const { token } = useAppSelector((state) => state.user);
  const router = useRouter();

  const Component = {
    PLACED: <PlacedBets />,
    SETTLED: <SettledBets />,
  }[current];

  useEffect(() => {
    token === null && router.push("/");
  }, [token]);

  return (
    <div className="mybets">
      <BreadCrumb title="My bets" />
      <SelectTab
        tabs={tab}
        current={current}
        setCurrent={setCurrent}
        className="mybets_tabs"
      />
      {Component}
    </div>
  );
};

export default MyBetsBlock;
