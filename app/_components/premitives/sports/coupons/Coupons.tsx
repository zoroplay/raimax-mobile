import React from "react";
import "./Coupons.scss";
import Link from "next/link";
import { FaMoneyBillAlt } from "react-icons/fa";
import { BsChevronRight } from "react-icons/bs";

const coups = [
  "BOTH TEAMS TO SCORE",
  "DOUBLE CHANCE",
  "ENGLAND MATCHES",
  "EURO MAJOR LEAGUE",
  "POPULAR MATCHES",
  "UEFA COMPETITION",
];

const Coupons = () => {
  return (
    <div className="live">
      {coups.map((item, idx) => (
        <Link key={idx} href={"/"} className="live_link between">
          <div className="left start">
            <div className="live_link_icon">
              <FaMoneyBillAlt />
            </div>{" "}
            <div className="live_link_text">{item}</div>
          </div>
          <div className="right">
            <BsChevronRight />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Coupons;
