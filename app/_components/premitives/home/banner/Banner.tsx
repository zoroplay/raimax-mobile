"use client";
import "./Banner.scss";
import Slider from "react-slick";
import Image from "next/image";
import { welcome, drk, bgone, bgtwo } from "@/_assets";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetSlidesQuery } from "@/_services/sport.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Banner = () => {
  const settings = {
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { data } = useGetSlidesQuery("");

  const router = useRouter();
  // console.log(data, "slides")

  return (
    <div className="banner">
      <Slider {...settings} className="slide_container">
        {data &&
          data?.map((item: any, idx: number) => (
            <div
              className="slide"
              key={idx}
              onClick={() => {
                item?.link && router.push(item?.link);
                console.log(item, idx);
              }}
            >
              <Image
                src={item?.image_path}
                alt="bg"
                fill
                sizes="100vw"
                className="banner_image"
              />
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default Banner;
