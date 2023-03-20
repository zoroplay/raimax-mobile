import React from "react";
import useSWR from "swr/esm/use-swr";
import {Carousel} from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.css'

export default function CarouselComponent() {
    const {data: sliders} = useSWR(`sports/mobile/sliders?banner_type=web`);

    return (
        <div className="carousel" style={{backgroundColor: '#000'}} >
            <div className="carousel__container">
                <Carousel
                    autoPlay={true}
                    infiniteLoop={true}
                    showStatus={false}
                    showThumbs={false}
                    showArrows={false}
                    showIndicators={false} className="carousel__items">

                    {sliders && sliders.map(slider =>
                        <div 
                            className="carousel__item"
                            style={{width: '100%', height: '75px'}}
                            key={slider.id}>
                            <img src={slider.image_path} alt="Euro List" className="carousel-image" />
                            <div className="carousel__item-info">
                                <div className="table-cell">
                                    <div className="mt15"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </Carousel>
            </div>
        </div>
    )
}
