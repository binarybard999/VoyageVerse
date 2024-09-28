import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase'; // Assuming Firebase is initialized
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Explore() {
    const [packages, setPackages] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likedPackages, setLikedPackages] = useState({});
    const [filters, setFilters] = useState({
        city: '',
        days: '',
        priceRange: '',
        noOfPeople: ''
    });

    const toggleLike = (packageId) => {
        setLikedPackages((prevLikedPackages) => ({
            ...prevLikedPackages,
            [packageId]: !prevLikedPackages[packageId],
        }));
    };

    useEffect(() => {
        const fetchPackagesAndCities = async () => {
            try {
                // Fetch all active packages
                await fetchPackages({});

                // Fetch all cities
                const citiesCollection = collection(db, 'cities');
                const citiesSnapshot = await getDocs(citiesCollection);
                const citiesList = citiesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
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

    const fetchPackages = async (filters) => {
        try {
            const packagesCollection = collection(db, 'packages');
            let packagesQuery = query(packagesCollection, where('status', '==', 'Active'));

            // Apply filters
            const queryConstraints = [where('status', '==', 'Active')];

            if (filters.city) {
                queryConstraints.push(where('cityName', '==', filters.city));
            }
            if (filters.noOfPeople) {
                if (filters.noOfPeople === '5+') {
                    queryConstraints.push(where('noOfPeople', '>=', 5));
                } else {
                    queryConstraints.push(where('noOfPeople', '==', parseInt(filters.noOfPeople)));
                }
            }

            // Apply range filters
            if (filters.priceRange) {
                let priceRange = null;
                if (filters.priceRange === '₹5000-9999') {
                    priceRange = [5000, 9999];
                } else if (filters.priceRange === '₹10000-49999') {
                    priceRange = [10000, 49999];
                } else if (filters.priceRange === '₹50000+') {
                    priceRange = [50000, Number.MAX_SAFE_INTEGER];
                }
                if (priceRange) {
                    queryConstraints.push(where('price', '>=', priceRange[0]));
                    queryConstraints.push(where('price', '<=', priceRange[1]));
                }
            } else if (filters.days) {
                let daysRange = null;
                if (filters.days === '1-3') {
                    daysRange = [1, 3];
                } else if (filters.days === '4-7') {
                    daysRange = [4, 7];
                } else if (filters.days === '8+') {
                    daysRange = [8, Number.MAX_SAFE_INTEGER];
                }
                if (daysRange) {
                    queryConstraints.push(where('days', '>=', daysRange[0]));
                    queryConstraints.push(where('days', '<=', daysRange[1]));
                }
            }

            packagesQuery = query(packagesCollection, ...queryConstraints);

            const packageSnapshot = await getDocs(packagesQuery);
            const packagesList = packageSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPackages(packagesList);
        } catch (error) {
            console.error('Error fetching packages:', error);
            toast.error('Failed to fetch packages. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Searching with filters:', filters);
        fetchPackages(filters);
    };

    return (
        <>
            {/* ***** Breadcumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcumb Area End ***** */}


            {/* Explore Area */}
            <section className="dorne-explore-area d-md-flex">
                {/* Explore Search Area */}
                <div className="row mx-2">
                    <div className="col-12 col-md-4 col-lg-4 mt-md-5 mt-sm-0 mb-3">
                        {/* Explore Search Form */}
                        <div className="explore-search-form w-100">
                            <h6>What are you looking for?</h6>
                            <form onSubmit={handleSubmit}>
                                {/* City Filter */}
                                <select
                                    className="custom-select col-12 mb-3"
                                    name="city"
                                    value={filters.city}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Days Filter */}
                                <select
                                    className="custom-select col-12 mb-3"
                                    name="days"
                                    value={filters.days}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select No. of Days</option>
                                    <option value="1-3">1-3 Days</option>
                                    <option value="4-7">4-7 Days</option>
                                    <option value="8+">8+ Days</option>
                                </select>

                                {/* Price Range Filter */}
                                <select
                                    className="custom-select col-12 mb-3"
                                    name="priceRange"
                                    value={filters.priceRange}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Price Range</option>
                                    <option value="₹5000-9999">₹5,000 - ₹9,999</option>
                                    <option value="₹10000-49999">₹10,000 - ₹49,999</option>
                                    <option value="₹50000+">₹50,000+</option>
                                </select>

                                {/* No. of People */}
                                <div className="form-group mt-3 text-light">
                                    <label>Number of People</label>
                                    <div className="row mt-0">
                                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                                            <label className="custom-control custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="people1"
                                                    name="noOfPeople"
                                                    value="1"
                                                    onChange={handleInputChange}
                                                />
                                                <span className="custom-control-indicator"></span>
                                                <span className="custom-control-description">1</span>
                                            </label>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                                            <label className="custom-control custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="people2"
                                                    name="noOfPeople"
                                                    value="2"
                                                    onChange={handleInputChange}
                                                />
                                                <span className="custom-control-indicator"></span>
                                                <span className="custom-control-description">2</span>
                                            </label>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                                            <label className="custom-control custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="people3"
                                                    name="noOfPeople"
                                                    value="3"
                                                    onChange={handleInputChange}
                                                />
                                                <span className="custom-control-indicator"></span>
                                                <span className="custom-control-description">3</span>
                                            </label>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                                            <label className="custom-control custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="people4"
                                                    name="noOfPeople"
                                                    value="4"
                                                    onChange={handleInputChange}
                                                />
                                                <span className="custom-control-indicator"></span>
                                                <span className="custom-control-description">4</span>
                                            </label>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-4 mb-3">
                                            <label className="custom-control custom-checkbox mb-3">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="people5Plus"
                                                    name="noOfPeople"
                                                    value="5+"
                                                    onChange={handleInputChange}
                                                />
                                                <span className="custom-control-indicator"></span>
                                                <span className="custom-control-description">5+</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn dorne-btn mt-50 bg-white text-dark"><i class="fa fa-search pr-2" aria-hidden="true"></i> Search</button>
                            </form>
                        </div>
                    </div>

                    {/* Explore search result */}
                    <div className="col-12 col-md-8 col-lg-8 mt-md-5 mt-sm-0">
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                                <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />
                            </div>
                        ) : (
                            <div className="row">
                                {/* Render Packages */}
                                {packages.length > 0 ? (
                                    packages.map((pkg) => (
                                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={pkg.id}>
                                            <div className="single-features-area">
                                                <Link to={`/view/${pkg.id}`}>
                                                    <img
                                                        src={cities.find(city => city.id === pkg.cityId)?.thumbnail || pkg.image || '/assets/img/place-img/hotel-1.jpg'}
                                                        alt={pkg.packageName}
                                                        style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                                                    />
                                                    {/* Price */}
                                                    <div className="price-start">
                                                        <p>FROM ₹{pkg.price}</p>
                                                    </div>
                                                </Link>
                                                <div className="feature-content d-flex align-items-center justify-content-between">
                                                    <Link to={`/view/${pkg.id}`}>
                                                        <div className="feature-title">
                                                            <h5>{pkg.packageName}</h5>
                                                            <p>{cities.find(city => city.id === pkg.cityId)?.name}</p>
                                                            <p>{pkg.days} Days / {pkg.night} Nights</p>
                                                            <p>For {pkg.noOfPeople} People</p>
                                                            <p>Meals: {pkg.meals}</p>
                                                            <p>Features: {pkg.otherFeatures}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="feature-favourite">
                                                        <a
                                                            className="btn"
                                                            onClick={() => toggleLike(pkg.id)}
                                                        >
                                                            {likedPackages[pkg.id] ? (
                                                                <i className="fa fa-heart" aria-hidden="true" />
                                                            ) : (
                                                                <i className="fa fa-heart-o" aria-hidden="true" />
                                                            )}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12">
                                        <div className="alert alert-warning text-center" role="alert">
                                            No packages available for the selected filters.
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
