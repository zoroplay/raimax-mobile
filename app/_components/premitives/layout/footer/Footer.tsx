"use client";
import React, { useState } from "react";
import "./Footer.scss";
import "@/icons.css";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { BsReceipt } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import {
  andriod,
  coralpay,
  firstmonie,
  firstbank,
  ussd,
  gtbank,
  verve,
  visa,
  master,
  interswitch,
  paystackf,
  opay,
  ios,
} from "@/_assets";
import { MdEmail } from "react-icons/md";
import { NavLink } from "@/_utils";
import { BetMetre, BetSlip, PlaceBetModal } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";

const links = [
  { name: "FAQ", link: "/help/faq" },
  { name: "ABOUT US", link: "/help/about-us" },
  { name: "TERMS & CONDITION", link: "/help/terms-and-condition" },
  //   { name: "PRIVACY POLICY", link: "privacy" },
  { name: "RESPONSIBLE GAMBLING", link: "/help/responsible-gaming" },
  { name: "CONTACT US", link: "/help/contact-us" },
  { name: "BETTING RULES", link: "/help/betting-rules" },
];
const socials = [
  { icon: <FaFacebookF />, link: "" },
  { icon: <FaInstagram />, link: "" },
  { icon: <FaTwitter />, link: "" },
  // { icon: <FaTiktok />, link: "" },
  // { icon: <MdEmail />, link: "" },
];

const Footer = () => {
  const [currentLink, setCurrentLink] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);
  const user = useAppSelector((state) => state.user);
  const isBetSlipModal = useAppSelector(
    (state) => state.modal?.globalModalState?.betslip
  );
  const isPlaceBetModal = useAppSelector(
    (state) => state.modal?.globalModalState?.placebet
  );
  // console.log(slips.coupon.selections.length >= 1, "mod");
  return (
    <div className="footer">
      <div className="footer_logos">
        {/* <div className="footer_logos_two between">
          <Image
            src={ios}
            width={102}
            height={31}
            alt="download app store"
            className="footer_logos_img"
          />
          <Image
            src={andriod}
            width={102}
            height={31}
            alt="download andriod"
            className="footer_logos_img"
          />
        </div> */}
        <div className="footer_logos_three between">
          <Image
            src={opay}
            width={102}
            height={31}
            alt="opay"
            className="footer_logos_img"
          />
          <Image
            src={paystackf}
            width={102}
            height={31}
            alt="paystack"
            className="footer_logos_img"
          />
          <Image
            src={interswitch}
            width={102}
            height={31}
            alt="interswitch"
            className="footer_logos_img"
          />
        </div>
        <div className="footer_logos_three between">
          <Image
            src={master}
            width={102}
            height={31}
            alt="master"
            className="footer_logos_img"
          />
          <Image
            src={visa}
            width={102}
            height={31}
            alt="visa"
            className="footer_logos_img"
          />
          <Image
            src={verve}
            width={102}
            height={31}
            alt="verve"
            className="footer_logos_img"
          />
        </div>
        <div className="footer_logos_three between">
          <Image
            src={gtbank}
            width={102}
            height={31}
            alt="gtbank"
            className="footer_logos_img"
          />
          <Image
            src={ussd}
            width={102}
            height={31}
            alt="ussd"
            className="footer_logos_img"
          />
          <Image
            src={firstbank}
            width={102}
            height={31}
            alt="firstbank"
            className="footer_logos_img"
          />
        </div>
        {/* <div className="footer_logos_two between">
          <Image
            src={firstmonie}
            width={102}
            height={31}
            alt="firstmonie"
            className="footer_logos_img"
          />
          <Image
            src={coralpay}
            width={102}
            height={31}
            alt="coralpay"
            className="footer_logos_img"
          />
        </div> */}
      </div>
      <div className="footer_links start col">
        {links.map((item, idx) => (
          <Link
            href={item.link}
            key={idx}
            className={`footer_links_item ${
              currentLink === item.name && "active"
            }`}
            onClick={() => setCurrentLink(item.name)}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="footer_socials between">
        {socials.map((item, idx) => (
          <Link
            href={item.link}
            key={idx}
            className="footer_socials_item center"
          >
            {item.icon}
          </Link>
        ))}
      </div>
      <div className="footer_text_wrap">
        <p className="footer_text">
          <span>18+</span> RaimaxBet is committed to supporting Responsible
          Gambling. Underage gambling is an offence.
        </p>
        {/* <p className="footer_text">
          Maxbet247 is not affiliated or connected with sports teams, event
          organisers or players displayed on its websites and/or mobile apps.
        </p>
        <p className="footer_text">
          This website is operated by Soloti gaming Limited (RC 1687373)
        </p>
        <p className="footer_text">
          Soloti Gaming Limited is licensed by: (i) The Nigerian Lottery
          Regulatory Commission (under Licence number 0001042) , (ii) Lagos
          State Lotteries and Gaming Authority (under Licence number 005310)
        </p> */}
      </div>

      <div className="copyright_wrap center">
        © <a href="https://mobile.raimax.bet/">RaimaxBet</a> 2023. All rights
        reserved.{" "}
      </div>
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

export default Footer;
