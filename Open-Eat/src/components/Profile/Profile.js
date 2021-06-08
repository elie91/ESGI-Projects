import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { auth, storage } from "../../firebase";

const Profile = ({history}) => {

  const { user } = useContext(UserContext);
  const [avatar, setAvatar] = useState(undefined);

  useEffect(() => {
    let unmounted = false
      if (user) {
        storage.ref().child(`users/${user.avatar}`).getDownloadURL().then(function (url) {
          if (!unmounted) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function (event) {
              // Loading
            };
            xhr.open("GET", url);
            xhr.send();
            setAvatar(url);
          }
        }).catch(function (error) {
          console.error(error);
        });
    }
    return () => {unmounted = true};

  }, [user]);

  const _signOut = () => {
    auth.signOut().then(() => history.push("/login"));
  };

  return (
    <section className="profile">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="offset-md-3 col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h1 className="title-bordered">Mes informations</h1>
                  <ul className="list-unstyled">
                    <li className="py-2">Avatar : {avatar && <img className="rounded-circle avatar" src={avatar} alt="Avatar"/>}</li>
                    <li className="py-2">Email : {user.email}</li>
                    <li className="py-2">Nom : {user.lastname}</li>
                    <li className="py-2">Prenom : {user.firstname}</li>
                  </ul>
                  <button className="btn btn-danger btn-block" onClick={_signOut}>Se déconnecter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default withRouter(React.memo(Profile));
