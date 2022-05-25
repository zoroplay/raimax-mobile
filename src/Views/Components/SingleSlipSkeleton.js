import React from "react";
import Skeleton from 'react-loading-skeleton';

export function SingleSlipSkeleton() {

    return (
        <div className="betslip-holder">
            <div className="betslip placed">
                <div className="betslip__heading wrap">
                    <div className="pull-left placed--text"><Skeleton animated width={'70'} /></div>
                </div>
                <hr className="gray" />
                <div className="betslip__content">
                    <div className="betslip__selection-details">
                        <div>
                            <div className="table-f">
                                <div>
                                    <div className="ellipsis">
                                        <Skeleton animated />
                                    </div>
                                </div>
                                <div className="betslip__odd-holder txt-r"><span><Skeleton animated width={'50'} /></span></div>
                            </div>
                            <div className="table-f mt5">

                                <div><span><Skeleton animated width={'50'} /></span></div>

                                <div className="txt-r"><Skeleton animated width={'50'} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
