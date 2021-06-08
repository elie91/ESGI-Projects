import React from "react";
import useMerchants from "../../hooks/useMerchants";
import {Link} from "react-router-dom";
import useUser from "../../hooks/useUser";

const MerchantList = ({history}) => {

    const {selectors: merchantsSelector} = useMerchants();
    const {selectors: userSelectors, actions: userActions} = useUser();

    const setMerchant = merchant => {
        userActions.setSelectedMerchant(merchant)
        history.push('/')
    }
    return (
        <>
            <h1 className="h3 mb-4 text-gray-800">Comptes Marchands</h1>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Liste des marchands</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Nombre de transactions</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {merchantsSelector.getMerchants().map(merchant => {
                                return <tr key={merchant.id}>
                                    <td>{merchant.id}</td>
                                    <td>{merchant.name}</td>
                                    <td>{merchant.transaction.length}</td>
                                    <td className="text-center">{
                                        merchant.approved ?
                                            <button className="btn btn-success btn-circle">
                                                <i className="fas fa-check"/>
                                            </button> :
                                            <button className="btn btn-warning btn-circle">
                                                <i className="fas fa-exclamation-triangle"/>
                                            </button>
                                    }</td>
                                    <td className="text-right">
                                        {((!userSelectors.getSelectedMerchant() || userSelectors.getSelectedMerchant().id !== merchant.id) && merchantsSelector.getMerchantsCount() > 1 ) &&
                                        <button className="btn btn-primary btn-icon-split mr-4"
                                                onClick={() => setMerchant(merchant)}>
                                                    <span className="icon text-white-50">
                                                        <i className="fas fa-info-circle"/>
                                                    </span>
                                            <span className="text">Appliquer la vue</span>
                                        </button>}

                                        <Link to={`/merchants/${merchant.id}`} className="btn btn-info btn-icon-split">
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default MerchantList;
