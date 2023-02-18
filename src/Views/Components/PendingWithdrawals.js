import React from "react";
import {formatDate, formatNumber} from "../../Utils/helpers";


export default function PendingWithdrawals({data}) {

    const toggleDetails = (id) => {
        const ele = document.getElementById(id)
        ele.parentElement.classList.toggle('opened');
    }

    return (
        <div className="page__body">
            <div className="accordion bg-white account">
                <div className="accordion__item heading">
                    <div className="accordion__header">
                        <div className="accordion__cnt">
                            <div className="accordion__cnt-item">
                                <strong>Date / Time</strong>
                            </div>
                            <div className="accordion__cnt-item pl10">
                                <strong>Account</strong>
                            </div>
                            <div className="accordion__cnt-item txt-r">
                                <strong>Amount</strong>
                            </div>
                        </div>
                    </div>
                </div>
                {data?.withdrawals.length > 0 && data?.withdrawals.map(transaction =>
                    <div className="accordion__item item" key={`transaction-${transaction.id}`}>
                        <div className="accordion__header collapsible" id={`transaction-${transaction.id}`} onClick={() => toggleDetails(`transaction-${transaction.id}`)}>
                            <div className="accordion-toggle"/>
                            <div className="accordion__cnt">
                                <div className="accordion__cnt-item">{formatDate(transaction.created_at, 'DD/MM/YYYY HH:mm:ss')}</div>
                                <div className="accordion__cnt-item">{transaction.account_number}</div>
                                <div className="accordion__cnt-item txt-r">
                                    <strong>{formatNumber(transaction.amount)}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="accordion__body indent">
                            <div className="accordion__content">
                                <div className="steps bg-white">
                                    <div className="steps__row">
                                        <div className="steps__item">Bank</div>
                                        <div className="steps__item">{transaction.bank.name}</div>
                                    </div>
                                    <div className="steps__row">
                                        <div className="steps__item">Account #:</div>
                                        <div className="steps__item">{transaction.account_number}</div>
                                    </div>
                                    <div className="steps__row">
                                        <div className="steps__item">Account Name:</div>
                                        <div className="steps__item">{transaction.account_holder}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}
                {data?.withdrawals.length === 0 && <div className="callout " id="error-message">

                    <strong>No pending withdrawals</strong>

                </div>}
            </div>
        </div>
    )
}

