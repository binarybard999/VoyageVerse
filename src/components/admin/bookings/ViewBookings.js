import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase'; // Assuming Firebase is initialized
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function ViewBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch all bookings
                const bookingsCollection = collection(db, 'bookings');
                const bookingsSnapshot = await getDocs(bookingsCollection);
                const bookingsList = await Promise.all(bookingsSnapshot.docs.map(async (bookingDoc) => {
                    const bookingData = bookingDoc.data();

                    // Fetch package details
                    const packageDocRef = doc(db, 'packages', bookingData.packageId);
                    const packageDoc = await getDoc(packageDocRef);
                    const packageData = packageDoc.data();

                    // Fetch user details
                    const userDocRef = doc(db, 'users', bookingData.userId);
                    const userDoc = await getDoc(userDocRef);
                    const userData = userDoc.data();

                    return {
                        id: bookingDoc.id, // Ensure unique key
                        userName: userData.username || 'N/A',
                        userEmail: userData.email || 'N/A',
                        contact: userData.contact || 'N/A',
                        days: packageData.days || 'N/A',
                        noOfPeople: packageData.noOfPeople || 'N/A',
                        totalAmount: `₹${packageData.price || '0'}`, // Assuming price is fetched from packages collection
                        packageName: packageData.packageName || 'N/A',
                        dateOfBooking: bookingData.bookingDate ? bookingData.bookingDate.toDate().toLocaleDateString() : 'N/A', // Convert timestamp
                        status: bookingData.status || 'N/A',
                        createdAt: bookingData.createdAt ? bookingData.createdAt.toDate().toLocaleDateString() : 'N/A' // Convert timestamp
                    };
                }));
                setBookings(bookingsList);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Failed to fetch bookings. Please try again later.');
            }
            setLoading(false);
        };

        fetchBookings();
    }, []);

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status: newStatus });
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, status: newStatus } : booking
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
            {/* ***** Breadcrumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcrumb Area End ***** */}

            {/* Bookings Management Section */}
            <div className="container my-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2>Bookings Management</h2>
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
                                    <th>User Name</th>
                                    <th>User Email</th>
                                    <th>Contact</th>
                                    <th>No. of Days</th>
                                    <th>No. of People</th>
                                    <th>Total Amount</th>
                                    <th>Package Name</th>
                                    <th>Date of Booking</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking.id}>
                                        <td>{index + 1}</td>
                                        <td>{booking.userName}</td>
                                        <td>{booking.userEmail}</td>
                                        <td>{booking.contact}</td>
                                        <td>{booking.days}</td>
                                        <td>{booking.noOfPeople}</td>
                                        <td>{booking.totalAmount}</td>
                                        <td>{booking.packageName}</td>
                                        <td>{booking.dateOfBooking}</td>
                                        <td>
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                className="form-control"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Canceled">Canceled</option>
                                            </select>
                                        </td>
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
