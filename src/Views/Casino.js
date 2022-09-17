import React from 'react';
import Layout from "./Layout";
import {useSelector} from "react-redux";
import {goBack} from "../Utils/helpers";

export default function Casino({history}) {
    const {user} = useSelector((state) => state.auth);

    return (
        <Layout
            footer={false}
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <iframe title="casino" style={{ width: '100%', border: 0, height: '100vh'}} src={`https://ui.io.co.ke/?cid=1&token=${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`} />
        </Layout>
    )
}
