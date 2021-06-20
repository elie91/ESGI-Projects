import React from "react";
import { Link, withRouter } from "react-router-dom";
import useUser from "../../hooks/useUser";
import './Navbar.css';
import Logo from "../../css/profil.jpeg";
import useMerchants from "../../hooks/useMerchants";

const Navbar = ({ history }) => {

    const { selectors: userSelectors, actions: userActions } = useUser();
    const { selectors: selectorMerchant } = useMerchants();

    const toggleDropdown = (event, selector) => {
        const dropdown = event.target.closest('.dropdown');
        const dropdownMenu = document.querySelector(`#${selector}`)
        dropdown.classList.toggle('show');
        dropdownMenu.classList.toggle('show');
    }

    const handleLogout = () => {
        localStorage.clear();
        userActions.logout();
    }

    const handleRemoveMerchant = () => {
        userActions.removeSelectedMerchant()
        history.replace("/")
    }

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars" />
            </button>

            <ul className="navbar-nav ml-auto">
                {userSelectors.getSelectedMerchant() && selectorMerchant.getMerchantsCount() > 1 && <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, "dropdown1")} id="merchantDropdown" role="button" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                        <span className="d-none d-lg-inline text-primary small">
                            Vue marchand actuel : {userSelectors.getSelectedMerchant().name}
                        </span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" id="dropdown1" aria-labelledby="merchantDropdown">
                        <button className="dropdown-item" onClick={handleRemoveMerchant}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                            Supprimer le filtre du marchand
                        </button>
                    </div>
                </li>}

                <div className="topbar-divider d-none d-sm-block" />

                <li className="nav-item dropdown no-arrow">
                    <a className="nav-link dropdown-toggle" onClick={(e) => toggleDropdown(e, "dropdown2")} id="userDropdown" role="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                            {userSelectors.getUser().email}
                        </span>
                        <img className="img-profile rounded-circle" src={Logo} />
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" id="dropdown2" aria-labelledby="userDropdown">
                        <Link className="dropdown-item" to="/profile">
                            <i className="fa fa-user fa-sm fa-fw mr-2 text-gray-400" />
                            Mon profile
                        </Link>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                            Déconnexion
                        </button>
                    </div>
                </li>

            </ul>

        </nav>
    )
}

export default withRouter(Navbar);
