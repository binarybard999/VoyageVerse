import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../Firebase";

export function AdminHeader() {

    const userId = sessionStorage.getItem("email")
    const nav = useNavigate()
    const logout = () => {
        if (window.confirm("Do you really want to logout?")) {
            auth.signOut()
            sessionStorage.clear()
            toast.success("Logout successfully")
            nav("/login")
        }
    }

    return (
        <>
            <header className="header_area" id="header">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100">
                            <nav className="h-100 navbar navbar-expand-lg">
                                <NavLink className="navbar-brand" to="/">
                                    <img src="/assets/img/core-img/logoimg.png" alt="" className="img-fluid" style={{ width: "13rem" }} />
                                </NavLink>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#dorneNav"
                                    aria-controls="dorneNav"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span className="fa fa-bars" />
                                </button>
                                
                                <div className="collapse navbar-collapse" id="dorneNav">
                                    <ul className="navbar-nav w-100 d-flex justify-content-end align-items-center" id="dorneMenu">
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/admin/dashboard"
                                                activeClassName="active"
                                            >
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/admin/city/manage"
                                                activeClassName="active"
                                            >
                                                City
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/admin/places/manage"
                                                activeClassName="active"
                                            >
                                                Places
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/admin/packages/manage"
                                                activeClassName="active"
                                            >
                                                Packages
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/admin/bookings"
                                                activeClassName="active"
                                            >
                                                Booking
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/admin/reviews"
                                                activeClassName="active"
                                            >
                                                Reviews
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={logout} className="btn dorne-btn" style={{ color: "#fff" }}>
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
