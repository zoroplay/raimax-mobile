import React, {useState, Fragment, useLayoutEffect, useEffect} from "react";
import * as _ from 'lodash';
import {toggleAccordion} from "../../Utils/helpers";

export default function Markets({ groups, markets, activeMarket, setActiveMarket }) {
    const [marketGroups, setMarketGroups ] = useState([]);
    const [activeGroup, setActiveGroup] = useState({});

    const toggleMarkets = () => {
        const market = document.getElementById("markets_toggle_accordion_btn");
        const parent = market.parentElement.parentElement;
        parent.classList.toggle("open");
        // get the next element which is accordion content
        const content = document.getElementById('markets-wrapper')
        content.classList.toggle('open')

        if (parent.classList.contains('open')) {
            document.getElementById('markets_toggle_accordion_state').innerText = 'Close';
        } else {
            document.getElementById('markets_toggle_accordion_state').innerText = 'Change Market';
        }
    }

    useLayoutEffect(() => {
        const info = document.getElementById("markets_toggle_accordion_icon");

            info.addEventListener("click", function () {
                /* Toggle between hiding and showing the active panel */
                const parent = this.parentElement.parentElement;
                parent.classList.toggle("info-open");
            });

        return () => {

        }
    }, []);

    useEffect(() => {
        if (groups) {
            groups.map(group => {
                return group.markets = markets.filter(market => market.group_id === group.id);
            })
            setActiveGroup(groups[0]);
            setMarketGroups(groups);
        }
    }, [groups, markets]);

    const closeMarket = (market, id) => {
        setActiveGroup(groups.find(group => group.id === market.group_id));

        const ele = document.getElementById(id);
        /* Toggle between hiding and showing the active panel */
        const parent = ele.parentElement;
        parent.classList.toggle("open");
        // get the next element which is accordion content
        const content = ele.nextElementSibling;
        content.classList.toggle('open');

        toggleMarkets();
    }

    return (
        <Fragment>
            <div className="accordion-item new-markets">
                <div className="accordion-toggle" id="markets_label-toggle">
                    <div className="accordion-toggle__icon" id="markets_toggle_accordion_icon">
                        <i className="icon info"/>
                    </div>
                    <div className="accordion-toggle__btn markets-toggle" id="markets_toggle_accordion_btn" onClick={toggleMarkets}>{activeGroup?.name} Markets</div>
                    <div className="accordion-toggle__state markets-toggle" id="markets_toggle_accordion_state" onClick={toggleMarkets}>Change Market</div>
                </div>
                <div className="markets__info p15">
                    <span>{activeMarket?.name}</span>
                    <p className="markets__info-text mt5">{activeMarket?.info}</p>
                </div>
                <div className="accordion-content" id="markets-wrapper" style={{display: 'block' }}>
                    <div className="accordion-inner">
                        {marketGroups?.map(group =>
                        <div className={`accordion-box ${activeGroup.id === group.id ? 'open' : ''}`} key={`market-group-${group.id}`} style={{display: 'block' }}>
                            <div className="accordion-toggle collapsible" id={`${group.name}_groupMarket_label-toggle`} onClick={toggleAccordion}>
                                <a className="accordion-toggle--item" href="javascript:;">
                                    <p>{group.name} Markets</p>
                                </a>
                            </div>
                            <div className={`accordion-content ${activeGroup.id === group.id ? 'open' : ''}`} style={{display: 'block' }}>
                                <div className="accordion-inner">
                                    {group.markets.length > 3 ? (
                                        _.chunk(group.markets, 3).map((row, i) =>
                                        <div className="markets__row table-f" key={`market_row-${i}`}>
                                            {row.map(market => (
                                                market.name !== 'M A I N' &&
                                                <div
                                                    onClick={() => {setActiveMarket(market); closeMarket(market, `${group.name}_groupMarket_label-toggle`) }}
                                                    className={`markets__row-item txt-c py15 ${activeMarket?.id === market.id ? 'active' : ''}`}
                                                    key={`market__row-item-${market.name}`}>
                                                    {market.name}
                                                </div>
                                            ))}
                                            {row.length === 1 && <>
                                                <div className="markets__row-item txt-c py15"/>
                                                <div className="markets__row-item txt-c py15"/>
                                            </>}
                                            {row.length === 2 && <div className="markets__row-item txt-c py15"/>}
                                        </div>
                                        )):(
                                        <div className="markets__row table-f">
                                            {group.markets.map(market => (
                                                market.name !== 'M A I N' &&
                                                <div
                                                    onClick={() => {setActiveMarket(market); closeMarket(market,`${group.name}_groupMarket_label-toggle`)}}
                                                    className={`markets__row-item txt-c py15 ${activeMarket?.id === market.id ? 'active' : ''}`}
                                                    key={`market__row-item-${market.name}`}>
                                                    {market.name}
                                                </div>
                                            ))}
                                            {group.markets.length === 1 && <>
                                                <div className="markets__row-item txt-c py15"/>
                                                <div className="markets__row-item txt-c py15"/>
                                            </>}
                                            {group.markets.length === 2 && <div className="markets__row-item txt-c py15"/>}

                                        </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                {markets &&
                <div className="filter">
                    {markets?.map(market => (
                        market.group_id === activeMarket?.market_group_id && market.name !== 'M A I N' &&
                        (<div id="markets_filter_S_1X2"
                              key={`markets_filter_S_${market.name}`}
                              onClick={() => setActiveMarket(market)}
                              className={`filter--btn ${activeMarket?.id === market.id ? 'active' : ''}`}>
                            <p>{market.name}</p>
                        </div>)
                    ))}
                </div>}
            </div>
        </Fragment>
    )
}
