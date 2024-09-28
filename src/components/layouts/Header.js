import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../Firebase";

export default function Header() {

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
            {/* ***** Header Area Start ***** */}
            <header className="header_area" id="header">
                <div className="container-fluid h-100">
                    <div className="row h-100">
                        <div className="col-12 h-100">
                            <nav className="h-100 navbar navbar-expand-lg">
                                <NavLink className="navbar-brand" to="/">
                                    <img
                                        src="/assets/img/core-img/logoimg.png"
                                        alt=""
                                        className="img-fluid"
                                        style={{ maxHeight: "60px", width: "auto" }}
                                    />
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

                                {/* Nav */}
                                <div className="collapse navbar-collapse" id="dorneNav">
                                    <ul className="navbar-nav mr-auto" id="dorneMenu">
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/"
                                                exact
                                                activeClassName="active"
                                            >
                                                Home <span className="sr-only">(current)</span>
                                            </NavLink>
                                        </li>
                                        {/* <li className="nav-item dropdown">
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href="#"
                                                id="navbarDropdown"
                                                role="button"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Explore{" "}
                                                <i className="fa fa-angle-down" aria-hidden="true" />
                                            </a>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown"
                                            >
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/"
                                                    activeClassName="active"
                                                >
                                                    Home
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/explore"
                                                    activeClassName="active"
                                                >
                                                    Explore
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/listing"
                                                    activeClassName="active"
                                                >
                                                    Listing
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/singlelisting"
                                                    activeClassName="active"
                                                >
                                                    Single Listing
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/contact"
                                                    activeClassName="active"
                                                >
                                                    Contact
                                                </NavLink>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href="#"
                                                id="navbarDropdown2"
                                                role="button"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Listings{" "}
                                                <i className="fa fa-angle-down" aria-hidden="true" />
                                            </a>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown2"
                                            >
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/"
                                                    activeClassName="active"
                                                >
                                                    Home
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/explore"
                                                    activeClassName="active"
                                                >
                                                    Explore
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/listing"
                                                    activeClassName="active"
                                                >
                                                    Listing
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/singlelisting"
                                                    activeClassName="active"
                                                >
                                                    Single Listing
                                                </NavLink>
                                                <NavLink
                                                    className="dropdown-item"
                                                    to="/contact"
                                                    activeClassName="active"
                                                >
                                                    Contact
                                                </NavLink>
                                            </div>
                                        </li> */}
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/explore"
                                                activeClassName="active"
                                            >
                                                Explore
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/listing"
                                                activeClassName="active"
                                            >
                                                Listing
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/contact"
                                                activeClassName="active"
                                            >
                                                Contact
                                            </NavLink>
                                        </li>
                                        {
                                            userId && <li className="nav-item">
                                            <NavLink
                                                className="nav-link"
                                                to="/profile"
                                                activeClassName="active"
                                            >
                                                Profile
                                            </NavLink>
                                        </li>
                                        }
                                    </ul>

                                    {/* Search btn */}
                                    <div className="dorne-search-btn">
                                        <NavLink id="search-btn" to="/explore">
                                            <i className="fa fa-search" aria-hidden="true" /> Search
                                        </NavLink>
                                    </div>

                                    {/* Signin btn */}
                                    {
                                        !userId ?
                                            <div className="dorne-add-listings-btn">
                                                <NavLink to="/login" className="btn dorne-btn">
                                                    Sign in or Register
                                                </NavLink>
                                            </div>
                                            :
                                            <div className="dorne-add-listings-btn">
                                                <a onClick={logout} className="btn dorne-btn" style={{color:"#fff"}}>
                                                    Logout
                                                </a>
                                            </div>
                                    }


                                    {/* Search btn */}
                                    {/* <div className="dorne-search-btn">
                                        <a id="search-btn" href="#">
                                            <i className="fa fa-search" aria-hidden="true" /> Search
                                        </a>
                                    </div> */}

                                    {/* User Profile btn */}
                                    {/* <div className="dorne-search-btn">
                                        <Link id="search-btn" to="/profile">
                                            Profile
                                        </Link>
                                    </div> */}

                                    {/* Signin btn */}
                                    {/* <div className="dorne-signin-btn">
                                        <Link to="/login">Sign in or Register</Link>
                                    </div> */}

                                    {/* Add listings btn */}
                                    {/* <div className="dorne-add-listings-btn">
                                        <a href="#" className="btn dorne-btn">
                                            + Add Listings
                                        </a>
                                    </div> */}
                                </div>
                            </nav>
                        </div>
                    </div>
                </div >
            </header >
            {/* ***** Header Area End ***** */}
        </>
    );
}
