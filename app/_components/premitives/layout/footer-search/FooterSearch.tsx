"use client";
import React, { useState } from "react";
import "./FooterSearch.scss";
import "@/icons.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { BsReceipt } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import { MdEmail } from "react-icons/md";
import { NavLink } from "@/_utils";
import { BetMetre, BetSlip, PlaceBetModal } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";

const FooterSearch = () => {
  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);
  const user = useAppSelector((state) => state.user);
  const isBetSlipModal = useAppSelector(
    (state) => state.modal?.globalModalState?.betslip
  );
  const isPlaceBetModal = useAppSelector(
    (state) => state.modal?.globalModalState?.placebet
  );

  return (
    <div className="footer">
      <div className="footer_nav between">
        <NavLink
          href="/"
          className="footer_nav_link center col"
          activeClassName="active"
        >
          <div className="footer_nav_icon">
            <IoIosHome />
          </div>
          <span>HOME</span>
        </NavLink>
        {user.token && (
          <NavLink
            href="/mybets"
            className="footer_nav_link center col"
            activeClassName="active"
          >
            <div className="footer_nav_icon">
              <TfiWrite />
            </div>
            <span>MY BETS</span>
          </NavLink>
        )}
        <NavLink
          href="/favorites"
          className="footer_nav_link center col"
          activeClassName="active"
        >
          <div className="footer_nav_icon">
            <AiFillStar />
          </div>
          <span>FAVOURITES</span>
        </NavLink>
        <div
          className="footer_nav_link center col"
          onClick={() => {
            dispatch(openModal({ modalState: "betslip" }));
          }}
        >
          <div className="footer_nav_icon">
            <BsReceipt />
          </div>
          <span>BETSLIP</span>
          {slips?.coupon?.selections?.length >= 1 && (
            <div
              className={`${
                user.token ? "slips_count_auth" : "slips_count"
              } center`}
            >
              {slips?.coupon?.selections?.length}
            </div>
          )}
        </div>
        <NavLink
          href="/settings"
          className="footer_nav_link center col"
          activeClassName="active"
        >
          <div className="footer_nav_icon">
            <IoSettingsOutline />
          </div>
          <span>SETTINGS</span>
        </NavLink>
      </div>
      {slips?.coupon?.selections?.length >= 1 && <BetMetre />}
      {isBetSlipModal && <BetSlip />}
      {isPlaceBetModal && <PlaceBetModal />}
    </div>
  );
};

export default FooterSearch;
