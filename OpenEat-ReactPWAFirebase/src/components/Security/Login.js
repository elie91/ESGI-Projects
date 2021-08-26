import React, { useState } from "react";
import { auth } from "../../firebase";
import { Link, withRouter } from "react-router-dom";

const Login = ({history}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const {name, value} = event.currentTarget;

    if(name === 'email') {
      setEmail(value);
    }
    else if(name === 'password'){
      setPassword(value);
    }
  };

  const signInWithEmailAndPasswordHandler = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch(error => {
      setError("Email ou mot de passe invalide");
      console.error("Error signing in with password and email", error);
    }).then(function () {
      if (error !== null){
        history.push("/")
      }
    })
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-center min-vh-100 login">
        <div className="col-md-4 offset-md-4">
          <div className="card no-border">
            <div className="card-body">
              <h1 className="display-6 text-center">Open Eat</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="text" className="form-control" name="email" value={email} onChange={onChangeHandler}/>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Mot de passe</label>
                  <input id="password" type="password" className="form-control" name="password" value={password} onChange={onChangeHandler}/>
                </div>
                {error && <small className="text-danger">{error}</small>}
                  <button className="btn btn-primary my-4 btn-block" type="submit" onClick={(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>Se connecter</button>
              </form>
              <p className="text-muted text-center mb-0">Vous n'avez pas de compte <Link className="text-primary" to="/sign-up">S'inscrire</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRouter(React.memo(Login));
