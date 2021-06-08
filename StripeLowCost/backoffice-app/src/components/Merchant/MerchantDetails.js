import React, {useEffect, useState} from "react";
import FormInput from "../Styled/Input/FormInput";
import {getFormatedDate} from "../../utils/utils";
import useUser from "../../hooks/useUser";
import {fetchMerchantById, generateNewKeys, putMerchant} from "../../context/actions/merchants.actions";
import Alert from "../Styled/Alert/Alert";
import useMerchants from "../../hooks/useMerchants";

const MerchantDetails = ({match, history}) => {

    const {selectors: userSelectors} = useUser();
    const {selectors: merchantsSelectors, actions: merchantsAction} = useMerchants();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(true);
    const [mounted, setIsMounted] = useState(true);

    const [merchantData, setMerchantData] = useState({
        approved: false,
        name: "",
        phone: "",
        address: "",
        postal_code: "",
        city: "",
        kbis: "",
        public_key: "",
        secret_key: "",
        confirmation_url: "",
        cancellation_url: "",
    });

    useEffect(() => {
        fetchMerchantById(userSelectors.getUser().token, match.params.id)
            .then(merchant => {
                if (mounted) {
                    setMerchantData(merchant);
                }
            })
            .catch((error) => console.error(error) || history.push("/merchants"))
            .finally(() => setIsMounted(false))
        return () => setIsMounted(false)
    }, []);

    useEffect(() => {
        if (!mounted) {
            saveData();
        }
    }, [merchantData.approved])

    const handleChange = event => {
        const {value, name} = event.target;
        setMerchantData({...merchantData, [name]: value});
    };

    const changeKeys = () => {
        generateNewKeys(userSelectors.getUser().token, merchantData.id)
            .then(keys => setMerchantData({...merchantData, public_key: keys.public_key, secret_key: keys.secret_key}))
            .then(() => setSuccess("Modifications enregistrés"));
    };

    const saveData = () => {
        merchantsAction.updateMerchant(userSelectors.getUser().token, merchantData)
            .then(() => console.log(merchantsSelectors.getMerchants()))
            .then(() => setSuccess("Modifications enregistrés"))
            .catch(err => setError(err.message));
    };

    const toogleApproved = () => {
        setMerchantData({...merchantData, approved: !merchantData.approved});
    }

    const onDismiss = () => setOpen(false);

    return (
        <>
            <h1 className="h3 mb-4 text-gray-800">Détails du marchand</h1>
            {success && <Alert open={open} onDismiss={onDismiss} type="success" message={success}/>}
            {error && <Alert type="error" message={error}/>}
            <div className="card shadow mb-4">
                <div className="card-body">
                    <form>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h6 className="font-weight-bold text-primary">Informations de la société</h6>
                            <div>
                                {userSelectors.getUser().role === "ADMIN" &&
                                <button type="button" onClick={() => toogleApproved()}
                                        className={"btn mr-2" + (merchantData.approved ? " btn-danger" : " btn-primary")}>
                                    {merchantData.approved ? "Désapprouver le compte" : "Approuver le compte"}
                                </button>
                                }
                                {merchantData.kbis.length > 0 &&
                                <a className="btn btn-primary mr-2" download={merchantData.name} href={merchantData.kbis}>
                                    <i className="fas fa-file-download mr-2"/>Télécharger le KBIS
                                </a>}
                                <button type="button" onClick={changeKeys} className="btn btn-outline-warning mr-2">Générer des
                                    nouvelles clés
                                </button>
                            </div>
                        </div>

                        <div className="row">
                            <FormInput parentClass="col-sm-6" label="Nom" id="name" value={merchantData.name} type="text"
                                       name="name"
                                       onBlur={saveData}
                                       onChange={handleChange}/>
                            <FormInput parentClass="col-sm-6" label="Téléphone" id="phone" value={merchantData.phone} type="tel"
                                       name="phone"
                                       onBlur={saveData}
                                       onChange={handleChange}/>
                        </div>

                        <div className="row my-4">
                            <FormInput parentClass="col-sm-7" label="Adresse" id="address" value={merchantData.address} type="text"
                                       name="address"
                                       onBlur={saveData}
                                       onChange={handleChange}/>
                            <FormInput parentClass="col-sm-2" label="Code Postal" id="postal_code" value={merchantData.postal_code}
                                       type="text"
                                       name="postal_code"
                                       onBlur={saveData}
                                       onChange={handleChange}/>
                            <FormInput parentClass="col-sm-3" label="Ville" id="city" value={merchantData.city} type="text"
                                       name="city"
                                       onBlur={saveData}
                                       onChange={handleChange}/>
                        </div>

                        <div className="my-4">
                            <p className="font-weight-bold">
                                Créé le {getFormatedDate(merchantData.createdAt)}
                            </p>
                        </div>

                        <h6 className="font-weight-bold text-primary">Informations transactionnelles</h6>

                        <div className="row mt-4">
                            <FormInput parentClass="col-sm-6" label="Clé publique" id="public_key" value={merchantData.public_key}
                                       type="text"
                                       readOnly/>
                            <FormInput parentClass="col-sm-6" label="Clé secrète" id="secret_key" value={merchantData.secret_key}
                                       type="text"
                                       readOnly/>
                        </div>

                        <div className="row mt-4">
                            <FormInput parentClass="col-sm-6" label="URL de succès" id="confirmation_url"
                                       value={merchantData.confirmation_url}
                                       type="text"
                                       name="confirmation_url"
                                       onBlur={saveData}
                                       onChange={handleChange}/>
                            <FormInput parentClass="col-sm-6" label="URL d'échec" id="cancellation_url"
                                       value={merchantData.cancellation_url}
                                       type="text"
                                       onBlur={saveData}
                                       name="cancellation_url"
                                       onChange={handleChange}/>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

};

export default MerchantDetails;
