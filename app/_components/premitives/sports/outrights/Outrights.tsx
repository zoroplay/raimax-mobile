"use client";
import React, { useState } from "react";
import "./Outrights.scss";
import Link from "next/link";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { AiOutlineStar } from "react-icons/ai";

const sportTabItems = [
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
  {
    title: "CHAMPIONSHIP PROMOTION",
    date: "End Date: 28-05-24 19:00:00",
  },
];

const accordionItems = [
  {
    title: "ATLANTA BRAVE",
    icon: <div className="sbe-sb-sports-icon soccer" />,
    link: "/sports/football/competition",
  },
  {
    title: "ATLANTA BRAVE",
    icon: <div className="sbe-sb-sports-icon basketball" />,
    link: "/sports/basketball/competition",
  },
  {
    title: "ATLANTA BRAVE",
    icon: <div className="sbe-sb-sports-icon tennis" />,
    link: "/sports/tennis/competition",
  },
  {
    title: "ATLANTA BRAVE",
    icon: <div className="sbe-sb-sports-icon baseball" />,
    link: "/sports/baseball/competition",
  },
];
const Outrights = () => {
  const [currentSub, setCurrentSub] = useState<string | null>();
  const [isCurrentSub, setIsCurrentSub] = useState<boolean>(false);
  return (
    <div className="outrights_wrap">
      <div className="outrights_wrap_head start">OUTRIGHTS</div>
      {sportTabItems.map((item, idx) => (
        <>
          <div
            key={idx}
            className="outrights between"
            onClick={() => {
              setCurrentSub(item.title);
              setIsCurrentSub(!isCurrentSub);
            }}
          >
            <div className="outrights_left start col">
              <div className="outrights_title">{item.title}</div>
              <div className="outrights_date">{item.date}</div>
            </div>
            <div className="outrights_right center">
              <div
                className={`outrights_down ${
                  currentSub === item.title && isCurrentSub && "active"
                }`}
              >
                <BiChevronDown />
              </div>
            </div>
          </div>
          {currentSub === item.title &&
            isCurrentSub &&
            accordionItems.map((item, idx) => (
              <Link
                href={item.link}
                key={`outrights_sub_link_${idx}`}
                className="outrights_sub_link between"
              >
                <div className="outrights_sub_link_left center">
                  {/* <div className="outrights_sub_link_icon">{item.icon}</div> */}
                  <div className="outrights_sub_link_title">{item.title}</div>
                </div>
                <div className="outrights_sub_link_right center">
                  {/* <div className="outrights_sub_link_down">
                    <LiaMoneyBillWaveSolid />
                  </div>
                  <div className="outrights_sub_link_down">
                    <AiOutlineStar />
                  </div> */}
                  <div className="outrights_sub_link_num">+400</div>
                  {/* <div className="outrights_sub_link_down">
                    <BiChevronRight />
                  </div> */}
                </div>
              </Link>
            ))}
        </>
      ))}
    </div>
  );
};

export default Outrights;
