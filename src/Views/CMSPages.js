import React, {useEffect} from "react";
import useSWR from "swr/esm/use-swr";
import {goBack} from "../Utils/helpers";
import Layout from "./Layout";

export default function CMSPages({match, history}) {
    const slug = match.params.slug;

    const {data, error} = useSWR(`/utilities/cms/page/${slug}`);

    useEffect(() => {
        if (data){
            const ele = document.querySelector('[data-f-id="pbf"]');
            console.log(ele);
            if (ele) {
                ele.style.display = 'none';
            }
        }
    }, [data])
    return (
        <Layout
            footer={false}
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="container">
                <div className="page-content" style={{background: '#fff', padding: '10px', color: '#000'}}>
                    <h2>{data?.title}</h2>
                    <br/>
                    <div  dangerouslySetInnerHTML={{ __html: data?.body}} />
                </div>
            </div>
        </Layout>
    )
}
