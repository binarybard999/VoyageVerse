import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, limit, where } from "firebase/firestore";
import { db } from '../../Firebase';
import { toast } from 'react-toastify';

export default function FeatureCities() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCitiesWithPackages();
    }, []);

    const fetchCitiesWithPackages = async () => {
        try {
            // Fetch only cities with 'status' set to 'Active'
            const citiesQuery = query(
                collection(db, 'cities'),
                where('status', '==', 'Active'),  // Filter cities by status in the query
                limit(4)
            );
            const citiesSnapshot = await getDocs(citiesQuery);
            const cityList = [];

            // Fetch the number of packages for each city
            for (const cityDoc of citiesSnapshot.docs) {
                const cityData = cityDoc.data();
                const cityId = cityDoc.id;

                // Query the number of packages associated with the city
                const packagesQuery = query(collection(db, 'packages'));
                const packagesSnapshot = await getDocs(packagesQuery);
                const packageCount = packagesSnapshot.docs.filter(pkg => pkg.data().cityId === cityId).length;

                cityList.push({
                    ...cityData,
                    id: cityId,
                    packageCount
                });
            }

            setCities(cityList);
        } catch (error) {
            toast.error("Error fetching cities: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ***** Editor Pick Area Start ***** */}
            <section
                className="dorne-editors-pick-area bg-img bg-overlay-9 section-padding-100"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-2.jpg)" }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-heading text-center">
                                <span />
                                <h4>Cities you must see</h4>
                                <p>Editor’s pick</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center">Loading...</div>
                        ) : (
                            cities.length > 0 ? (
                                cities.map((city, index) => (
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 mb-4" key={city.id}>
                                        <div className="single-editors-pick-area wow fadeInUp" data-wow-delay={`${0.2 + (index * 0.2)}s`}>
                                            <img src={city.thumbnail || '/assets/img/bg-img/editor-1.jpg'} alt="" className="img-fluid" />
                                            <div className="editors-pick-info">
                                                <div className="places-total-destinations d-flex justify-content-between">
                                                    <Link to={`/listing?city=${city.id}`}>{city.name}</Link>
                                                    <Link to={`/listing?city=${city.id}`}>View {city.packageCount} Destination&#40;s&#41;</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center">No cities found</div>
                            )
                        )}
                    </div>
                </div>
            </section>
            {/* ***** Editor Pick Area End ***** */}
        </>
    );
}
