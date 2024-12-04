"use client";
import React, { useState, useEffect, Fragment } from "react";
import "./BetMetre.scss";
import { motion, AnimatePresence } from "framer-motion";
import { BsCheck } from "react-icons/bs";
import { HiMiniXMark } from "react-icons/hi2";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { formatNumber, multibetCombination } from "@/_utils/helpers";
import { modalStateFalse, openModal } from "@/_redux/slices/modal.slice";
import { rtkMutation, slugify } from "@/_utils";
import {
  removeFromCoupon,
  updateWinnings,
} from "@/_redux/slices/betslip.slice";
import { usePlaceBetMutation } from "@/_services/bet.service";
import { BetMetreBar } from "@/_components";
import Link from "next/link";

const BetMetre = () => {
  const dispatch = useAppDispatch();
  const { coupon } = useAppSelector((state) => state.betslip);
  const { token } = useAppSelector((state) => state.user);
  const isBetSlipModal = useAppSelector(
    (state) => state.modal?.globalModalState?.betslip
  );

  const { SportsbookGlobalVariable } = useAppSelector((state) => state.sport);

  const [stake, setStake] = useState(coupon.stake);
  const [show, setShow] = useState(true);
  const [isFirstMount, setIsFirstMount] = useState(true);

  // const [showLoading, setShowLoading] = useState(false);

  const slips = coupon.selections;

  const [
    placeBet,
    {
      isLoading: isLoadingPlaceBet,
      isError: isErrorPlaceBet,
      isSuccess: isSuccessPlaceBet,
      data: dataPlaceBet,
      error: errorPlaceBet,
    },
  ] = usePlaceBetMutation();

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStake(e.target.value);
    dispatch(
      updateWinnings({
        stake: e.target.value,
        globalVars: SportsbookGlobalVariable,
        id: e.target.id,
      })
    );
  };

  useEffect(() => {
    if (slips.length === 1 && !isBetSlipModal) {
      dispatch(
        updateWinnings({
          stake,
          globalVars: SportsbookGlobalVariable,
          id: "single",
        })
      );
    }
    // setIsFirstMount(false);
  }, [stake, dispatch, isBetSlipModal]);

  useEffect(() => {
    setShow(true);
  }, [slips]);

  return (
    <>
      <AnimatePresence mode="wait">
        {show && (
          <Fragment>
            <motion.div
              key="metre"
              className="betmetre"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ translateY: 200 }}
              transition={{
                duration: 0.4,
                delay: 0,
                // ease: "easeInOut",
              }}
            >
              {coupon.maxBonus !== 0 && <BetMetreBar />}
              <div className="betmetre_wrap">
                {slips.length === 1 ? (
                  <>
                    <div className="slip_item_wrap">
                      <div className={"slip_item"}>
                        <div className="slip_item_win_draw between">
                          <div className="slip_item_team start">
                            {/* <div
                            className="slip_item_team_icon"
                            onClick={() =>
                              dispatch(removeFromCoupon(slips[0]?.selectionId))
                            }
                          >
                            <HiMiniXMark />
                          </div> */}
                            <div className="slip_item_team_name ">
                              {slips[0]?.oddname}
                            </div>
                          </div>
                          <div className="input_stake start">
                            <div className="input_stake_text">
                              {slips[0]?.odds}
                            </div>
                            <div className="input_stake_wrap">
                              <input
                                className="input_stake"
                                placeholder="Stake"
                                value={coupon.stake}
                                type="number"
                                id={"single"}
                                // onFocus={(e) => e.target.select()}
                                onChange={handleStakeChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="slip_item_odd">
                          {slips[0]?.market_name}
                        </div>
                        <Link
                          href={`/fixture/${slugify(slips[0]?.sport)}/${slugify(
                            slips[0]?.tournament
                          )}/${slugify(slips[0]?.event_name)}/${
                            slips[0]?.provider_id
                          }`}
                          className="slip_item_teams"
                          onClick={() => dispatch(modalStateFalse("betslip"))}
                        >
                          {slips[0]?.event_name?.replace("-", "vs")}
                        </Link>
                        {coupon.bet_type === "Combo" && (
                          <div className="slip_item_check_wrap start">
                            <div className="slip_item_check center">
                              <BsCheck />
                            </div>
                            <div className="slip_item_check_text">
                              BetSlip.Banker
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="book_slip start">
                      {coupon.stake > 0 ? (
                        <div
                          className="book_slip_value_wrap center col"
                          onClick={() => {
                            token
                              ? dispatch(openModal({ modalState: "placebet" }))
                              : dispatch(
                                  openModal({ component: "LoginModal" })
                                );
                            // token && setShowLoading(true);
                          }}
                        >
                          <div className="book_slip_value_bold">
                            {"PLACE BETS NGN " + formatNumber(coupon.stake)}
                          </div>
                          <div className="book_slip_value_text">
                            {"Possible winnings NGN " +
                              formatNumber(coupon.maxWin)}
                          </div>
                        </div>
                      ) : (
                        <div className="book_slip_text center">
                          {"Please set a stake"}
                        </div>
                      )}
                      <div
                        className="book_slip_book center col"
                        onClick={() =>
                          dispatch(openModal({ component: "BookBetslip" }))
                        }
                      >
                        <div className="book_slip_icon">
                          <BsFillBookmarkCheckFill />
                        </div>
                        <div className="book_slip_book_text">Book Betslip</div>
                      </div>
                    </div>
                  </>
                ) : coupon.maxBonus !== 0 ? (
                  <div
                    className="betmetre_metre "
                    onClick={() =>
                      dispatch(openModal({ modalState: "betslip" }))
                    }
                  >
                    <div className="betmetre_metre_wrap between">
                      <div className="betmetre_count center">
                        {slips.length}
                      </div>
                      <div className="betmetre_odds">
                        <span className="betmetre_odds_multi">
                          {multibetCombination(slips)}{" "}
                          {typeof multibetCombination(slips) === "number" &&
                            "folds"}
                        </span>
                        <span className="betmetre_odds_total">
                          {coupon.totalOdds}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {slips.length === 1 && (
                  <div
                    className="betmetre_cancel center"
                    // onClick={() => dispatch(modalStateFalse({ modalState: "betslip" }))}
                    style={{
                      backgroundColor: slips.length > 1 ? "#1e312e" : "",
                      color: slips.length > 1 ? "#fff" : "",
                    }}
                    onClick={() => setShow(false)}
                  >
                    <HiMiniXMark />
                  </div>
                )}
              </div>
            </motion.div>
          </Fragment>
        )}
      </AnimatePresence>
    </>
  );
};

export default BetMetre;
