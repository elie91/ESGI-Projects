import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import useUser from "../../hooks/useUser";

const Sidebar = () => {

    const {selectors: userSelectors} = useUser();

    useEffect(() => {
        const sidebarToggle = document.querySelector('#sidebarToggle');
        const sidebar = document.querySelector('.sidebar');
        const toggleSidebar = () => {
            document.getElementsByTagName('body')[0].classList.toggle('sidebar-toggled');
            sidebar.classList.toggle('toggled');
        }
        sidebarToggle.addEventListener('click', toggleSidebar);
        return () => sidebarToggle.removeEventListener("click", toggleSidebar);
    }, []);

    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                <div className="sidebar-brand-text mx-3">Stripe<sup>Low Cost</sup></div>
            </Link>

            <hr className="sidebar-divider my-0"/>

            <li className="nav-item active">
                <Link className="nav-link" to="/">
                    <i className="fas fa-tachometer-alt"/>
                    <span>Dashboard</span>
                </Link>
            </li>

            {userSelectors.getIsMerchantUserApproved() && <>
                <li className="nav-item">
                    <Link className="nav-link" to="/transactions">
                        <i className="fas fa-fw fa-table"/>
                        <span>Transactions</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/merchants">
                        <i className="fas fa-fw fa-table"/>
                        <span>Marchands</span>
                    </Link>
                </li>
            </>}

            <hr className="sidebar-divider"/>

            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle"/>
            </div>

        </ul>
    )
}

export default Sidebar;
