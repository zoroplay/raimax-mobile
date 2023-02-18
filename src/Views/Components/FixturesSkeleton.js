import React, {Fragment} from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

export default function FixturesSkeleton() {
    const n = 5;

    return (
        <Fragment>
            <SkeletonTheme color="#a2a4a6" highlightColor="#27292f">

            <div className="match-info table-f">
                <div className="match-info--title"><Skeleton width={'30'} /></div>
                <div className="match-odds">
                    <div className="table-f">
                        <div className="match-odds--value"><Skeleton width="10" style={{marginLeft: '5px'}}/></div>
                        <div className="match-odds--value"><Skeleton width={'10'} style={{marginLeft: '10px'}}/></div>
                        <div className="match-odds--value"><Skeleton width={'10'} style={{marginLeft: '10px'}}/></div>
                    </div>
                </div>
            </div>
            {[...Array(n)].map((ele, index) =>
                <div key={index} className={`match-content`}>
                    <div className="table-f">
                        <div className="match-content__row--league">
                            <Skeleton style={{width: '50%'}}/>
                        </div>
                    </div>
                    <div className={`table-a`}>
                        <div className="match-content__info">
                            <div className="match-content__row table-f">
                                <div>
                                    <div className="table-f">
                                        <div className="match-content__row--team"><Skeleton style={{width: '50%'}} /></div>
                                    </div>
                                    <div className="table-f">
                                        <div className="match-content__row--team"><Skeleton style={{width: '50%'}} /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="match-content__row table-f">
                                <div className="match-content__row--info">
                                    <span><span><Skeleton style={{width: '10%'}} /></span> ● <Skeleton style={{width: '5%'}} />&nbsp;<Skeleton style={{width: '20%'}} /></span>
                                </div>
                            </div>
                        </div>
                        <div className="bets">
                            <div className="bets__row table-f">
                                <Skeleton style={{ height: '48px', marginLeft: '5px'}} />
                                <Skeleton style={{ height: '48px', marginLeft: '5px'}} />
                                <Skeleton style={{ height: '48px', marginLeft: '5px'}} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </SkeletonTheme>
        </Fragment>
    );
}
