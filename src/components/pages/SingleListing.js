// export default function SingleListing() {

//     return (

//         <>
//             {/* ***** Breadcumb Area Start ***** */}
//             <div
//                 className="breadcumb-area height-700 bg-img bg-overlay"
//                 style={{ backgroundImage: "url(/assets/img/bg-img/breadcumb.jpg)" }}
//             >
//                 <div className="container">
//                     <div className="row">
//                         <div className="col-12">
//                             <div className="breadcumb-content">
//                                 <div className="map-ratings-review-area d-flex">
//                                     <a
//                                         href="#"
//                                         className="d-flex align-items-center justify-content-center"
//                                     >
//                                         <img src="/assets/img/core-img/map.png" alt="" />
//                                     </a>
//                                     <a href="#">8.7</a>
//                                     <a href="#">Write a review</a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* ***** Breadcumb Area End ***** */}


//             {/* ***** Single Listing Area Start ***** */}
//             <section className="dorne-single-listing-area section-padding-100">
//                 <div className="container">
//                     <div className="row justify-content-center">
//                         {/* Single Listing Content */}
//                         <div className="col-12 col-lg-8">
//                             <div className="single-listing-content">
//                                 <div className="listing-title">
//                                     <h4>Burger House soho</h4>
//                                     <h6>First Avenue no 83</h6>
//                                 </div>
//                                 <div className="single-listing-nav">
//                                     <nav>
//                                         <ul id="listingNav">
//                                             <li className="active">
//                                                 <a href="#overview">Overview</a>
//                                             </li>
//                                             <li>
//                                                 <a href="#menu">Menu</a>
//                                             </li>
//                                             <li>
//                                                 <a href="#review">Reviews</a>
//                                             </li>
//                                             <li>
//                                                 <a href="#lomap">Location on map</a>
//                                             </li>
//                                         </ul>
//                                     </nav>
//                                 </div>
//                                 <div className="overview-content mt-50" id="overview">
//                                     <p>
//                                         Burger House Soho is a culinary haven for burger enthusiasts. Located in the heart of London’s vibrant Soho district, it offers a delectable menu featuring handmade burgers crafted with prime quality chopped meat. Sink your teeth into juicy patties served on soft potato buns, perfectly complemented by their special sauce. If you’re craving more than just burgers, explore their buttermilk fried chicken and signature cocktails. Whether you’re grabbing a quick lunch or enjoying a leisurely dinner, Burger House Soho promises a delightful dining experience.
//                                     </p>
//                                     <div className="row mt-5">
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Accepts Credit Cards
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Bike Parking
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Wireless Internet
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Reservations
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Privat Parking
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Smoking Area
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">
//                                                     Wheelchair Accesible
//                                                 </span>
//                                             </label>
//                                         </div>
//                                         <div className="col-6">
//                                             <label className="custom-control custom-checkbox mb-3">
//                                                 <input type="checkbox" className="custom-control-input" />
//                                                 <span className="custom-control-indicator" />
//                                                 <span className="custom-control-description">Coupons</span>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="listing-menu-area mt-100" id="menu">
//                                     <h4>Menu</h4>
//                                     {/* Single Listing Menu */}
//                                     <div className="single-listing-menu d-flex justify-content-between">
//                                         {/* Listing Menu Title */}
//                                         <div className="listing-menu-title">
//                                             <h6>Classic Burger</h6>
//                                             <p>
//                                                 Beef, salad, mustard, bacon, mayonnaise, spicey relish,
//                                                 cheese
//                                             </p>
//                                         </div>
//                                         {/* Listing Menu Price */}
//                                         <div className="listing-menu-price">
//                                             <h6>₹799</h6>
//                                         </div>
//                                     </div>
//                                     {/* Single Listing Menu */}
//                                     <div className="single-listing-menu d-flex justify-content-between">
//                                         {/* Listing Menu Title */}
//                                         <div className="listing-menu-title">
//                                             <h6>House Special Burger</h6>
//                                             <p>
//                                                 Beef, salad, mustard, bacon, mayonnaise, spicey relish,
//                                                 cheese
//                                             </p>
//                                         </div>
//                                         {/* Listing Menu Price */}
//                                         <div className="listing-menu-price">
//                                             <h6>₹799</h6>
//                                         </div>
//                                     </div>
//                                     {/* Single Listing Menu */}
//                                     <div className="single-listing-menu d-flex justify-content-between">
//                                         {/* Listing Menu Title */}
//                                         <div className="listing-menu-title">
//                                             <h6>Classic Burger</h6>
//                                             <p>
//                                                 Beef, salad, mustard, bacon, mayonnaise, spicey relish,
//                                                 cheese
//                                             </p>
//                                         </div>
//                                         {/* Listing Menu Price */}
//                                         <div className="listing-menu-price">
//                                             <h6>₹799</h6>
//                                         </div>
//                                     </div>
//                                     {/* Single Listing Menu */}
//                                     <div className="single-listing-menu d-flex justify-content-between">
//                                         {/* Listing Menu Title */}
//                                         <div className="listing-menu-title">
//                                             <h6>House Special Burger</h6>
//                                             <p>
//                                                 Beef, salad, mustard, bacon, mayonnaise, spicey relish,
//                                                 cheese
//                                             </p>
//                                         </div>
//                                         {/* Listing Menu Price */}
//                                         <div className="listing-menu-price">
//                                             <h6>₹799</h6>
//                                         </div>
//                                     </div>
//                                     <a href="#" className="btn dorne-btn mt-50">
//                                         + See The Menu
//                                     </a>
//                                 </div>
//                                 <div className="listing-reviews-area mt-100" id="review">
//                                     <h4>reviews</h4>
//                                     <div className="single-review-area">
//                                         <div className="reviewer-meta d-flex align-items-center">
//                                             <img src="/assets/img/clients-img/1.jpg" alt="" />
//                                             <div className="reviewer-content">
//                                                 <div className="review-title-ratings d-flex justify-content-between">
//                                                     <h5>“The best Burger in town”</h5>
//                                                     <div className="ratings">
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                     </div>
//                                                 </div>
//                                                 <p>
//                                                     Oh, where do I begin? The patties were thick, juicy, and cooked to perfection. I opted for the classic cheeseburger, and it was like a flavor explosion in my mouth. The secret sauce—oh, that secret sauce!—added a tangy kick that left me craving more.
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         <div className="reviewer-name">
//                                             <h6>Christinne Smith</h6>4
//                                             <p>3 August 2024</p>
//                                         </div>
//                                     </div>
//                                     <div className="single-review-area">
//                                         <div className="reviewer-meta d-flex align-items-center">
//                                             <img src="/assets/img/bg-img/event-1.jpg" alt="" />
//                                             <div className="reviewer-content">
//                                                 <div className="review-title-ratings d-flex justify-content-between">
//                                                     <h5>“Quality ingredients”</h5>
//                                                     <div className="ratings">
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-fill.png" alt="" />
//                                                         <img src="/assets/img/clients-img/star-unfill.png" alt="" />
//                                                     </div>
//                                                 </div>
//                                                 <p>
//                                                     Crispy fries, seasoned to perfection. Pair them with a milkshake, and you’re in foodie heaven. Burger House Soho knows how to satisfy cravings!
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         <div className="reviewer-name">
//                                             <h6>Michael Brown</h6>
//                                             <p>24 July 2024</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="location-on-map mt-50" id="lomap">
//                                     <h4>Location on map</h4>
//                                     <div className="location-map">
//                                         <div id="locationMap" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Listing Sidebar */}
//                         <div className="col-12 col-md-8 col-lg-4">
//                             <div className="listing-sidebar">
//                                 {/* Listing Verify */}
//                                 <div className="listing-verify">
//                                     <a href="#" className="btn dorne-btn w-100">
//                                         <i className="fa fa-check pr-3" /> Verified Listing
//                                     </a>
//                                 </div>
//                                 {/* Book A Table Widget */}
//                                 <div className="book-a-table-widget mt-50">
//                                     <h6>Book A Table</h6>
//                                     <form action="#" method="get">
//                                         <select className="custom-select" id="destinations">
//                                             <option selected="">Who will be arriving</option>
//                                             <option value={1}>New York</option>
//                                             <option value={2}>Latvia</option>
//                                             <option value={3}>Dhaka</option>
//                                             <option value={4}>Melbourne</option>
//                                             <option value={5}>London</option>
//                                         </select>
//                                         <select className="custom-select" id="catagories">
//                                             <option selected="">Guest 1</option>
//                                             <option value={1}>Guest 2</option>
//                                             <option value={3}>Guest 3</option>
//                                             <option value={3}>Guest 4</option>
//                                         </select>
//                                         <button
//                                             type="submit"
//                                             className="btn dorne-btn bg-white text-dark"
//                                         >
//                                             <i className="fa fa-search pr-2" aria-hidden="true" /> Search
//                                         </button>
//                                     </form>
//                                 </div>
//                                 {/* Opening Hours Widget */}
//                                 <div className="opening-hours-widget mt-50">
//                                     <h6>Opening Hours</h6>
//                                     <ul className="opening-hours">
//                                         <li>
//                                             <p>Monday</p>
//                                             <p>Closed</p>
//                                         </li>
//                                         <li>
//                                             <p>Tuesday</p>
//                                             <p>9 AM - 1 PM</p>
//                                         </li>
//                                         <li>
//                                             <p>Wednesday</p>
//                                             <p>9 AM - 1 PM</p>
//                                         </li>
//                                         <li>
//                                             <p>Thursday</p>
//                                             <p>9 AM - 1 PM</p>
//                                         </li>
//                                         <li>
//                                             <p>Friday</p>
//                                             <p>9 AM - 1 PM</p>
//                                         </li>
//                                         <li>
//                                             <p>Saturday</p>
//                                             <p>9 AM - 1 PM</p>
//                                         </li>
//                                         <li>
//                                             <p>Sunday</p>
//                                             <p>9 AM - 1 PM</p>
//                                         </li>
//                                     </ul>
//                                 </div>
//                                 {/* Author Widget */}
//                                 <div className="author-widget mt-50 d-flex align-items-center">
//                                     <img src="/assets/img/clients-img/1.jpg" alt="" />
//                                     <div className="authors-name">
//                                         <a href="#">James Smith</a>
//                                         <p>The Author</p>
//                                     </div>
//                                 </div>
//                                 {/* Contact Form */}
//                                 <div className="contact-form contact-form-widget mt-50">
//                                     <h6>Contact Business</h6>
//                                     <form action="#">
//                                         <div className="row">
//                                             <div className="col-12">
//                                                 <input
//                                                     type="text"
//                                                     name="name"
//                                                     className="form-control"
//                                                     placeholder="Your Name"
//                                                 />
//                                             </div>
//                                             <div className="col-12">
//                                                 <input
//                                                     type="email"
//                                                     name="email"
//                                                     className="form-control"
//                                                     placeholder="Email Address"
//                                                 />
//                                             </div>
//                                             <div className="col-12">
//                                                 <textarea
//                                                     name="message"
//                                                     className="form-control"
//                                                     id="Message"
//                                                     cols={30}
//                                                     rows={10}
//                                                     placeholder="Your Message"
//                                                     defaultValue={""}
//                                                 />
//                                             </div>
//                                             <div className="col-12">
//                                                 <button type="submit" className="btn dorne-btn">
//                                                     Send
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             {/* ***** Single Listing Area End ***** */}
//         </>

//     );
// }



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase'; // Ensure this path is correct
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function SingleListing() {
    const { id } = useParams(); // Get package ID from URL
    const [packageData, setPackageData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ title: '', rating: '', comment: '' });
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await fetchPackageData();
            await fetchReviews();
        };
        fetchData();
    }, [id]);
    
    const fetchPackageData = async () => {
        try {
            const docRef = doc(db, 'packages', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPackageData(docSnap.data());
            } else {
                toast.error("Package not found!");
            }
        } catch (error) {
            toast.error("Error fetching package data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const reviewsCollection = collection(db, 'packages', id, 'reviews');
            const reviewSnapshot = await getDocs(reviewsCollection);
            const reviewsList = reviewSnapshot.docs.map(doc => doc.data());
            setReviews(reviewsList);
        } catch (error) {
            toast.error("Error fetching reviews: " + error.message);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            const reviewsCollection = collection(db, 'packages', id, 'reviews');
            await addDoc(reviewsCollection, {
                ...newReview,
                date: new Date().toISOString().split('T')[0],
            });
            toast.success("Review submitted successfully!");
            setNewReview({ title: '', rating: '', comment: '' });
            fetchReviews(); // Refresh the reviews list
        } catch (error) {
            toast.error("Error submitting review: " + error.message);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <ClipLoader size={80} color={"#123abc"} loading={loading} />
            </div>
        );
    }

    return (
        <>
            {/* ***** Breadcrumb Area Start ***** */}
            <div
                className="breadcumb-area height-700 bg-img bg-overlay"
                style={{ backgroundImage: `url(${packageData?.cityThumbnail || '/assets/img/bg-img/breadcumb.jpg'})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="breadcumb-content">
                                <div className="map-ratings-review-area d-flex">
                                    <a
                                        href="#"
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <img src="/assets/img/core-img/map.png" alt="" />
                                    </a>
                                    <a href="#">8.7</a>
                                    <a href="#review">Write a review</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ***** Breadcrumb Area End ***** */}

            {/* ***** Single Listing Area Start ***** */}
            <section className="dorne-single-listing-area section-padding-100">
                <div className="container">
                    <div className="row justify-content-center">
                        {/* Single Listing Content */}
                        <div className="col-12 col-lg-8">
                            <div className="single-listing-content">
                                <div className="listing-title">
                                    <h4>{packageData?.packageName}</h4>
                                    <h6>{packageData?.city}</h6>
                                </div>
                                <div className="single-listing-nav">
                                    <nav>
                                        <ul id="listingNav">
                                            <li className="active">
                                                <a href="#overview">Overview</a>
                                            </li>
                                            <li>
                                                <a href="#review">Reviews</a>
                                            </li>
                                            <li>
                                                <a href="#lomap">Location on map</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="overview-content mt-50" id="overview">
                                    <p>{packageData?.description}</p>
                                    <p><strong>Price:</strong> ₹{packageData?.price}</p>
                                    <p><strong>Days:</strong> {packageData?.days}, <strong>Nights:</strong> {packageData?.night}</p>
                                    <p><strong>Meals:</strong> {packageData?.meals}</p>
                                    <p><strong>Features:</strong> {packageData?.otherFeatures}</p>
                                </div>

                                <div className="listing-reviews-area mt-100" id="review">
                                    <h4>Reviews</h4>
                                    {reviews.length > 0 ? (
                                        reviews.map((review, index) => (
                                            <div className="single-review-area" key={index}>
                                                <div className="reviewer-meta d-flex align-items-center">
                                                    <img src="/assets/img/clients-img/1.jpg" alt="" />
                                                    <div className="reviewer-content">
                                                        <div className="review-title-ratings d-flex justify-content-between">
                                                            <h5>{review.title}</h5>
                                                            <div className="ratings">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <img
                                                                        key={i}
                                                                        src={`/assets/img/clients-img/${i < review.rating ? 'star-fill' : 'star-unfill'}.png`}
                                                                        alt="star"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p>{review.comment}</p>
                                                    </div>
                                                </div>
                                                <div className="reviewer-name">
                                                    <h6>{review.name || 'Anonymous'}</h6>
                                                    <p>{review.date}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No reviews yet. Be the first to review!</p>
                                    )}
                                    <form onSubmit={handleReviewSubmit} className="mt-4">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Title"
                                                value={newReview.title}
                                                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                value={newReview.rating}
                                                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                                                required
                                            >
                                                <option value="" disabled>Rating</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                rows="5"
                                                placeholder="Your review"
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn dorne-btn" disabled={reviewLoading}>
                                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* Listing Sidebar */}
                        <div className="col-12 col-md-8 col-lg-4">
                            <div className="listing-sidebar">
                                {/* Listing Verify */}
                                <div className="listing-verify">
                                    <a href="#" className="btn dorne-btn w-100">
                                        <i className="fa fa-check pr-3" /> Verified Listing
                                    </a>
                                </div>
                                {/* Book A Table Widget */}
                                <div className="book-a-table-widget mt-50">
                                    <h6>Book A Table</h6>
                                    <form action="#" method="get">
                                        <select className="custom-select" id="destinations">
                                            <option selected="">Who will be arriving</option>
                                            <option value={1}>New York</option>
                                            <option value={2}>Latvia</option>
                                            <option value={3}>Dhaka</option>
                                            <option value={4}>Melbourne</option>
                                            <option value={5}>London</option>
                                        </select>
                                        <select className="custom-select" id="catagories">
                                            <option selected="">Guest 1</option>
                                            <option value={1}>Guest 2</option>
                                            <option value={3}>Guest 3</option>
                                            <option value={3}>Guest 4</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className="btn dorne-btn bg-white text-dark"
                                        >
                                            <i className="fa fa-search pr-2" aria-hidden="true" /> Search
                                        </button>
                                    </form>
                                </div>
                                {/* Opening Hours Widget */}
                                <div className="opening-hours-widget mt-50">
                                    <h6>Opening Hours</h6>
                                    <ul className="opening-hours">
                                        <li>
                                            <p>Monday</p>
                                            <p>Closed</p>
                                        </li>
                                        <li>
                                            <p>Tuesday</p>
                                            <p>9 AM - 1 PM</p>
                                        </li>
                                        <li>
                                            <p>Wednesday</p>
                                            <p>9 AM - 1 PM</p>
                                        </li>
                                        <li>
                                            <p>Thursday</p>
                                            <p>9 AM - 1 PM</p>
                                        </li>
                                        <li>
                                            <p>Friday</p>
                                            <p>9 AM - 1 PM</p>
                                        </li>
                                        <li>
                                            <p>Saturday</p>
                                            <p>9 AM - 1 PM</p>
                                        </li>
                                        <li>
                                            <p>Sunday</p>
                                            <p>9 AM - 1 PM</p>
                                        </li>
                                    </ul>
                                </div>
                                {/* Author Widget */}
                                <div className="author-widget mt-50 d-flex align-items-center">
                                    <img src="/assets/img/clients-img/1.jpg" alt="" />
                                    <div className="authors-name">
                                        <a href="#">James Smith</a>
                                        <p>The Author</p>
                                    </div>
                                </div>
                                {/* Contact Form */}
                                <div className="contact-form contact-form-widget mt-50">
                                    <h6>Contact Business</h6>
                                    <form action="#">
                                        <div className="row">
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Email Address"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <textarea
                                                    name="message"
                                                    className="form-control"
                                                    id="Message"
                                                    cols={30}
                                                    rows={10}
                                                    placeholder="Your Message"
                                                    defaultValue={""}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button type="submit" className="btn dorne-btn">
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* ***** Single Listing Area End ***** */}
        </>
    );
}
