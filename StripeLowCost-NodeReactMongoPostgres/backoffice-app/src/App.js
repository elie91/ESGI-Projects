import React, {useEffect, useState} from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Spinner from "./components/Spinner/spinner";
import useUser from "./hooks/useUser";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import {useHistory, useLocation} from "react-router-dom";
import useTransactions from "./hooks/useTransactions";
import LoginPage from "./components/Security/Login/Login";
import Register from "./components/Security/Register/Register";
import HomePage from "./components/HomePage/HomePage";
import TransactionsPage from "./components/Transactions/TransactionsPage";
import TransactionsDetails from "./components/Transactions/TransactionsDetails";
import MerchantList from "./components/Merchant/MerchantList";
import Profile from "./components/Profile/Profile";
import useMerchants from "./hooks/useMerchants";
import MerchantDetails from "./components/Merchant/MerchantDetails";

function App() {

    const history = useHistory();
    const location = useLocation();

    const [isFetching, setIsFetching] = useState(true);
    const {selectors: userSelectors, actions: userActions} = useUser();
    const {actions: transactionsActions} = useTransactions();
    const {actions: merchantsActions} = useMerchants();

    const user = userSelectors.getUser();
    const selectedMerchant = userSelectors.getSelectedMerchant();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user === null) return setIsFetching(false);
        userActions
            .rehydrate(user)
            .then(() => {
                setIsFetching(false)
                history.push(location.pathname)
            })

    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user === null) return;
        merchantsActions.fetchMerchants(user.token)
            .catch(err => {
                localStorage.clear();
                userActions.logout();
                history.push("/login")
            })
        selectedMerchant ? transactionsActions.fetchTransactionsByMerchant(selectedMerchant.id, user.token) : transactionsActions.fetchTransactions(user.token);

    }, [user, selectedMerchant]);


    if (isFetching) {
        return <Spinner/>;
    } else {
        return (
            <Switch>
                <ErrorBoundary>
                    <Route render={() => !user && <Redirect to='login'/>}/>
                    <div id="page-top">
                        <div id="wrapper">
                            {user && <Sidebar/>}
                            <div id="content-wrapper" className="d-flex flex-column">
                                <div id="content">
                                    {user && <Navbar/>}
                                    <div className="container-fluid">
                                        <Route exact path="/" render={() => <HomePage/>}/>
                                        <Route exact path="/profile" component={Profile}/>
                                        {userSelectors.getIsMerchantUserApproved() && <>
                                            <Route exact path="/transactions" component={TransactionsPage}/>
                                            <Route exact path="/transactions/:id" component={TransactionsDetails}/>
                                            <Route exact path="/merchants" component={MerchantList}/>
                                            <Route exact path="/merchants/:id" component={MerchantDetails}/>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Route exact path="/login" component={LoginPage}/>
                    <Route exact path="/register" component={Register}/>
                </ErrorBoundary>
            </Switch>
        );
    }

}

export default App;
