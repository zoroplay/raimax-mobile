"use client";
import React, { useEffect, useState, useRef } from "react";
import "./Header.scss";
import {
  // ball,
  logo,
  casinos,
  promo,
  dep,
  live,
  penaldo,
  jetx,
} from "@/_assets";
import Image from "next/image";
import Container from "../../container/Container";
import { BiSolidUser } from "react-icons/bi";
import { Button } from "@/_components";
import { useRouter, useSearchParams } from "next/navigation";
import { IoIosFootball } from "react-icons/io";
import { AiOutlineClockCircle, AiFillCodeSandboxCircle } from "react-icons/ai";
import { MdAppShortcut } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";
import { BiSolidCalendar } from "react-icons/bi";
import { IoChatbubblesSharp } from "react-icons/io5";
import { TbPlayFootball } from "react-icons/tb";
import MD5 from "crypto-js/md5";
import { Modal } from "@/_components";
import Link from "next/link";
import { useAppDispatch, useAppSelector, useSticky } from "@/_hooks";
import { openModal, setFixtureTab } from "@/_redux/slices/modal.slice";
import { logoutUser, updateUser } from "@/_redux/slices/user.slice";
import { useGetUserDetailsQuery } from "@/_services/auth.service";
import {
  useGetGlobalVariableQuery,
  useGetBonusListQuery,
} from "@/_services/sport.service";
import { useFindWithCodeQuery } from "@/_services/bet.service";
import { updateSportsbookGlobalVariable } from "@/_redux/slices/sport.slice";
import { formatNumber } from "@/_utils/helpers";
import {
  updateCoupon,
  updateSportsbookBonusList,
  updateStakeValues,
  updateWinnings,
} from "@/_redux/slices/betslip.slice";
import { useIsInactive } from "@/_hooks";
import { useGetGameUrlMutation } from "@/_services/casino.service";

// only load Button component on client
// const Button = dynamic(() => import("@/_components/widgets/button/Button"), {
//   ssr: false,
// });

const betTabItems = [
  { title: "All sports", icon: <IoIosFootball />, link: "/sports/all" },
  { title: "Live", icon: <AiOutlineClockCircle />, link: "/" },
  { title: "Today", icon: <BiSolidCalendar />, link: "/" },
  // { title: "Your Odds", icon: <BiHash />, link: "" },
  {
    title: "JetX",
    icon: <Image src={jetx} width={50} height={50} alt="ball" />,
    link: "#",
  },
  { title: "Virtuals", icon: <TbPlayFootball />, link: "" },

  // { title: "10x Minimum", icon: <AiFillCodeSandboxCircle />, link: "" },
  { title: "Pool Codes", icon: <AiFillCodeSandboxCircle />, link: "" },
  {
    title: "Casino",
    icon: <Image src={casinos} width={50} height={50} alt="casino" />,
    link: "/casino/all",
  },
  {
    title: "Penaldo",
    icon: (
      <Image
        src={penaldo}
        width={50}
        height={50}
        alt="ball"
        style={{ objectFit: "contain" }}
      />
    ),
    link: "/game/play/live-casino/shack-evolution/penaldo",
  },
  {
    title: "Live Casino",
    icon: (
      <Image
        src={live}
        width={50}
        height={50}
        alt="casino"
        style={{ objectFit: "cover" }}
      />
    ),
    link: "",
  },
  {
    title: "Instant Deposit",
    icon: <Image src={dep} width={50} height={50} alt="casino" />,
    link: "",
  },
  {
    title: "Promotions",
    icon: (
      <Image
        src={promo}
        width={50}
        height={50}
        alt="casino"
        style={{ objectFit: "cover" }}
      />
    ),
    link: "",
  },
  { title: "Live Chat", icon: <IoChatbubblesSharp />, link: "" },
  { title: "Telegram", icon: <FaTelegramPlane />, link: "" },
  { title: "App", icon: <MdAppShortcut />, link: "/" },
];

const Header = () => {
  useIsInactive();
  const route = useRouter();
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [slipCode, setSlipCode] = useState<string | null>(null);
  const [getGameUrl, {isLoading, isSuccess, isError, data, error}] = useGetGameUrlMutation();

  const { data: global, refetch } = useGetGlobalVariableQuery("");
  const { data: bonus } = useGetBonusListQuery("");

  const user = useAppSelector((state) => state.user);
  const { coupon } = useAppSelector((state) => state.betslip);
  const { SportsbookGlobalVariable } = useAppSelector((state) => state.sport);
  const search = useSearchParams();
  const { data: userDetails } = useGetUserDetailsQuery("", {
    skip: !user.token,
  });
  const shouldQueryFire = slipCode !== undefined && slipCode !== null;
  const { data: withCodeData, isSuccess: isSuccessFindBookedBet } =
    useFindWithCodeQuery(slipCode, {
      skip: !shouldQueryFire,
    });

  // console.log(user.token, "user");
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_SITE_KEY);
  const backurl = process.env.NEXT_PUBLIC_SITE_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;
  const dispatch = useAppDispatch();

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess && data) {
      window.open(data?.url);
    }

    if (isError) {

    }
  }, [isSuccess, isError, data, error]);

  const openPage = (item: any) => {
    if (item.title === "Virtuals") {
      window.open(
        `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
      );
    } else if (item.title === "JetX") {
      getGameUrl({
        gameId: 122,
        username: user.user?.username || 'guest',
        userId: user.user?.id || 0,
        demo: user ? false : true,
        isMobile: true,
        homeUrl: process.env.NEXT_PUBLIC_SITE_URL,
        authCode: user.user?.authCode || 'demo',
      });
    } else if (item.title === "Penalty Kick") {
      user.token
        ? route.push(item.link)
        : dispatch(openModal({ component: "LoginModal" }));
    } else {
      route.push(item.link);
    }
  };

  const isSticky = useSticky(100);

  useEffect(() => {
    refetch();
    dispatch(updateSportsbookGlobalVariable(global));
  }, [global, dispatch]);

  useEffect(() => {
    dispatch(updateSportsbookBonusList(bonus));
  }, [bonus, dispatch]);

  useEffect(() => {
    if (user.token) {
      setMode(1);
      setGroup(user.user?.group);
      setToken(user.user?.authCode);
    }
  }, [user]);

  useEffect(() => {
    if (userDetails?.success) {
      dispatch(
        updateUser({ user: userDetails?.data, token: userDetails?.data?.token })
      );
    }
  }, [userDetails]);

  useEffect(() => {
    dispatch(updateStakeValues(100));
  }, []);

  useEffect(() => {
    const hashStr = MD5(
      `${token}10100${backurl}${mode}${group}mobile${privateKey}`
    ).toString();

    setHash(hashStr);
  }, [token]);

  useEffect(() => {
    if (user && user.user && user.user.availableBalance < 10) {
      setTimeout(() => {
        dispatch(openModal({ component: "ToDepositModal" }));
      }, 10000);
    }
  }, [user]);

  useEffect(() => {
    const searchCode = search.get("shareCode");
    const couponUpdate = { ...coupon };
    couponUpdate.selections = withCodeData?.data?.selections;

    if (searchCode) {
      setSlipCode(searchCode);
    }
    isSuccessFindBookedBet &&
      withCodeData?.success &&
      dispatch(updateCoupon(couponUpdate));
    isSuccessFindBookedBet &&
      withCodeData?.success &&
      dispatch(
        updateWinnings({ stake: "100", globalVars: SportsbookGlobalVariable })
      );
    isSuccessFindBookedBet &&
      withCodeData?.success &&
      dispatch(openModal({ modalState: "betslip" }));
    isSuccessFindBookedBet &&
      !withCodeData?.success &&
      dispatch(
        openModal({
          title: "Booking Code Not Found",
          message: withCodeData?.message,
        })
      );
  }, [search, dispatch, isSuccessFindBookedBet]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log(withCodeData, "withCode");

  return (
    <>
      {/* {isLoginModal && <LoginModal setIsLoginModal={setIsLoginModal} />} */}
      <Modal />
      <div className="header">
        <Container>
          <div className="between center">
            <Link href={"/"}>
              <Image
                src={logo}
                alt="logo"
                width={120}
                height={50}
                className="logo"
              />
            </Link>
            {user.token ? (
              <div className="header_loggedin center">
                <Button
                  text="Deposit"
                  className="header_loggedin_btn"
                  onClick={() => {
                    dispatch(openModal({ component: "DepositModal" }));
                  }}
                />
                <div className="header_loggedin_user_wrap center">
                  <div
                    className="header_loggedin_icon"
                    onClick={() => setIsProfileModal(!isProfileModal)}
                  >
                    <BiSolidUser />
                  </div>
                </div>
                <div
                  className={`profile_modal ${
                    !isProfileModal ? "activeMod" : ""
                  }`}
                  ref={profileRef}
                >
                  <div className="profile_modal_wrap between">
                    <div className="profile_modal_key">Username:</div>
                    <div className="profile_modal_value num">
                      {user?.user?.username}
                    </div>
                  </div>
                  <div className="profile_modal_wrap between">
                    <div className="profile_modal_key">Awoof:</div>
                    <div className="profile_modal_value">
                      {formatNumber(userDetails?.data?.sportBonusBalance) ||
                        formatNumber(user?.user?.sportBonusBalance)}{" "}
                      NG
                    </div>
                  </div>
                  <div className="profile_modal_wrap between">
                    <div className="profile_modal_key">Withdrawable:</div>
                    <div className="profile_modal_value">
                      {formatNumber(userDetails?.data?.availableBalance) ||
                        formatNumber(user?.user?.availableBalance) ||
                        "0.00"}{" "}
                      NGN
                    </div>
                  </div>
                  <div className="profile_modal_wrap between">
                    <div className="profile_modal_key">Unlocking:</div>
                    <div className="profile_modal_value">0.00 NGN</div>
                  </div>
                  <div
                    className="profile_modal_wrap between"
                    onClick={() => {
                      setIsProfileModal(false);
                    }}
                  >
                    <Link
                      href={"/player-portal/deposits"}
                      className="profile_modal_key"
                    >
                      Deposit
                    </Link>
                    <div className="profile_modal_value"></div>
                  </div>
                  <div
                    className="profile_modal_wrap between"
                    onClick={() => {
                      setIsProfileModal(false);
                    }}
                  >
                    <Link
                      href={"/player-portal/sport-bonus"}
                      className="profile_modal_key"
                    >
                      Sport Bonus
                    </Link>
                    <div className="profile_modal_value"></div>
                  </div>
                  <div
                    className="profile_modal_wrap between"
                    onClick={() => {
                      setIsProfileModal(false);
                    }}
                  >
                    <Link
                      href={"/player-portal/casino-bonus"}
                      className="profile_modal_key"
                    >
                      Casino Bonus
                    </Link>
                    <div className="profile_modal_value"></div>
                  </div>
                  <div
                    className="profile_modal_wrap between"
                    onClick={() => {
                      setIsProfileModal(false);
                    }}
                  >
                    <Link
                      href={"/player-portal/withdrawals"}
                      className="profile_modal_key"
                    >
                      Withdrawals
                    </Link>
                  </div>
                  <div
                    className="profile_modal_wrap between"
                    onClick={() => {
                      setIsProfileModal(false);
                    }}
                  >
                    <Link
                      href={"/player-portal/personal"}
                      className="profile_modal_key"
                    >
                      My profile
                    </Link>
                    {/* <div className="profile_modal_value">
                          234 
                      </div> */}
                  </div>
                  <div
                    className="profile_modal_wrap between"
                    onClick={() => {
                      dispatch(logoutUser());
                      setIsProfileModal(false);
                    }}
                  >
                    <div className="profile_modal_key">Logout</div>
                    {/* <div className="profile_modal_value">
                          234 
                      </div> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="header_btn_wrap start">
                <Button
                  text="LOGIN"
                  className="header_log_btn"
                  onClick={() =>
                    dispatch(openModal({ component: "LoginModal" }))
                  }
                />
                <Button
                  text="REGISTER"
                  className="header_reg_btn"
                  onClick={() => route.push("/register")}
                />
              </div>
            )}
          </div>
        </Container>
      </div>
      <div className={`header_tab_wrap ${isSticky && "sticky"}`}>
        {/* <Container> */}
        <div className="header_tabs between">
          {betTabItems.map((item) => (
            <div key={item.title}>
              <a
                // href={`${item.link}`}
                onClick={() => {
                  openPage(item);
                  item.title === "Instant Deposit" &&
                    dispatch(openModal({ component: "DepositModal" }));
                  item.title === "Today" && dispatch(setFixtureTab("TODAY"));
                  item.title === "Live" && dispatch(setFixtureTab("LIVE NOW"));
                }}
                className="header_tabs_item center col"
                // activeClassName="active"
              >
                <div className="header_tabs_icon center">{item.icon}</div>
                <div className="header_tabs_text">{item.title}</div>
              </a>
            </div>
          ))}
        </div>
        {/* </Container> */}
      </div>
      {isSticky && <div style={{ height: "95px" }} />}
    </>
  );
};

export default Header;
