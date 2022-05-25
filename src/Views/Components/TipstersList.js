import React, {useEffect, useState} from "react";
import { formatTipsterName} from "../../Utils/helpers";
import {getTipsters} from "../../Services/apis";
import Skeleton from 'react-loading-skeleton';
import {useHistory} from "react-router";

export default function TipstersList(){
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState([]);
    const n = 10;
    const history = useHistory();

    const find = () => {
        setLoading(true);
        getTipsters().then(res => {
            setLoading(false);
            setResults(res.data);
        }).catch(err => {
            setLoading(false);
        });
    }

    useEffect(() => {
        find();
    }, []);

    const goTo = id => history.push('/tipster/bets/' + id);

    return (
        <table className="sr-livetable__table">
            <tbody>
            <tr className="sr-livetable__tableRow  srm-firstRow srm-is-uppercase">
                <td className="sr-livetable__tableCell srm-space" />
                <td className="sr-livetable__tableCell srm-pos ">Pos</td>
                <td title="" className="sr-livetable__tableCell srm-borderLeft srm-semibold srm-team srm-alignLeft ">
                    <div className="">Player</div>
                </td>
                <td title="Matches played" className="sr-livetable__tableCell srm-w30 ">
                    <div className="">P</div>
                </td>
                <td title="win" className="sr-livetable__tableCell srm-w50 srm-borderLeft ">
                    <div className="">W</div>
                </td>
                <td title="Draw" className="sr-livetable__tableCell srm-w50 ">
                    <div className="">L</div>
                </td>
                <td title="loss" className="sr-livetable__tableCell srm-w50 ">
                    <div className="">OT</div>
                </td>
                <td className="sr-livetable__tableCell srm-space" />
            </tr>
            {loading ?
                [...Array(n)].map((ele, index) =>
                <tr key={index} className="sr-livetable__tableRow  srm-dataRow">
                    <td className="sr-livetable__tableCell srm-space" />
                    <td className="sr-livetable__tableCell srm-pos "><Skeleton animated /></td>
                    <td title="" className="sr-livetable__tableCell srm-borderLeft srm-semibold srm-team srm-alignLeft ">
                        <div className="">
                            <div className="sr-livetable__tableTeam" title="Serbia">
                                <div className="sr-livetable__tableTeamName"><Skeleton animated /></div>
                            </div>
                        </div>
                    </td>
                    <td title="Matches played" className="sr-livetable__tableCell srm-w30 ">
                        <div className=""><Skeleton animated /></div>
                    </td>
                    <td title="win" className="sr-livetable__tableCell srm-w50 srm-borderLeft ">
                        <div className=""><Skeleton animated /></div>
                    </td>
                    <td title="Draw" className="sr-livetable__tableCell srm-w50 ">
                        <div className=""><Skeleton animated /></div>
                    </td>
                    <td title="loss" className="sr-livetable__tableCell srm-w50 ">
                        <div className=""><Skeleton animated /></div>
                    </td>
                    <td className="sr-livetable__tableCell srm-space" />
                </tr>)
            :
                results.length > 0 ?
                    results.map((tipster, index) =>
                        (tipster.ongoing !== "0" &&
                        <tr key={tipster.id} className="sr-livetable__tableRow  srm-dataRow" onClick={() => goTo(tipster.user?.id)}>
                            <td className="sr-livetable__tableCell srm-space" />
                            <td className="sr-livetable__tableCell srm-pos ">{index + 1}</td>
                            <td title="" className="sr-livetable__tableCell srm-borderLeft srm-semibold srm-team srm-alignLeft ">
                                <div className="">
                                    <div className="sr-livetable__tableTeam" title="Serbia">
                                        <div className="sr-livetable__tableTeamName">{(tipster.user) ? formatTipsterName(tipster.user.username) : ' - '}</div>
                                    </div>
                                </div>
                            </td>
                            <td title="Matches played" className="sr-livetable__tableCell srm-w30 ">
                                <div className="">{tipster.played}</div>
                            </td>
                            <td title="win" className="sr-livetable__tableCell srm-w50 srm-borderLeft ">
                                <div className="">{tipster.won}</div>
                            </td>
                            <td title="Draw" className="sr-livetable__tableCell srm-w50 ">
                                <div className="">{tipster.lost}</div>
                            </td>
                            <td title="loss" className="sr-livetable__tableCell srm-w50 ">
                                <div className="">{tipster.ongoing}</div>
                            </td>
                            <td className="sr-livetable__tableCell srm-space" />
                        </tr>)
                    ):
                    <tr>
                        <td colSpan={8} className="sr-livetable__tableCell srm-space">No result found</td>
                    </tr>
            }
            </tbody>
        </table>
    );
}
