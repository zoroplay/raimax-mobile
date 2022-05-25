import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import QuickLinks from "./Components/QuickLinks";
import CarouselComponent from "./Components/Carousel";
import NavTabMenu from "./Components/NavTabMenu";
import {useDispatch, useSelector} from "react-redux";


export default function Home() {
    const sportsData = useSelector((state) => state.sportsData);

    const dispatch = useDispatch();

    return (
        <Layout isHome={true}>
            <QuickLinks />
            <CarouselComponent />
            <NavTabMenu sportsData={sportsData} dispatch={dispatch} />
        </Layout>
    );
}
