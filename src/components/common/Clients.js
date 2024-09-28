import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function Clients() {
    return (
        <>
            {/* ***** Clients Area Start ***** */}
            <div className="dorne-clients-area section-padding-100">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]} // Swiper modules used
                                // navigation  // Enables navigation (prev/next buttons)
                                // pagination={{ clickable: true }}  // Enables pagination dots
                                autoplay={{ delay: 2000, disableOnInteraction: false }}  // Enables autoplay
                                loop={true}  // Enables infinite looping
                                spaceBetween={30}  // Space between logos
                                slidesPerView={5}  // Default number of slides
                                breakpoints={{
                                    320: { slidesPerView: 2 },  // 2 logos on small screens
                                    768: { slidesPerView: 3 },  // 3 logos on tablets
                                    1024: { slidesPerView: 4 },  // 4 logos on small laptops
                                    1440: { slidesPerView: 5 },  // 5 logos on large screens
                                }}
                            >
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
                                        alt="Airbnb"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                        alt="Amazon"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                                        alt="Google"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                        alt="Facebook"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                                        alt="Microsoft"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                        alt="Apple"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                                        alt="Netflix"
                                        style={{ height: '50px', objectFit: 'contain' }}
                                    />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            {/* ***** Clients Area End ***** */}
        </>
    );
}
