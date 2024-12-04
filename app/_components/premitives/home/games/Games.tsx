"use client";
import React, { useEffect, useState } from "react";
import "./Games.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { bgone, bgtwo, jetx } from "@/_assets";
import { Button } from "@/_components";
import Link from "next/link";
import { useAppSelector } from "@/_hooks";
import MD5 from "crypto-js/md5";
import { useRouter } from "next/navigation";

const Games = () => {
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_SITE_KEY);
  const backurl = process.env.NEXT_PUBLIC_SITE_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;

  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  const settings = {
    arrows: false,
    autoplay: true,
    infinite: true,
    // fade: true,
    speed: 2000,
    slidesToShow: 2,
    slidesToScroll: 2,
    // cssEase: "linear",
  };
  useEffect(() => {
    if (user.token) {
      setMode(1);
      setGroup(user.user?.group);
      setToken(user.user?.auth_code);
    }
  }, [user]);

  useEffect(() => {
    const hashStr = MD5(
      `${token}10100${backurl}${mode}${group}mobile${privateKey}`
    ).toString();

    setHash(hashStr);
  }, [token]);

  const handleClick = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
    );
  };

  const allCasinos = () => {
    router.push("/casino/all");
  };

  return (
    <div className="games">
      <div className="games_slide">
        <div className="games_slide_head">Quick Play Games</div>
        <Slider
          {...settings}
          // centerMode={true}
          // centerPadding="10px"
          className="game_slide_con between"
        >
          <div className="slider" onClick={() => handleClick()}>
            <div className="slide_img_wrap">
              <Image fill src={bgone} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">VIRTUALS</div>
          </div>
          <Link
            href={"/game/play/live-casino/c27/aviator_spribe"}
            className="slider"
          >
            <div className="slide_img_wrap">
              <Image fill src={jetx} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">JetX</div>
          </Link>
          <div className="slider" onClick={() => handleClick()}>
            <div className="slide_img_wrap">
              <Image fill src={bgone} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">VIRTUALS</div>
          </div>
          <Link
            href={"/game/play/live-casino/c27/aviator_spribe"}
            className="slider"
          >
            <div className="slide_img_wrap">
              <Image fill src={jetx} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">JetX</div>
          </Link>
        </Slider>
        <Button
          text="MORE GAMES"
          className="slide_btn"
          onClick={() => allCasinos()}
        />
        
      </div>
    </div>
  );
};

export default Games;
