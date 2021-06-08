import React, { useState } from "react";
import useUser from "../../../hooks/useUser";
import { Link } from "react-router-dom";
import RoundedInput from "../../Styled/Input/RoundedInput";

const Login = ({ history }) => {

    const [userCredentials, setCredentials] = useState({ email: '', password: '' });
    const { email, password } = userCredentials;

    const { actions: userActions, selectors } = useUser();

    const handleSubmit = event => {
        event.preventDefault();
        userActions.login({ email, password})
          .then(() => history.push('/'))
          .catch(() => console.log(selectors.getError()))
    };

    const handleChange = event => {
        const { value, name } = event.target;
        setCredentials({ ...userCredentials, [name]: value });
    };

    return (
        <div className="bg-gradient-primary" >
            <div className="container">
                <div className="row justify-content-center min-vh-100 align-items-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"/>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-4">Connexion</h1>
                                            </div>
                                            <form className="user" onSubmit={handleSubmit}>
                                                {selectors.getError() && <div className="alert alert-danger">{selectors.getError()}</div>}
                                                <RoundedInput parentClass="form-group" onChange={handleChange} isUser={true} type="email" name="email" autoComplete="email" placeholder="Email" required />
                                                <RoundedInput parentClass="form-group" onChange={handleChange} isUser={true} type="password" name="password" autoComplete="new-password" placeholder="Password" required />
                                                <button type="submit" className="btn btn-primary btn-user btn-block">
                                                    Connexion
                                                </button>
                                            </form>
                                            <hr />
                                            <div className="text-center">
                                                <Link className="small" to="/register">Créér un compte</Link>
                                            </div>
                                        </div>
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

export default Login;
