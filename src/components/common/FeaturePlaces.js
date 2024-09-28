import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { db } from '../../Firebase'; // Adjust the path as necessary
import { collection, getDocs, query, limit, where } from 'firebase/firestore';
import PlaceDetailsPopup from './PlaceDetailsPopup'; // Import the new component

export default function FeaturePlaces() {
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null); // State for the selected place

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                // Fetch only active places
                const placesCollection = collection(db, 'places');
                const placesQuery = query(
                    placesCollection, 
                    where('status', '==', 'Active'), // Filter for active places
                    limit(5) // Limit to 5 places
                );
                const querySnapshot = await getDocs(placesQuery);
                const placesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPlaces(placesData);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };

        fetchPlaces();
    }, []);

    return (
        <>
            {/* ***** Features Restaurant Area Start ***** */}
            <section className="dorne-features-restaurant-area bg-default">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-heading text-center">
                                <span />
                                <h4>Featured Places</h4>
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
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                loop={true}
                                spaceBetween={20}
                                slidesPerView={5}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    480: { slidesPerView: 2 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 4 },
                                    1440: { slidesPerView: 5 },
                                }}
                            >
                                {places.map((place) => (
                                    <SwiperSlide key={place.id}>
                                        <div 
                                            className="single-features-area"
                                            onClick={() => setSelectedPlace(place.id)} // Set selected place ID
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={place.image}
                                                alt={place.name}
                                                className="img-fluid"
                                                style={{ height: '300px', objectFit: 'cover' }} // Adjust height as needed
                                            />
                                            <div className="ratings-map-area d-flex">
                                                <a href="#">8.5</a>
                                                <a href="#">
                                                    <img src="/assets/img/core-img/map.png" alt="Map" />
                                                </a>
                                            </div>
                                            <div className="feature-content d-flex align-items-center justify-content-between">
                                                <div className="feature-title">
                                                    <h5>{place.name}</h5>
                                                    <p>{place.cityName}</p>
                                                </div>
                                                <div className="feature-favourite">
                                                    <a href="#">
                                                        <i className="fa fa-heart-o" aria-hidden="true" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
            {/* ***** Features Restaurant Area End ***** */}

            {/* Place Details Popup */}
            {selectedPlace && (
                <PlaceDetailsPopup placeId={selectedPlace} onClose={() => setSelectedPlace(null)} />
            )}
        </>
    );
}
