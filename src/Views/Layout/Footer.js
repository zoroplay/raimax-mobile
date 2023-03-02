import React  from "reactn";
import {NavLink} from "react-router-dom";

export default function Footer({bottom}) {
  /**
   * state
   */

  return (
      <footer>
          <div className={`f-s ${bottom ? '' : 'pb0'} `}>
              <nav className="f-s__nav-menu">
                  <div className="f-s__heading">
                      <div className="f-s__nav-menu--logo" />
                      <div className="f-s__back-top"><span className="f-s__back-top--img" /></div>
                  </div>
                  <div className="f-s__ql">
                      <div className="f-s__ql-item">
                          <a className="f-s__ql-link" href={process.env.REACT_APP_WEBSITE}
                                   id="footer_link_responsible_gambling"
                                   title="Responsible Gambling">Desktop Site
                          </a>
                      </div>
                      <div className="f-s__ql-item">
                          <NavLink className="f-s__ql-link" to="/pages/betting-rules"
                             id="footer_link_responsible_gambling"
                             title="Responsible Gambling">Betting Rules
                          </NavLink>
                      </div>
                      <div className="f-s__ql-item">
                          <NavLink
                              className="f-s__ql-link"
                              to="/pages/contact-us"
                              id="footer_link_contact"
                              title="Contact Us">
                              Contact Us
                          </NavLink>
                      </div>
                      <div className="f-s__ql-item">
                          <NavLink className="f-s__ql-link" to="/pages/faq" id="footer_link_help" title="Help">FAQ</NavLink>
                      </div>
                      <div className="f-s__ql-item">
                          <NavLink
                              className="f-s__ql-link"
                              to="/pages/terms-conditions"
                             id="footer_link_t_and_c"
                              title="T&amp;C's">
                              T&amp;C's
                          </NavLink>
                      </div>
                  </div>
                  <div className="f-s__payments"></div>
                  <div className="f-s__sponsors">
                      <p className="f-s__sponsors-text">Sport Betting, Premier League Odds,
                      Casino, Bet</p>
                  </div>
              </nav>
              <div className="f-s__copyright">
                  <div className="f-s__copyright-item"><span>© {process.env.REACT_APP_NAME} all rights reserved</span></div>
                  <div className="f-s__copyright-item txt-r"><span className="icon-eighteen ml5"></span></div>
              </div>
          </div>
      </footer>
  );
}
