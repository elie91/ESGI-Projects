import React, {useEffect, useState} from "react";
import CardMenu from "../CardMenu/CardMenu";
import useUser from "../../hooks/useUser";
import useTransactions from "../../hooks/useTransactions";
import useMerchants from "../../hooks/useMerchants";
import BarChart from "../Charts/BarChart";
import {groupTransactionsByDate, getAmountByDate} from "../../context/actions/transactions.actions";

const HomePage = () => {

    const {selectors: userSelectors} = useUser();
    const {selectors: transactionsSelectors} = useTransactions();
    const {selectors: merchantsSelectors} = useMerchants();
    const selectedMerchant = userSelectors.getSelectedMerchant();

    const [graphData, setGraphData] = useState({
        "headers" : [],
        "value" : []
    });

    const [graphAmount, setGraphAmount] = useState({
        "headers" : [],
        "value" : []
    });

    useEffect(() => {
        if(!userSelectors.getUser()) return;
        groupTransactionsByDate(userSelectors.getUser(), userSelectors.getSelectedMerchant())
            .then(data => {
                data.sort((prev, next) => {
                    return new Date(prev._id) - new Date(next._id);
                });
                const headers = [];
                const value = [];
                data.forEach(transaction => {
                    headers.push(transaction._id);
                    value.push(transaction.transactionsCount)
                });
                setGraphData({headers: headers, value: value})
            });

        getAmountByDate(userSelectors.getUser().token, userSelectors.getSelectedMerchant())
            .then(data => {
                data.sort((prev, next) => {
                    return new Date(prev._id) - new Date(next._id);
                });
                const headers = [];
                const value = [];
                data.forEach(transaction => {
                    headers.push(transaction._id);
                    value.push(transaction.amount)
                });
                setGraphAmount({headers: headers, value: value})
            })

    }, [selectedMerchant])

    return (
        <>
            <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>

            {!userSelectors.getIsMerchantUserApproved() && <div className="alert bg-gradient-warning text-white">
                Votre compte est en attente de validation. Vous avez accès à un nombre restreint de fonctionnalités
            </div>}

            <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardMenu title="Nombre transactions" borderColor="primary" value={transactionsSelectors.getCountTransactions()}
                              iconClassName="fas fa-calendar "/>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardMenu title="Montant total de transaction" borderColor="primary" value={transactionsSelectors.getTransactionsTotal()} iconClassName="fas fa-comments"/>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardMenu title="Montant total de transaction payées" borderColor="success" value={transactionsSelectors.getPaidTransactionsTotal()}
                              iconClassName="fas fa-dollar-sign"/>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <CardMenu title="Nombre de marchants" value={merchantsSelectors.getMerchantsCount()} borderColor="primary"
                              iconClassName="fas fa-clipboard-list"/>
                </div>
            </div>

            {transactionsSelectors.getTransactions().length > 0 && <div className="row">
                <div className="col-xl-6 col-lg-6">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Transactions par date</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area">
                                <BarChart data={graphData}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Montant des transactions par date</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area">
                                <BarChart data={graphAmount}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default HomePage;
