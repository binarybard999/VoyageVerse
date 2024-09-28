import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <>
            {/* ****** Footer Area Start ****** */}
            <footer className="dorne-footer-area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 d-md-flex align-items-center justify-content-between">
                            <div className="footer-text">
                                <p>
                                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                    Copyright &copy; 2024 All rights reserved | <Link to="/">
                                        VoyageVerse.in
                                    </Link>
                                    {/* Made with{" "}
                                    <i className="fa fa-heart-o" aria-hidden="true" /> by{" "}
                                    <a href="https://colorlib.com" target="_blank">
                                        Colorlib
                                    </a>{" "}
                                    &amp; distributed by{" "}
                                     */}
                                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                </p>
                            </div>
                            <div className="footer-social-btns">
                                <a href="#">
                                    <i className="fa fa-linkedin" aria-haspopup="true" />
                                </a>
                                <a href="#">
                                    <i className="fa fa-instagram" aria-hidden="true" />
                                </a>
                                <a href="#">
                                    <i className="fa fa-whatsapp" aria-hidden="true" />
                                </a>
                                <a href="#">
                                    <i className="fa fa-twitter" aria-haspopup="true" />
                                </a>
                                <a href="#">
                                    <i className="fa fa-facebook" aria-haspopup="true" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* ****** Footer Area End ****** */}
        </>

    );
}