import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';  // Add `query` and `where` for filtering
import { db } from '../../Firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Listing() {
    const [packages, setPackages] = useState([]);
    const [cities, setCities] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchPackagesAndCities = async () => {
            try {
                // Fetch only packages with 'status' set to 'Active'
                const packagesCollection = collection(db, 'packages');
                const activePackagesQuery = query(packagesCollection, where('status', '==', 'Active')); // Add this query to filter by status
                const packageSnapshot = await getDocs(activePackagesQuery);
                const packagesList = packageSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Fetch all cities
                const citiesCollection = collection(db, 'cities');
                const citiesSnapshot = await getDocs(citiesCollection);
                const citiesList = {};
                citiesSnapshot.docs.forEach(doc => {
                    const cityData = doc.data();
                    citiesList[cityData.id] = cityData.thumbnail;
                });

                setPackages(packagesList);
                setCities(citiesList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        fetchPackagesAndCities();
    }, []);

    // Get current items based on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = packages.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {/* ***** Breadcrumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            >
            </div>
            {/* ***** Breadcrumb Area End ***** */}

            {/* ***** Listing Destinations Area Start ***** */}
            <section className="dorne-listing-destinations-area section-padding-100-50">
                <div className="container">
                    <div className="section-heading dark text-center">
                        <span />
                        <h4>Featured Destinations</h4>
                        <p>Editor’s pick</p>
                    </div>

                    {/* Total Packages */}
                    <div className="total-packages text-center mb-4">
                        <h5>Total Packages: {packages.length}</h5>
                    </div>

                    {/* Loader */}
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                            <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />
                        </div>
                    ) : (
                        <div className="row">
                            {currentItems.length > 0 ? (
                                currentItems.map((pkg) => (
                                    <div className="col-12 col-sm-6 col-lg-4" key={pkg.id}>
                                        <div className="single-features-area mb-50">
                                            <Link to={`/view/${pkg.id}`}>
                                                <img
                                                    src={cities[pkg.cityId] || pkg.image || '/assets/img/place-img/hotel-1.jpg'}
                                                    alt={pkg.packageName}
                                                    style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                                                />
                                                <div className="price-start">
                                                    <p>FROM ₹{pkg.price}</p>
                                                </div>
                                                <div className="feature-content d-flex align-items-center justify-content-between">
                                                    <div className="feature-title">
                                                        <h5>{pkg.packageName}</h5>
                                                        <p>{pkg.cityName}</p>
                                                        <p>{pkg.days} Days / {pkg.night} Nights</p>
                                                        <p>For {pkg.noOfPeople} People</p>
                                                        <p>Meals: {pkg.meals}</p>
                                                        <p>Features: {pkg.otherFeatures}</p>
                                                    </div>
                                                    <div className="feature-favourite">
                                                        <a href="#">
                                                            <i className="fa fa-heart-o" aria-hidden="true" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-warning text-center" role="alert">
                                        No packages available at the moment.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="pagination mt-4">
                        <nav>
                            <ul className="pagination justify-content-center" >
                                {Array.from({ length: Math.ceil(packages.length / itemsPerPage) }, (_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button onClick={() => paginate(index + 1)} className="page-link" style={{backgroundColor: "#7643ea"}}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </section>
            {/* ***** Listing Destinations Area End ***** */}
        </>
    );
}
