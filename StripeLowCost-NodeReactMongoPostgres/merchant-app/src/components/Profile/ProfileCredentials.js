import React, { useEffect, useState } from "react";
import Input from "../Styled/Input";
import { API_MERCHANTS_CREDENTIALS } from "../../config";
import { _setCredentials, credentialsExist, getCredentials, removeCredentials } from "../../utils/utils";

const ProfileCredentials = () => {

  const [credentials, setCredentials] = useState({
    public: localStorage.getItem("merchant_public") ? localStorage.getItem("merchant_public") : "",
    secret: localStorage.getItem("merchant_secret") ? localStorage.getItem("merchant_secret") : "",
  });

  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);

  const handleChange = event => {
    const { value, name } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  useEffect(() => {
    fetch(API_MERCHANTS_CREDENTIALS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + getCredentials(),
      }
    }).then(function (data) {
      if (data.status === 200) {
        _setCredentials(credentials)
      } else {
        setSuccess(undefined);
        setError("Les clés API ont expirées");
        removeCredentials();
      }
    })
  }, []);

  const _onSubmit = (e) => {
    e.preventDefault();
    if (credentials.public.length > 0 && credentials.secret.length > 0) {
      fetch(API_MERCHANTS_CREDENTIALS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + credentials.public + ":" + credentials.secret,
        }
      }).then(function (data) {
        if (data.status === 200) {
          _setCredentials(credentials)
          setSuccess("Vos clés API ont bien été ajoutées");
          setError(undefined);
        } else {
          setSuccess(undefined);
          setError("Les clés API n'existent pas");
          removeCredentials();
        }
      })
    } else {
      setError("Les deux champs sont obligatoires");
    }
  };

  return (
    <div className="container pt-6">
      <div className="row">
        <div className="offset-md-2 col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="card-title">
                <h1 className="h2">Credentials</h1>
              </div>
              <form onSubmit={_onSubmit}>
                <Input name="public" label="Clé API Public" onChange={handleChange} value={credentials.public}/>
                <Input name="secret" label="Clé API Secrète" onChange={handleChange} value={credentials.secret}/>
                {error && <p className="text-danger text-center">{error}</p>}
                {success && <p className="text-success text-center">{success}</p>}
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">{credentialsExist() ? "Mettre à jour " : "Confirmer "}vos identifiants</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCredentials;
