import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import RoundedInput from "../../Styled/Input/RoundedInput";
import {toBase64} from "../../../utils/utils";
import useUser from "../../../hooks/useUser";
import {fetchCurrencies} from "../../../context/actions/currency.actions";

const Register = ({history}) => {

    const {actions: userActions} = useUser();

    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        company_name: '',
        kbis: '',
        address: '',
        postal_code: '',
        city: '',
        confirmation_url: '',
        cancellation_url: '',
        currency: '',
    });

    const [currencies, setCurrencies] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchCurrencies()
            .then(data => {
                const results = data.map(currency => currency.currency)
                setCurrencies(results)
            })
    }, []);

    const handleSubmit = event => {
        event.preventDefault();
        if (error > 0) return;
        userActions.signup(userData)
            .then(() => setSuccess('Inscription réussie'))
            .then(() => setTimeout(() => history.push('/login'), 1000))
            .catch(err => setError(err))
    };

    const handleChange = async event => {
        const {value, name, type} = event.target;
        if (type === "file") {
            const file = await toBase64(event.target.files[0])
            setUserData({...userData, kbis: file})
        } else {
            setUserData({...userData, [name]: value});
        }
    };


    const handlePasswordChange = event => {
        if (event.target.value !== userData.password) {
            setError({password :"Les mots de passes ne sont pas identiques", ...error})
        } else {
            setError(null)
        }
    }

    return (
        <div className="bg-gradient-primary py-5">
            <div className="container">
                <div className="card o-hidden border-0 shadow-lg">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-5 d-none d-lg-block bg-register-image"/>
                            <div className="col-lg-7">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Créér un compte</h1>
                                        {error && <ul className="alert alert-danger ml-0 list-unstyled">{Object.keys(error).map((key) => <li key={key}>{error[key]}</li>)}</ul>}
                                        {success && <div className="alert alert-success">{success}</div>}
                                    </div>

                                    <form className="user" onSubmit={handleSubmit} autoComplete="on">
                                        <div className="form-group row">
                                            <RoundedInput parentClass="col-sm-6 mb-3 mb-sm-0" onChange={handleChange} isUser={true} type="text"
                                                          autoComplete="given-name" name="firstname" placeholder="Prénom" required/>
                                            <RoundedInput parentClass="col-sm-6" onChange={handleChange} isUser={true} type="text" name="lastname"
                                                          autoComplete="family-name" placeholder="Nom" required/>
                                        </div>

                                        <RoundedInput parentClass="form-group" onChange={handleChange} isUser={true} type="email" name="email"
                                                      placeholder="Email" autoComplete="email" required/>

                                        <div className="form-group row">
                                            <RoundedInput parentClass="col-sm-6 mb-3 mb-sm-0" onChange={handleChange} isUser={true} type="password"
                                                          autoComplete="new-password" name="password" placeholder="Mot de passe"
                                                          required/>
                                            <RoundedInput parentClass="col-sm-6" onChange={handlePasswordChange} isUser={true} type="password"
                                                          autoComplete="new-password" placeholder="Répéter le mot de passe" required/>
                                        </div>
                                        <hr/>

                                        <div className="form-group row">
                                            <RoundedInput parentClass="col-sm-6 mb-3 mb-sm-0" onChange={handleChange} isUser={true} type="text"
                                                          name="company_name" autoComplete="organization" placeholder="Nom de société" required/>
                                            <RoundedInput parentClass="col-sm-6" onChange={handleChange} isUser={true} type="text" name="phone"
                                                          autoComplete="tel" placeholder="Téléphone" required/>
                                        </div>

                                        <RoundedInput parentClass="form-group" onChange={handleChange} isUser={true} type="text" name="address"
                                                      autoComplete="street-address" placeholder="Adresse" required/>
                                        <RoundedInput parentClass="form-group" onChange={handleChange} isUser={true} type="text" name="postal_code"
                                                      autoComplete="postal-code" placeholder="Code postal" required/>
                                        <RoundedInput parentClass="form-group" onChange={handleChange} isUser={true} type="text" name="city"
                                                      autoComplete="country-name" placeholder="Ville" required/>


                                        <div className="form-group row align-items-center">
                                            <div className="col-sm-7 mb-3 mb-sm-0">
                                                <label htmlFor="kbis">KBIS</label>
                                                <input onChange={handleChange} type="file" name="kbis" placeholder="KBIS"/>
                                            </div>
                                            <div className="col-sm-5">
                                                <label htmlFor="devise">Devise</label>
                                                <select className="form-control" id="currency" name="currency" onChange={handleChange}>
                                                    <option value="" defaultValue>Votre devise</option>
                                                    {currencies.map((currency, index) => <option key={index} value={currency}>{currency}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <RoundedInput parentClass="col-sm-6 mb-3 mb-sm-0" onChange={handleChange} isUser={true} type="text"
                                                          autoComplete="url" name="confirmation_url" placeholder="URL de confirmation" required/>
                                            <RoundedInput parentClass="col-sm-6" onChange={handleChange} isUser={true} type="text"
                                                          name="cancellation_url"
                                                          autoComplete="url" placeholder="URL d'annulation" required/>
                                        </div>

                                        <button type="submit" className="btn btn-primary btn-user btn-block">
                                            Inscription
                                        </button>
                                        <hr/>
                                    </form>
                                    <hr/>
                                    <div className="text-center">
                                        <Link className="small" to="/login">Vous avez déja un compte ? Connectez vous</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Register;
