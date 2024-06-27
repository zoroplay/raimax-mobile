"use client";
import React from "react";
import "./BreadCrumb.scss";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface BreadCrumbProp {
  title: string;
}

const BreadCrumb = ({ title }: BreadCrumbProp) => {
  const router = useRouter();
  return (
    <div className="bread center">
      <div className="bread_icon center" onClick={() => router.back()}>
        <IoChevronBackOutline />
      </div>
      <div className="bread_title center">{title?.replace("-", " ")}</div>
    </div>
  );
};

export default BreadCrumb;
