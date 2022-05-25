import React, {useEffect} from "react";
import {goBack} from "../Utils/helpers";
import Layout from "./Layout";
import {useSelector} from "react-redux";

export default function Virtual({history}) {
    const {virtualURL} = useSelector((state) => state.auth);

    useEffect(() => {
        window.location.href = virtualURL;
    }, []);

    return (
        <Layout
            footer={false}
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>

        </Layout>
    )
}
