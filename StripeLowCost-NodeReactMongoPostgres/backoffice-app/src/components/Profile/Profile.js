import React, {useState, useEffect} from "react";
import useUser from "../../hooks/useUser";
import Alert from "../Styled/Alert/Alert";

const Profile = () => {

    const {selectors: userSelectors, actions: userActions} = useUser();
    const user = userSelectors.getUser();

    const [userData, setUserData] = useState({
        id: user.id,
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        phone: user.phone,
    });

    useEffect(() => {}, [user])

    const [success, setSuccess] = useState(null);

    const handleChange = event => {
        const {value, name} = event.target;
        setUserData({...userData, [name]: value});
    };

    const handleSubmit = e => {
        e.preventDefault();
        userActions.put({...user, ...userData})
            .then(() => setSuccess("Les modifications ont bien été enregistrés"))
    }

    return (
        <>
            <h1 className="h3 mb-1 text-gray-800">Mon profil</h1>
            <p className="mb-4 text-gray-900">
                Vous trouverez sur cette page vos informations personnelles
            </p>
            {success && <Alert type="success" message={success} />}
            <div className="row">

                <div className="col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Mes informations personnelles</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor="lastname">Nom</label>
                                        <input type="text" onChange={handleChange} className="form-control" id="lastname" name="lastname"
                                               value={userData.lastname} required/>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor="firstname">Prénom</label>
                                        <input type="text" onChange={handleChange} className="form-control" id="firstname" name="firstname"
                                               value={userData.firstname} required/>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" onChange={handleChange} className="form-control" id="email" name="email"
                                               value={userData.email} required/>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <label htmlFor="phone">Téléphone</label>
                                        <input type="tel" onChange={handleChange} className="form-control" id="phone" name="phone"
                                               value={userData.phone} required/>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary mt-4">Valider</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;
