"use client";
import React, { useEffect } from "react";
import "./SelectBalance.scss";
import { Button, Input } from "@/_components";
import { HiMiniXMark } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { useGetGameUrlMutation } from "@/_services/casino.service";
interface Props {
  data: string;
}
const SelectBalance = ({ data }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [getGameUrl, { isLoading, isSuccess, isError, data: gameData, error }] =
    useGetGameUrlMutation();

  const launchGame = (type: string) => {
    if (type === "real" && !user) {
      dispatch(openModal({ component: "LoginModal" }));
      return;
    }

    getGameUrl({
      gameId: Number(data),
      username: user?.username || "guest",
      userId: user?.id || 0,
      demo: type === "demo" ? true : false,
      isMobile: true,
      homeUrl: process.env.NEXT_PUBLIC_SITE_URL,
      authCode: user?.authCode || "demo",
      balanceType: type,
    });
  };

  useEffect(() => {
    if (isSuccess && gameData) {
      window.open(gameData?.url);
      dispatch(closeComponentModal());
    }
    if (isError) {
    }
  }, [isSuccess, isError, gameData, error]);
  return (
    <div className="select_balance_block center col">
      <div className="confirm_coupon_title_wrap between">
        <div className="select_balance_title">SELECT THE BALANCE</div>
        <div
          className="confirm_coupon_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      <div className="select_balance_texts">
        {/* <div className="confirm_bet_coupon_text1">
          You have an active casino bonus
        </div> */}
        <div className="confirm_bet_coupon_text1">
          Choose the balance to use for this game sessions
        </div>
      </div>
      <div className="confirm_coupon_btn_wrap between">
        <Button
          text={user && user.casinoBonusBalance > 0 ? "Bonus" : "Demo"}
          type="button"
          loading={isLoading}
          className="select_balance_btn_cancel"
          onClick={() => {
            launchGame(user && user.casinoBonusBalance > 0 ? "bonus" : "demo");
          }}
        />
        <Button
          text="REAL MONEY"
          type="submit"
          loading={isLoading}
          className="confirm_coupon_btn"
          onClick={() => {
            launchGame("real");
          }}
        />
      </div>
    </div>
  );
};

export default SelectBalance;
