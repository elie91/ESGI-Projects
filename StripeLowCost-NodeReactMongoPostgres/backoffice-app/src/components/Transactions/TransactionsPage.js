import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import useTransactions from '../../hooks/useTransactions';
import {getFormatedDate} from "../../utils/utils";
import {searchTransactions} from "../../context/actions/transactions.actions";
import useUser from "../../hooks/useUser";
import useMerchants from "../../hooks/useMerchants";

const TransactionsPages = () => {

    const {selectors: transactionsSelectors} = useTransactions();
    const {selectors: userSelectors, actions: userActions} = useUser();
    const {selectors: merchantsSelectors} = useMerchants();
    const transactions = transactionsSelectors.getTransactions();
    const [displayedTransactions, setDisplayedTransactions] = useState([]);
    const [search, setSearch] = useState("")

    useEffect(() => {
        setDisplayedTransactions(transactions)
 /*       if (!userSelectors.getSelectedMerchant()) {
            if (userSelectors.getUser().role === "MERCHANT") {
                userActions.setSelectedMerchant(userSelectors.getUser().merchants[0])
            } else {
                userActions.setSelectedMerchant(merchantsSelectors.getMerchants()[0])
            }
        }*/
    }, [transactions]);

    const handleChange = event => {
        const search = event.target.value;
        setSearch(search);
        if (search.length === 0) {
            setDisplayedTransactions(transactions)
        }
        if (search.length < 2) return;
        searchTransactions(search, userSelectors.getUser().token, userSelectors.getSelectedMerchant().id)
            .then(data => setDisplayedTransactions(data))
    }

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">Transactions
                marchand {userSelectors.getSelectedMerchant() && userSelectors.getSelectedMerchant().name}</h1>

            <div className="input-group my-4">
                <input type="text" onChange={handleChange} className="form-control"
                       placeholder="Rechercher une transaction"
                       aria-label="Search"
                       aria-describedby="basic-addon2"/>
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                        <i className="fa fa-search fa-sm"/>
                    </button>
                </div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Liste des transactions</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        {displayedTransactions.length > 0 &&
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Devise</th>
                                <th>Utilisateur</th>
                                <th>Etat</th>
                                <th align="right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedTransactions.map((transaction, index) => {
                                return <tr key={index}>
                                    <td>{(transaction.id || transaction._id)}</td>
                                    <td>{getFormatedDate(transaction.createdAt)}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.currency}</td>
                                    <td> {transaction.client_firstname} {transaction.client_lastname}</td>
                                    <td> {
                                        ((transaction.transactionStatus && transaction.transactionStatus.find(status => status.name === "PAID")) || transaction._id) ?
                                          <button className="btn btn-success btn-circle">
                                              <i className="fas fa-check"/>
                                          </button> :
                                          <button className="btn btn-warning btn-circle">
                                              <i className="fas fa-exclamation-triangle"/>
                                          </button>
                                    }</td>
                                    <td align="right">
                                        <Link to={`/transactions/${transaction.id}`}
                                              className="btn btn-info btn-icon-split">
                                                <span className="icon text-white-50">
                                                    <i className="fas fa-info-circle"/>
                                                </span>
                                            <span className="text">Détails</span>
                                        </Link>
                                    </td>
                                </tr>
                            })}
                            </tbody>
                        </table>
                        }
                        {displayedTransactions.length === 0  && <p className="mb-0 text-center">{search.length > 2 ? "Aucune transaction trouvée" : "Vous n'avez pas encore de transactions"}</p>}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default TransactionsPages;
