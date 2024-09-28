import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function ManageReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState({});
    const [editingReply, setEditingReply] = useState(null);
    const [replyToDelete, setReplyToDelete] = useState(null);

    const adminUserId = sessionStorage.getItem('userId');

    const fetchReviews = async () => {
        try {
            const reviewsCollection = collection(db, 'reviews');
            const reviewsSnapshot = await getDocs(reviewsCollection);
            const reviewsList = await Promise.all(reviewsSnapshot.docs.map(async (reviewDoc) => {
                const reviewData = reviewDoc.data();
                const userDocRef = doc(db, 'users', reviewData.userId);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();

                const packageDocRef = doc(db, 'packages', reviewData.packageId);
                const packageDoc = await getDoc(packageDocRef);
                const packageData = packageDoc.data();

                return {
                    id: reviewDoc.id,
                    packageId: reviewData.packageId,
                    packageName: packageData.packageName,
                    ratings: reviewData.rating,
                    review: reviewData.comment,
                    status: reviewData.status,
                    createdAt: reviewData.date,
                    title: reviewData.title,
                    userName: userData.username || 'Unknown',
                    userEmail: userData.email || 'Unknown',
                    reply: reviewData.reply || '',
                    replyUserId: reviewData.replyUserId,
                };
            }));
            setReviews(reviewsList);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews. Please try again later.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [editingReply, replyToDelete]); // Trigger when reply is edited or deleted

    const handleReplyChange = (e, reviewId) => {
        setReply({ ...reply, [reviewId]: e.target.value });
    };

    const handleReplySubmit = async (reviewId) => {
        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            await updateDoc(reviewRef, { reply: reply[reviewId], replyUserId: adminUserId });
            setReply(prevReplies => ({ ...prevReplies, [reviewId]: '' }));
            toast.success('Reply submitted successfully.');
            fetchReviews(); // Fetch updated reviews after reply submission
        } catch (error) {
            console.error('Error submitting reply:', error);
            toast.error('Failed to submit reply. Please try again later.');
        }
    };

    const handleEditReply = (reviewId) => {
        setEditingReply(reviewId);
        setReply(prevReplies => ({ ...prevReplies, [reviewId]: reviews.find(review => review.id === reviewId).reply }));
    };

    const handleEditReplySubmit = async (reviewId) => {
        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            await updateDoc(reviewRef, { reply: reply[reviewId] });
            setEditingReply(null);
            toast.success('Reply updated successfully.');
            fetchReviews(); // Fetch updated reviews after reply edit
        } catch (error) {
            console.error('Error updating reply:', error);
            toast.error('Failed to update reply. Please try again later.');
        }
    };

    const handleDeleteReply = async (reviewId) => {
        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            await updateDoc(reviewRef, { reply: '', replyUserId: '' });
            setReplyToDelete(null);
            toast.success('Reply deleted successfully.');
            fetchReviews(); // Fetch updated reviews after reply deletion
        } catch (error) {
            console.error('Error deleting reply:', error);
            toast.error('Failed to delete reply. Please try again later.');
        }
    };

    const handleStatusChange = async (reviewId, newStatus) => {
        try {
            const reviewRef = doc(db, 'reviews', reviewId);
            await updateDoc(reviewRef, { status: newStatus });
            setReviews(prevReviews =>
                prevReviews.map(review =>
                    review.id === reviewId ? { ...review, status: newStatus } : review
                )
            );
            toast.success('Status updated successfully.');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status. Please try again later.');
        }
    };

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>

            <div className="container my-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2>Reviews Management</h2>
                    </div>
                </div>
                <div className="table-responsive">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                            <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />
                        </div>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Package Name</th>
                                    <th>Ratings</th>
                                    <th>Title</th>
                                    <th>Review</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Reply</th>
                                    <th>User Name</th>
                                    <th>User Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review, index) => (
                                    <tr key={review.id}>
                                        <td>{index + 1}</td>
                                        <td>{review.packageName}</td>
                                        <td>{review.ratings}</td>
                                        <td>{review.title}</td>
                                        <td>{review.review}</td>
                                        <td>
                                            <select
                                                value={review.status}
                                                onChange={(e) => handleStatusChange(review.id, e.target.value)}
                                                className="form-control"
                                            >
                                                <option value="Published">Published</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </td>
                                        <td>{review.createdAt}</td>
                                        <td>
                                            {editingReply === review.id ? (
                                                <>
                                                    <textarea
                                                        className="form-control"
                                                        value={reply[review.id] || ''}
                                                        onChange={(e) => handleReplyChange(e, review.id)}
                                                    />
                                                    <button
                                                        className="btn btn-success btn-sm mt-2"
                                                        onClick={() => handleEditReplySubmit(review.id)}
                                                    >
                                                        Update Reply
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm mt-2 ms-2"
                                                        onClick={() => setEditingReply(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {review.reply ? (
                                                        <div>
                                                            {review.reply} <br />
                                                            <div className="btn-group mt-2" role="group">
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleEditReply(review.id)}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleDeleteReply(review.id)}
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <textarea
                                                                className="form-control"
                                                                placeholder="Reply to this review"
                                                                value={reply[review.id] || ''}
                                                                onChange={(e) => handleReplyChange(e, review.id)}
                                                            />
                                                            <button
                                                                className="btn btn-success btn-sm mt-2"
                                                                onClick={() => handleReplySubmit(review.id)}
                                                            >
                                                                Reply
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td>{review.userName}</td>
                                        <td>{review.userEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
