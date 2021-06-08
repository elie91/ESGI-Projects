import {useContext, useMemo} from "react";
import RootContext from "../context/RootContext";
import {fetchTransactions, fetchTransactionsByMerchant} from "../context/actions/transactions.actions";

const useTransactions = () => {
    const {state: {transactions: transactionsState}, dispatch} = useContext(RootContext);

    const actions = {
        fetchTransactions: function (token) {
            return new Promise((resolve, reject) => {
                fetchTransactions(token)
                    .then(transactions => {
                        resolve(dispatch({
                            type: "FETCH_TRANSACTIONS_SUCCESS",
                            payload: transactions,
                        }));
                    })
                    .catch(err => {
                        reject(dispatch({
                            type: "FETCH_TRANSACTIONS_ERROR",
                            payload: err,
                        }));
                    });
            });
        },
        fetchTransactionsByMerchant: function (id, token) {
            return new Promise((resolve, reject) => {
                fetchTransactionsByMerchant(id, token)
                    .then(transactions => {
                        resolve(dispatch({
                            type: "FETCH_TRANSACTIONS_SUCCESS",
                            payload: transactions,
                        }));
                    })
                    .catch(err => {
                        reject(dispatch({
                            type: "FETCH_TRANSACTIONS_ERROR",
                            payload: err,
                        }));
                    });
            })
        }
    };

    const getPaidTransactionsTotal = useMemo(() => {
        return transactionsState.transactions.reduce((acc, transaction) => {
            if(transaction.transactionStatus[0].name === "PAID") {
                return acc + transaction.amount
            }
            return acc
        }, 0);
    }, [transactionsState.transactions]);


    const selectors = {
        getTransactions: () => transactionsState.transactions,
        getCountTransactions: () => transactionsState.transactions.length,
        getPaidTransactionsTotal: () => getPaidTransactionsTotal,
        getTransactionsTotal: () => transactionsState.transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
    };

    return {selectors, actions};
};

export default useTransactions;
