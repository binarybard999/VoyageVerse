import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../Firebase';
import { ClipLoader } from "react-spinners";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [totalCities, setTotalCities] = useState(0);
    const [totalPlaces, setTotalPlaces] = useState(0);
    const [totalPackages, setTotalPackages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        // Fetch all counts concurrently
        const fetchData = async () => {
            try {
                const cityCount = getCountFromServer(collection(db, 'cities'));
                const placeCount = getCountFromServer(collection(db, 'places'));
                const packageCount = getCountFromServer(collection(db, 'packages'));
                const userCount = getCountFromServer(collection(db, 'users'));

                const results = await Promise.all([cityCount, placeCount, packageCount, userCount]);

                setTotalCities(results[0].data().count);
                setTotalPlaces(results[1].data().count);
                setTotalPackages(results[2].data().count);
                setTotalUsers(results[3].data().count);
            } catch (error) {
                console.error('Error fetching data: ', error);
                // Optionally, handle errors here
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {/* ***** Breadcumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcumb Area End ***** */}

            <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />

            <div className={loading ? "d-none" : "container my-5"}>
                {/* Summary Boxes */}
                <div className="row mb-4">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Total Cities</h5>
                                <p className="card-text text-dark">{totalCities}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Total Places</h5>
                                <p className="card-text text-dark">{totalPlaces}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Total Packages</h5>
                                <p className="card-text text-dark">{totalPackages}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Total Users</h5>
                                <p className="card-text text-dark">{totalUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Management Cards */}
                <div className="row">
                    {/* Manage Cities */}
                    <div className="col-12 col-md-12 col-lg-6 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Manage Cities</h5>
                                <div className="d-flex flex-column flex-sm-row justify-content-between">
                                    <Link to="/admin/city/add" className="btn dorne-btn-outline mb-2 mb-sm-0 w-100 w-sm-auto">Add City</Link>
                                    <Link to="/admin/city/manage" className="btn dorne-btn-outline w-100 w-sm-auto">Manage Cities</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manage Places */}
                    <div className="col-12 col-md-12 col-lg-6 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Manage Places</h5>
                                <div className="d-flex flex-column flex-sm-row justify-content-between">
                                    <Link to="/admin/places/add" className="btn dorne-btn-outline mb-2 mb-sm-0 w-100 w-sm-auto">Add Place</Link>
                                    <Link to="/admin/places/manage" className="btn dorne-btn-outline w-100 w-sm-auto">Manage Places</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manage Packages */}
                    <div className="col-12 col-md-12 col-lg-6 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">Manage Packages</h5>
                                <div className="d-flex flex-column flex-sm-row justify-content-between">
                                    <Link to="/admin/packages/add" className="btn dorne-btn-outline mb-2 mb-sm-0 w-100 w-sm-auto">Add Package</Link>
                                    <Link to="/admin/packages/manage" className="btn dorne-btn-outline w-100 w-sm-auto">Manage Packages</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Bookings */}
                    <div className="col-12 col-md-12 col-lg-6 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">View Bookings</h5>
                                <Link to="/admin/bookings" className="btn dorne-btn-outline w-100">Go</Link>
                            </div>
                        </div>
                    </div>

                    {/* View Ratings */}
                    <div className="col-12 col-md-12 col-lg-6 mb-4">
                        <div className="card contact-form p-3">
                            <div className="card-body">
                                <h5 className="card-title">View Ratings</h5>
                                <Link to="/admin/reviews" className="btn dorne-btn-outline w-100">Go</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
