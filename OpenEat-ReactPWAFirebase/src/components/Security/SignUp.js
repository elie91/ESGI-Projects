import React, { useState } from "react";
import { auth, generateUserDocument, storage } from "../../firebase";
import { withRouter, Link } from "react-router-dom";

const SignUp = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [avatar, setAvatar] = useState(undefined);
  const [error, setError] = useState({});

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "password-repeat":
        setPasswordRepeat(value);
        break;
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "avatar":
        setAvatar(event.target.files[0])
        break;
      default:
        break;
    }
  };

  const signUpHandler = async (event) => {
    event.preventDefault();

    const extensions = ['image/jpeg','image/png']

    let errors = {};

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "L'email n'est pas valide";
    }
    if (firstname.length < 2) {
      errors.firstname = "Le prénom doit faire minimum 2 caractères";
    }
    if (lastname.length < 2) {
      errors.lastname = "Le nom doit faire minimum 2 caractères";
    }
    if (password.length < 4) {
      errors.password = "Le mot de passe doit faire minimum 4 caractères";
    }
    if (password !== passwordRepeat) {
      errors.passwordRepeat = "Les mots de passe doivent correspondre";
    }
    if (avatar){
      if (!extensions.includes(avatar.type)){
        errors.avatar = "Le type de l'image est invalide.(jpeg, jpg, png)";
      }
    }else{
      errors.avatar = "Vous devez télécharger un avatar";
    }

    if (Object.entries(errors).length === 0) {
      let type = avatar.type.split('/');
      try{
        const {user} = await auth.createUserWithEmailAndPassword(email, password);
        storage.ref().child(`users/${user.uid}.${type[1]}`).put(avatar).then(function(snapshot) {
          console.log('Uploaded a blob or file!');
        });
        await generateUserDocument(user, {lastname, firstname, avatar: user.uid+"."+type[1]});
        return history.push('/');
      }
      catch(error){
        setError('Error Signing up with email and password');
      }
    } else {
      setError(errors);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-center min-vh-100 login">
        <div className="offset-md-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="display-6 text-center">S'inscrire sur Open Eat</h1>
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="text" className="form-control" name="email" value={email}
                         onChange={onChangeHandler} placeholder="Email"/>
                  {error.email && <small className="text-danger">{error.email}</small>}
                  {error.auth && <small className="text-danger">{error.auth}</small>}
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Mot de passe</label>
                  <input id="password" type="password" className="form-control" name="password" value={password}
                         onChange={onChangeHandler} placeholder="Mot de passe"/>
                  {error.password && <small className="text-danger">{error.password}</small>}
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="password">Confirmer votre mot de passe</label>
                  <input id="password-repeat" type="password" className="form-control" name="password-repeat"
                         value={passwordRepeat} onChange={onChangeHandler} placeholder="Confirmer votre mot de passe"/>
                  {error.passwordRepeat && <small className="text-danger">{error.passwordRepeat}</small>}
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="lastname">Nom</label>
                  <input id="lastname" type="text" className="form-control" name="lastname" value={lastname}
                         onChange={onChangeHandler} placeholder="Nom"/>
                  {error.lastname && <small className="text-danger">{error.lastname}</small>}
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="firstname">Prénom</label>
                  <input id="firstname" type="text" className="form-control" name="firstname" value={firstname}
                         onChange={onChangeHandler} placeholder="Prénom"/>
                  {error.firstname && <small className="text-danger">{error.firstname}</small>}
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="avatar">Avatar</label>
                  <input className="d-block" id="avatar" name="avatar" type="file" onChange={onChangeHandler} />
                  {error.avatar && <small className="text-danger">{error.avatar}</small>}
                </div>
                <div className="d-flex justify-content-between">
                  <Link className="btn btn-primary" to="/login">Retour</Link>
                  <button className="btn btn-primary" type="submit"
                          onClick={(event) => signUpHandler(event, email, password, passwordRepeat, lastname, firstname)}>
                    Confirmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(React.memo(SignUp));
