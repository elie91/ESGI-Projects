import React, {useState, useEffect} from "react";
import useUser from "../../hooks/useUser";
import {fetchTransactionById} from "../../context/actions/transactions.actions";
import Spinner from "../Spinner/spinner";
import {getConstantIcon, getConstantStatus, getFormatedDate} from "../../utils/utils";


const TransactionsDetails = ({match, history}) => {

    const {selectors: userSelectors} = useUser();
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        fetchTransactionById(userSelectors.getUser().token, match.params.id)
            .then(data => setTransaction(data))
            .catch(() => history.push('/transactions'))
    }, []);


    if (!transaction) {
        return <Spinner/>
    } else {
        return (
            <div className="container">
                <div className="card shadow mb-2">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Paiement {transaction.id}</h6>
                    </div>
                    <div className="card-body">
                        <span className="text-dark font-weight-bold">{transaction.amount} {transaction.currency}</span>
                        <div className="row mt-2">
                            <div className="col-md-2 border-right">
                                <span className="font-weight-bold">Date</span> <br/>
                                {getFormatedDate(transaction.createdAt)}
                            </div>
                            <div className="col-md-5 pl-5">
                                <span className="font-weight-bold">Client</span><br/>
                                {transaction.client_firstname} {transaction.client_lastname} <br/>
                                {transaction.billing_address} {transaction.billing_postal_code} {transaction.billing_city}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card shadow mb-2">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Chronologie</h6>
                    </div>
                    <div className="card-body">
                        {transaction.transactionStatus.map((status, index) => {
                            return <div key={index} className="row my-2 border-bottom p-2">
                                <div className="col-md-6 d-flex align-items-baseline">
                                    <i className={`fas ${getConstantIcon(status.name)} pr-4`}/>
                                    <div>
                                        <span className="font-weight-bold">{getConstantStatus(status.name)}</span> <br/>
                                        {getFormatedDate(status.createdAt)}
                                    </div>
                                </div>
                            </div>
                        })}

                    </div>
                </div>

                <div className="card shadow mb-2">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Moyen de paiement</h6>
                    </div>
                    <div className="card-body">
                        {transaction.payment_method && <div className="row">
                            <div className="col-md-4">
                                <div className="d-flex">
                                    <span className="font-weight-bold flex-grow-1">Numéro: </span>
                                    <span>{transaction.payment_method.card}</span>
                                </div>
                                <div className="d-flex">
                                    <span className="font-weight-bold flex-grow-1">CVC: </span>
                                    <span>{transaction.payment_method.cvc}</span>
                                </div>
                                <div className="d-flex">
                                    <span className="font-weight-bold flex-grow-1">Date: </span>
                                    <span>{transaction.payment_method.date}</span>
                                </div>
                                <div className="d-flex">
                                    <span className="font-weight-bold flex-grow-1">Propriétaire: </span>
                                    <span>{transaction.payment_method.fullname}</span>
                                </div>
                            </div>
                        </div>}

                    </div>
                </div>

                <div className="card shadow mb-2">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Produits</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="table-responsive">
                                <table className="table table-bordered" width="100%" cellSpacing="0">
                                    <thead>
                                    <tr>
                                        <th>Libellé</th>
                                        <th>Prix</th>
                                        <th>Quantité</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {transaction.products.map((product, index) => {
                                        return <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.quantity}</td>
                                        </tr>
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default TransactionsDetails;