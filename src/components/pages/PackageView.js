import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoc, addDoc, doc, collection, getDocs, query, limit, updateDoc, arrayUnion, where, Timestamp } from 'firebase/firestore';
import { db } from '../../Firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';

export default function PackageView() {
    const { id } = useParams(); // Get package ID from URL
    const [packageData, setPackageData] = useState(null);
    const [packages, setPackages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ title: '', rating: '', comment: '' });
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [cityThumbnails, setCityThumbnails] = useState({});
    const [defaultImage, setDefaultImage] = useState('/assets/img/clients-img/default_profile_pic.png'); // Default profile image
    const [isBooked, setIsBooked] = useState(false); // Track if the package is already booked
    const [bookingDate, setBookingDate] = useState(null); // State to store the selected booking date
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPackageData();
        fetchPackages();
        fetchReviews();
        checkIfBooked(); // Check if the package is already booked
    }, [id]);

    const fetchPackageData = async () => {
        try {
            const docRef = doc(db, 'packages', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setPackageData(data);
                // Fetch city thumbnail for the current package
                if (data.cityId) {
                    const cityDocRef = doc(db, 'cities', data.cityId);
                    const cityDocSnap = await getDoc(cityDocRef);
                    if (cityDocSnap.exists()) {
                        setCityThumbnails(prevThumbnails => ({
                            ...prevThumbnails,
                            [data.cityId]: cityDocSnap.data().thumbnail
                        }));
                    }
                }
            } else {
                toast.error("Package not found!");
            }
        } catch (error) {
            toast.error("Error fetching package data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPackages = async () => {
        try {
            const packagesQuery = query(
                collection(db, 'packages'),
                limit(10) // Fetch a maximum of 10 packages to then filter
            );
            const packageSnapshot = await getDocs(packagesQuery);
            const packagesList = packageSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Fetch city thumbnails for all packages
            const cityIds = [...new Set(packagesList.map(pkg => pkg.cityId))];
            const cityThumbnailsPromises = cityIds.map(async (cityId) => {
                const cityDocRef = doc(db, 'cities', cityId);
                const cityDocSnap = await getDoc(cityDocRef);
                if (cityDocSnap.exists()) {
                    return { [cityId]: cityDocSnap.data().thumbnail };
                }
                return null;
            });

            const thumbnails = await Promise.all(cityThumbnailsPromises);
            const thumbnailsMap = thumbnails.reduce((acc, curr) => ({ ...acc, ...curr }), {});

            setCityThumbnails(thumbnailsMap);
            setPackages(packagesList);
        } catch (error) {
            toast.error("Error fetching packages: " + error.message);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in by fetching from sessionStorage
        const email = sessionStorage.getItem("email");
        const userId = sessionStorage.getItem("userId");
        const userName = sessionStorage.getItem("username");
        const userProfilePic = sessionStorage.getItem("profilePic"); // Fetch the user's profile picture URL

        // Redirect to login if email or userId is not found in sessionStorage
        if (!email || !userId) {
            toast.error("Please log in to write a review.");
            navigate("/login");
            return;
        }

        setReviewLoading(true); // Show loading state while review is being submitted

        try {
            // Add the new review to the 'reviews' collection
            const reviewsCollection = collection(db, 'reviews');
            const reviewRef = await addDoc(reviewsCollection, {
                ...newReview,
                date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                userId: userId, // Fetched from sessionStorage
                userName: userName || 'Anonymous', // Fetched from sessionStorage
                userImage: userProfilePic || defaultImage, // Use user's profile picture or default image
                packageId: id, // Assuming 'id' is the ID of the current package
                packageName: packageData.packageName // Assuming 'packageName' is the name of the current package
            });

            // Get the review ID (generated automatically by Firestore)
            const reviewId = reviewRef.id;

            // Update the same review document to store the reviewId
            await updateDoc(reviewRef, {
                reviewId: reviewId // Store the reviewId in the same document
            });

            // Store the reviewId in the package's document in an array field
            const packageDocRef = doc(db, 'packages', id);
            await updateDoc(packageDocRef, {
                reviews: arrayUnion(reviewId) // Add the new reviewId to the package's reviews array
            });

            // Store the reviewId in the user's document in an array field
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
                reviews: arrayUnion(reviewId) // Add the new reviewId to the user's reviews array
            });

            // Review submitted successfully
            toast.success("Review submitted successfully!");

            // Clear the form fields after successful submission
            setNewReview({ title: '', rating: '', comment: '' });

            // Refresh the reviews list
            fetchReviews();

        } catch (error) {
            // Handle any errors during review submission
            toast.error("Error submitting review: " + error.message);
        } finally {
            setReviewLoading(false); // Hide loading state
        }
    };

    const fetchReviews = async () => {
        try {
            // Fetch the package document to get the review IDs
            const packageDocRef = doc(db, 'packages', id);
            const packageSnapshot = await getDoc(packageDocRef);

            if (packageSnapshot.exists()) {
                const packageData = packageSnapshot.data();
                const reviewIds = packageData.reviews || []; // Get the array of review IDs

                // Fetch the review details from the 'reviews' collection based on the review IDs
                const reviewPromises = reviewIds.map(reviewId => {
                    const reviewDocRef = doc(db, 'reviews', reviewId);
                    return getDoc(reviewDocRef);
                });

                // Resolve all review promises
                const reviewDocs = await Promise.all(reviewPromises);
                const reviewsList = reviewDocs.map(doc => ({
                    ...doc.data(),
                    id: doc.id // Include the review ID
                }));

                setReviews(reviewsList);
            } else {
                setReviews([]); // No reviews found
            }

        } catch (error) {
            toast.error("Error fetching reviews: " + error.message);
        }
    };

    const checkIfBooked = async () => {
        const userEmail = sessionStorage.getItem("email");
        const userId = sessionStorage.getItem("userId");

        if (userEmail && userId) {
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();

                    if (userData.bookedPackages) {
                        const currentDate = Timestamp.now();

                        // Loop through all bookedPackageIds in the user's data
                        for (const bookingId of userData.bookedPackages) {
                            const bookingDocRef = doc(db, 'bookings', bookingId);
                            const bookingDocSnap = await getDoc(bookingDocRef);

                            if (bookingDocSnap.exists()) {
                                const bookingData = bookingDocSnap.data();

                                // Check if the current package is booked and the date has not passed
                                if (bookingData.packageId === id && bookingData.bookingDate >= currentDate) {
                                    setIsBooked(true);
                                    return; // Exit once we find a booked package
                                }
                            }
                        }

                        // If no valid booking is found for this package, mark as not booked
                        setIsBooked(false);
                    } else {
                        setIsBooked(false); // No booked packages at all
                    }
                }
            } catch (error) {
                console.error("Error checking booking status:", error);
            }
        }
    };

    const handleBooking = async () => {
        const userEmail = sessionStorage.getItem("email");
        const userId = sessionStorage.getItem("userId");

        if (!userEmail || !userId) {
            toast.error("Please log in to book a package.");
            navigate("/login");
            return;
        }

        if (isBooked) {
            toast.info("You have already booked this package.");
            return;
        }

        if (!bookingDate) {
            toast.error("Please select a booking date.");
            return;
        }

        try {
            const bookingData = {
                packageId: id,
                packageName: packageData?.packageName,
                userId: userId, // User ID from sessionStorage
                userEmail: userEmail, // Email from sessionStorage
                bookingDate: Timestamp.fromDate(new Date(bookingDate)), // Firestore Timestamp
                createdAt: Timestamp.now(), // Current timestamp
                status: "pending" // Default status
            };

            // Create a new booking in the 'bookings' collection
            const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);

            const bookingId = bookingRef.id;

            // Update the 'bookings' document to include the bookingId
            await updateDoc(bookingRef, {
                bookingId: bookingId
            });

            // Store only the bookingId in the user's 'bookedPackages' array field
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
                bookedPackages: arrayUnion(bookingId) // Only store the bookingId
            });

            // Update the state to mark the package as booked
            setIsBooked(true);

            toast.success("Package booked successfully!");

        } catch (error) {
            toast.error("Error booking package: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <ClipLoader size={80} color={"#7643ea"} loading={loading} />
            </div>
        );
    }

    return (
        <>
            {/* ***** Breadcrumb Area Start ***** */}
            <div
                className="breadcumb-area height-700 bg-img bg-overlay"
                style={{ backgroundImage: `url(${cityThumbnails[packageData?.cityId] || packageData?.image || '/assets/img/place-img/hotel-1.jpg'})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="breadcumb-content">
                                <div className="map-ratings-review-area d-flex">
                                    <a href="#" className="d-flex align-items-center justify-content-center">
                                        <img src="/assets/img/core-img/map.png" alt="" />
                                    </a>
                                    <a href="#">8.7</a>
                                    <a href="#review">Reviews</a>
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
                                <div className="listing-title mb-4">
                                    <h4>{packageData?.packageName}</h4>
                                    <h6>{packageData?.cityName}</h6>
                                </div>
                                <div className="overview-content" id="overview">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card mb-4">
                                                <div className="card-body">
                                                    <h5 className="card-title">Package Details</h5>
                                                    <p className="card-text"><strong>Price:</strong> ₹{packageData?.price}</p>
                                                    <p className="card-text"><strong>Days:</strong> {packageData?.days}</p>
                                                    <p className="card-text"><strong>Nights:</strong> {packageData?.night}</p>
                                                    <p className="card-text"><strong>Meals:</strong> {packageData?.meals}</p>
                                                    <p className="card-text"><strong>No. of People:</strong> {packageData?.noOfPeople}</p>
                                                    <p className="card-text"><strong>Features:</strong> {packageData?.otherFeatures}</p>
                                                    <p className="card-text"><strong>Description:</strong> {packageData?.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="review-area" id="review">
                                    <h5 className="mb-4">Reviews</h5>
                                    {reviews.length > 0 ? (
                                        reviews.map((review, index) => (
                                            <div className="single-review-area" key={review.id || index}>
                                                <div className="reviewer-meta d-flex align-items-center">
                                                    <img src={review.userImage || defaultImage} alt="Reviewer" />
                                                    <div className="reviewer-content">
                                                        <div className="review-title-ratings d-flex justify-content-between">
                                                            <h5>{review.title} &nbsp;</h5>
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
                                                    <h6>{review.userName}</h6>
                                                    <p>{review.date}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No reviews yet. Be the first to review!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Listing Sidebar */}
                        <div className="col-12 col-md-8 col-lg-4">
                            <div className="listing-sidebar">

                                {/* Booking Section */}
                                <div className="booking-section">
                                    {/* Date Input Field */}
                                    <div className="booking-date-input mt-4">
                                        <label htmlFor="bookingDate">Select Booking Date:</label>
                                        <input
                                            type="date"
                                            id="bookingDate"
                                            className="form-control"
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)} // Update bookingDate state
                                            min={new Date().toISOString().split("T")[0]} // Ensure the user can only select a future date
                                            required
                                        />
                                    </div>

                                    {/* Booking Button */}
                                    <div className="booking-btn mt-4">
                                        <button
                                            className="btn dorne-btn w-100"
                                            onClick={handleBooking}
                                            disabled={isBooked || !bookingDate} // Disable if already booked or no date selected
                                        >
                                            {isBooked ? "Booked" : "Book This Package"}
                                        </button>
                                    </div>
                                </div>

                                {/* Add Review Form */}
                                <div className="add-review-form mt-4 p-4" style={{ backgroundColor: '#f3edff' }}>
                                    <h5>Add a Review</h5>
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
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Rating (1-5)"
                                                min="1"
                                                max="5"
                                                value={newReview.rating}
                                                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                className="form-control"
                                                placeholder="Comment"
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn dorne-btn w-100">
                                            {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>

                                {/* Related Packages */}
                                <div className="related-packages mt-50">
                                    <h5>Related Packages</h5>
                                    {packages
                                        .filter(pkg => pkg.id !== id) // Exclude the current package
                                        .slice(0, 3) // Limit to 3 packages
                                        .map((pkg, index) => (
                                            <div className="card mb-4" key={index}>
                                                <img className="card-img-top" src={cityThumbnails[pkg.cityId] || '/assets/img/place-img/hotel-1.jpg'} alt={pkg.packageName} />
                                                <div className="card-body">
                                                    <h6 className="card-title">{pkg.packageName}</h6>
                                                    <p className="card-text">Price: ₹{pkg.price}</p>
                                                    <p className="card-text">{pkg.city}</p>
                                                    <Link to={`/package/${pkg.id}`} className="btn dorne-btn w-100">View Package</Link>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Author Widget */}
                                <div className="author-widget mt-50 d-flex align-items-center">
                                    <img src={sessionStorage.getItem("profilePic") || "/assets/img/clients-img/default_profile_pic.png"} alt="" />
                                    <div className="authors-name">
                                        <p>You are viewing</p>
                                        <a href="#">{packageData?.packageName}</a>
                                        <p>{packageData?.city}</p>
                                    </div>
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
