import React, {useEffect} from "react";
import {NavLink} from "react-router-dom";
import {slugify, toggleMenu, toggleAccordion} from "../../Utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {getSportMenu} from "../../Services/apis";
import {setActivePeriod, setSports} from "../../Redux/actions";
import {periods} from "../../Utils/constants";

export default function Menu() {
    const dispatch = useDispatch();
    const {activePeriod, sports} = useSelector((state) => state.sportsData);
    const {virtualURL} = useSelector((state) => state.auth);

    const getSports = async () => {
        await getSportMenu(activePeriod).then(res => {
            dispatch(setSports(res.menu));
        });
    }

    useEffect( () => {
        getSports();
    }, [activePeriod]);

    return (
        <nav className="pml">
            <div className="pml__top-nav">
                <div className="pml-header">
                    <div className="pml-header__item" id="pushmenu_control_back_to_home" onClick={toggleMenu}>
                        <div className="icon back mr10" />
                        <span>Back home</span>
                    </div>
                    <div className="pml-header__icon close" id="pushmenu_control_close" onClick={toggleMenu}></div>
                </div>
            </div>
            <div className="scrollable-area">
                <div className="headline-bar">
                    <div className="headline-bar--txt">QUICKLINKS</div>
                </div>
                <div className="icons">
                    <div className="icons__row" style={{height: 'auto'}}>
                        <NavLink to={`/sport/soccer/1`} onClick={() => toggleMenu()} className="icons__item" id="pushmenu_link_icon_1549_league">
                            <div className="icons__item--img"
    style={{backgroundImage: 'url("https://cnt.bet9ja.com/img/promos/sportsbook/mobile-popular/soccer--featured.svg")'}}/>
                            <div className="icons__item--title">Soccer</div>
                        </NavLink>
                        <NavLink to="/jackpot" className="icons__item" onClick={() => toggleMenu()} id="pushmenu_link_icon_381894_today">
                            <div className="icons__item--img"
                                 style={{backgroundImage: ' url(/img/jackpot--featured.svg)'}}/>
                            <div className="icons__item--title">Jackpot</div>
                        </NavLink>
                        <NavLink to="/coupon-check" onClick={() => toggleMenu()} className="icons__item" id="pushmenu_link_icon_1570_check_a_bet">
                            <div className="icons__item--img"
                                 style={{backgroundImage: ' url("https://cnt.bet9ja.com/img/promos/quicklinks/checkcoupon.svg")'}}/>
                            <div className="icons__item--title">Check a Bet</div>
                        </NavLink>
                        <NavLink to="/book-a-bet" onClick={() => toggleMenu()} className="icons__item" id="pushmenu_link_icon_1544_book_a_bet">
                            <div className="icons__item--img"
                                 style={{backgroundImage: ' url("https://cnt.bet9ja.com/img/promos/quicklinks/bookabet.svg")'}}/>
                            <div className="icons__item--title">Book a Bet</div>
                        </NavLink>
                    </div>
                </div>
                <div className="heading__search">
                    <div className="heading__search-left">
                        <input type="text" maxLength="50" id="pushmenu_search_input" placeholder="Search" />
                    </div>
                    <div className="heading__search-right">
                        <span className="icon search" id="pushmenu_search_icon" />
                    </div>
                </div>
                <div className="pml-filter">
                    <div className="pml-filter__holder">
                        {periods.map(period => <div
                            key={period.value}
                            onClick={() => dispatch(setActivePeriod(period.value))}
                            className={`pml-filter__item ${activePeriod === period.value ? 'selected' : ''}`}>
                            {period.label}
                        </div> )}
                    </div>
                </div>
                <div className="accordion-menu">
                    <div className="accordion-box open">
                        <div className="accordion-toggle collapsible" id="pushmenu_sports_accordiontoggle"
                             onClick={(e) => toggleAccordion(e, "pushmenu_sports_accordiontoggle")}
                        >
                            <a className="accordion-toggle--item" href="javascript:;"
                                id="pushmenu_sports_accordiontoggle_link">
                                <p>Sports</p>
                            </a>
                        </div>
                        <div className="accordion-content open">
                            <div className="inner-content">
                                <ul className="access-links">
                                    {sports.map(sport =>
                                    <li className="access-links__element"
                                        onClick={() => toggleMenu()}
                                        id={`pushmenu_sports_element_${sport.sport_id}_${sport.sport_name}`}
                                        key={`pushmenu_sports_element_${sport.sport_id}_${sport.sport_name}`}
                                    >
                                        <NavLink
                                            className="access-links--item"
                                            to={`/sport/${slugify(sport.name)}/${sport.sport_id}`}
                                            id={`pushmenu_sports_link_${sport.sport_id}_${slugify(sport.name)}`}>
                                            <span className="link">{sport.name}</span>
                                        </NavLink>
                                    </li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-box">
                        <div className="accordion-toggle" id="pushmenu_live_betting_accordiontoggle">
                            <NavLink
                                className="accordion-toggle--item" to="/sport/livebetting"
                                id="pushmenu_live_betting_accordiontoggle_link"><p>Live Betting</p>
                            </NavLink>
                        </div>
                    </div>
                    {/*<div className="accordion-box">
                        <div className="accordion-toggle" id="pushmenu_casino_accordiontoggle"><a
                            className="accordion-toggle--item" href="javascript:;"
                            id="pushmenu_casino_accordiontoggle_link"><p>Casino</p></a></div>
                    </div>*/}
                    <div className="accordion-box">
                        <div
                            className="accordion-toggle collapsible"
                            id="pushmenu_virtuals_accordiontoggle"
                            onClick={(e) => toggleAccordion(e, "pushmenu_virtuals_accordiontoggle")}
                        >
                            <a className="accordion-toggle--item" href="javascript:;"
                            id="pushmenu_virtuals_accordiontoggle_link"><p>Virtuals</p></a></div>
                        <div className="accordion-content">
                            <div className="inner-content">
                                <ul className="access-links">
                                    {/*<li className="access-links__element"
                        id="pushmenu_quicklinks_element_1858_bet9ja_league"><a
                        className="access-links--item" href="javascript:;"
                        id="pushmenu_quicklinks_link_1858_bet9ja_league"><span className="link">Bet9ja League</span></a>
                    </li>
                    <li className="access-links__element"
                        id="pushmenu_quicklinks_element_1860_bet9ja_races"><a
                        className="access-links--item" href="javascript:;"
                        id="pushmenu_quicklinks_link_1860_bet9ja_races"><span className="link">Bet9ja Races</span></a>
                    </li>*/}
                                    <li className="access-links__element"
                                        onClick={() => toggleMenu()}
                                        id="pushmenu_quicklinks_element_1862_virtual_sports">
                                        <a className="access-links--item" href={virtualURL} id="pushmenu_quicklinks_link_1862_virtual_sports">
                                            <span className="link">GlobalBet</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-box">
                        <div className="accordion-toggle collapsible"
                             id="pushmenu_quick_links_accordiontoggle"
                             onClick={(e) => toggleAccordion(e, "pushmenu_quick_links_accordiontoggle")}
                        >
                            <a
                                className="accordion-toggle--item" href="javascript:;"
                                id="pushmenu_quick_links_accordiontoggle_link"><p>Quick Links</p></a></div>
                        <div className="accordion-content">
                                <ul className="access-links">

                                    {/*<li className="access-links__element" id="pushmenu_quicklinks_element_1873_statistics">
                      <a className="access-links--item" href="javascript:;" id="pushmenu_quicklinks_link_1873_statistics">
                        <span className="link">Statistics</span>
                      </a>
                    </li>*/}
                                    <li className="access-links__element" id="pushmenu_quicklinks_element_1874_odds_filter">
                                        <a className="access-links--item" href="javascript:;" id="pushmenu_quicklinks_link_1874_odds_filter">
                                            <span className="link">Odds Filter</span>
                                        </a>
                                    </li>
                                    <li className="access-links__element" id="pushmenu_quicklinks_element_1867_become_an_agent">
                                        <NavLink className="access-links--item" to="/BecomeAnAgent/Register"
                                                       id="pushmenu_quicklinks_link_1867_become_an_agent">
                                            <span className="link">Become an Agent</span>
                                        </NavLink>
                                    </li>
                                    <li className="access-links__element" id="pushmenu_quicklinks_element_1865_help">
                                        <NavLink className="access-links--item" to="/pages/how-to-play"
                                                       id="pushmenu_quicklinks_link_1865_help">
                                            <span className="link">Help</span>
                                        </NavLink>
                                    </li>
                                    <li className="access-links__element" id="pushmenu_quicklinks_element_1866_contact_us">
                                        <NavLink className="access-links--item" to="/pages/contact-us"
                                                       id="pushmenu_quicklinks_link_1866_contact_us">
                                            <span className="link">Contact Us</span>
                                        </NavLink>
                                    </li>

                                    {/*<li className="access-links__element" id="pushmenu_quicklinks_element_1868_web_affiliates">
                      <a className="access-links--item" href="javascript:;" id="pushmenu_quicklinks_link_1868_web_affiliates">
                        <span className="link">Web Affiliates</span>
                      </a>
                    </li>*/}
                                    <li className="access-links__element" id="pushmenu_quicklinks_element_1869_desktop_site">
                                        <a className="access-links--item" href="https://pitch90.spiracsports.com" id="pushmenu_quicklinks_link_1869_desktop_site">
                                            <span className="link">Desktop Site</span>
                                        </a>
                                    </li>
                                    {/*<li className="access-links__element" id="pushmenu_quicklinks_element_1893_t_c's">
                      <a className="access-links--item" href="javascript:;" id="pushmenu_quicklinks_link_1893_t_c's">
                        <span className="link">T&amp;C's</span>
                      </a>
                    </li>*/}
                                    {/*<li className="access-links__element" id="pushmenu_quicklinks_element_261892_general_bonus_t_c's">
                      <a className="access-links--item" href="javascript:;" id="pushmenu_quicklinks_link_261892_general_bonus_t_c's">
                        <span className="link">General Bonus T&amp;C's</span>
                      </a>
                    </li>*/}
                                </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
