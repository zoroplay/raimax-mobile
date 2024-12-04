"use client";
import React, { useState, useRef, useEffect } from "react";
import "./Prediction.scss";
import Container from "@/_components/premitives/container/Container";
import { BiChevronDown } from "react-icons/bi";

interface PredictionProps {
  outcomes: any;
  tournamentName: string;
  marketSpecifier: string;
  activeSpecifier: any;
  specifiers: string[];
  changeSpecifier: any;
}

const Prediction = ({
  outcomes,
  marketSpecifier,
  activeSpecifier,
  specifiers,
  changeSpecifier,
  tournamentName,
}: PredictionProps) => {
  // console.log(data, "odditem");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log(outcomes, "out");

  return (
    <div className="table_odds_item center">
      <Container>
        <div className="center">
          <div className="table_odds_heading">{tournamentName}</div>
          <div className="table_odds_wrap between">
            {/* <div className="center col table_odds_txt_wrap"> */}
            {/* {noBorder && <div className="table_odds_txt">3 way</div>} */}

            <div className="between table_odds_con_itm">
              {marketSpecifier === "total" ? (
                <div
                  className="center selector_pre_wrap"
                  style={{
                    width: `${100 / (outcomes?.length + 1)}%`,
                  }}
                >
                  <div
                    className="center selected"
                    onClick={() => setIsOpen(true)}
                  >
                    <span>{activeSpecifier.value || "Goals"}</span>
                    <span>
                      <BiChevronDown />
                    </span>
                  </div>
                  {isOpen && (
                    <div className="selector_pre_items" ref={dropdownRef}>
                      {specifiers.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className={`selector_pre_item center ${
                            activeSpecifier.specifier === item.specifier &&
                            "activ"
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            changeSpecifier(item);
                          }}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : marketSpecifier === "hcp" ? (
                <div
                  className="odds_title"
                  style={{
                    width: `${100 / (outcomes?.length + 1)}%`,
                  }}
                >
                  HC
                </div>
              ) : (
                <></>
              )}

              {outcomes?.map((item: any, idx: number) => (
                <div
                  className="table_odds"
                  key={idx}
                  style={{
                    border: idx === outcomes?.odds?.length - 1 ? "none" : "",
                    width:
                      outcomes?.length === 3 && marketSpecifier === "total"
                        ? "33%"
                        : outcomes?.length > 3
                        ? "25%"
                        : marketSpecifier === "hcp"
                        ? "25%"
                        : "",
                  }}
                >
                  <div
                    className="table_odds_items center"
                    style={{
                      width:
                        outcomes?.length > 3
                          ? "5%"
                          : marketSpecifier === "hcp"
                          ? "5%"
                          : "",
                    }}
                  >
                    {item?.outcomeName}
                  </div>
                </div>
              ))}
            </div>
            {/* </div> */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Prediction;
