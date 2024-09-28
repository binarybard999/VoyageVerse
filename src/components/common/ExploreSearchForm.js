import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase'; // Adjust the path as necessary

export default function ExploreSearchForm() {
    const [cities, setCities] = useState([]);
    const [filters, setFilters] = useState({
        city: '',
        days: '',
        priceRange: '',
    });

    useEffect(() => {
        // Fetch cities from Firestore
        const fetchCities = async () => {
            try {
                const citiesSnapshot = await getDocs(collection(db, 'cities'));
                const citiesData = citiesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCities(citiesData);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };
        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Searching with filters:', filters);
    };

    return (
        <>
            <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center">
                    <div className="col-12 col-md-10">
                        <div className="hero-content">
                            <h2>Discover places near you</h2>
                            <h4>This is the best guide of your city</h4>
                        </div>
                        {/* Hero Search Form */}
                        <div className="hero-search-form">
                            {/* Tabs */}
                            {/* <div className="nav nav-tabs" id="heroTab" role="tablist">
                                <a
                                    className="nav-item nav-link active"
                                    id="nav-places-tab"
                                    data-toggle="tab"
                                    href="#nav-places"
                                    role="tab"
                                    aria-controls="nav-places"
                                    aria-selected="true"
                                >
                                    Packages
                                </a>
                            </div> */}
                            {/* Tabs Content */}
                            <div className="tab-content" id="nav-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="nav-places"
                                    role="tabpanel"
                                    aria-labelledby="nav-places-tab"
                                >
                                    <h6>What Package are you looking for?</h6>
                                    <form onSubmit={handleSubmit}>
                                        {/* City Filter */}
                                        <select
                                            className="custom-select"
                                            name="city"
                                            value={filters.city}
                                            onChange={handleInputChange}
                                            required
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
                                            className="custom-select"
                                            name="days"
                                            value={filters.days}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select No. of Days</option>
                                            <option value="1-3">1-3 Days</option>
                                            <option value="4-7">4-7 Days</option>
                                            <option value="8+">8+ Days</option>
                                        </select>

                                        {/* Price Range Filter */}
                                        <select
                                            className="custom-select"
                                            name="priceRange"
                                            value={filters.priceRange}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Price Range</option>
                                            <option value="₹5000-9999">₹5,000 - ₹9,999</option>
                                            <option value="₹10000-49999">₹10,000 - ₹49,999</option>
                                            <option value="₹50000+">₹50,000+</option>
                                        </select>
                                        <button type="submit" className="btn dorne-btn">
                                            <i className="fa fa-search pr-2" aria-hidden="true" /> Search
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
