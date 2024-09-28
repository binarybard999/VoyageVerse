import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { db } from '../../Firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function FeatureDestinations() {
    const [packages, setPackages] = useState([]);
    const [cityImages, setCityImages] = useState({});

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                // Query for active packages only
                const packagesCollection = collection(db, 'packages');
                const activePackagesQuery = query(packagesCollection, where('status', '==', 'Active'),);
                const packageSnapshot = await getDocs(activePackagesQuery);
                const packagesList = packageSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPackages(packagesList);

                // Fetch city images
                const cityIds = [...new Set(packagesList.map(pkg => pkg.cityId))];
                const cityImagesPromises = cityIds.map(async (cityId) => {
                    const cityDocRef = doc(db, 'cities', cityId);
                    const cityDocSnap = await getDoc(cityDocRef);
                    if (cityDocSnap.exists()) {
                        return { [cityId]: cityDocSnap.data().thumbnail };
                    }
                    return null;
                });

                const images = await Promise.all(cityImagesPromises);
                const imagesMap = images.reduce((acc, curr) => ({ ...acc, ...curr }), {});
                setCityImages(imagesMap);
            } catch (error) {
                console.error("Error fetching packages or city images: ", error);
            }
        };

        fetchPackages();
    }, []);

    return (
        <>
            {/* ***** Features Destinations Area Start ***** */}
            <section className="dorne-features-destinations-area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-heading dark text-center">
                                <span></span>
                                <h4>Featured Destinations</h4>
                                <p>Editor’s pick</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                navigation
                                pagination={{ clickable: true }}
                                spaceBetween={30}
                                slidesPerView={4}
                                loop={true}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    480: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1200: { slidesPerView: 4 },
                                }}
                            >
                                {packages.slice(0, 7).map((pkg) => (
                                    <SwiperSlide key={pkg.id}>
                                        <Link to={`/view/${pkg.id}`}>
                                            <div className="single-features-area">
                                                <img
                                                    src={cityImages[pkg.cityId] || '/assets/img/bg-img/feature-default.jpg'}
                                                    alt={pkg.packageName}
                                                    className="img-fluid rounded-5"
                                                />
                                                <div className="price-start">
                                                    <p>FROM ₹{pkg.price}</p>
                                                </div>
                                                <div className="feature-content d-flex align-items-center justify-content-between">
                                                    <div className="feature-title">
                                                        <h5>{pkg.packageName}</h5>
                                                        <p>{pkg.cityName}</p>
                                                    </div>
                                                    <div className="feature-favourite">
                                                        <a href="#"><i className="fa fa-heart-o" aria-hidden="true"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
            {/* ***** Features Destinations Area End ***** */}
        </>
    );
}
