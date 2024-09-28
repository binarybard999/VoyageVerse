import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../../Firebase';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { ClipLoader } from "react-spinners";

export default function ManagePlaces() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch places data from Firestore
        const unsubscribe = onSnapshot(collection(db, 'places'), (snapshot) => {
            setPlaces(snapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                index: index + 1, // Adding a serial number
            })));
            setLoading(false); // Data is fully loaded, turn off loader
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id, cityId) => {
        if (window.confirm('Are you sure you want to delete this place?')) {
            try {
                // Delete the place
                await deleteDoc(doc(db, 'places', id));

                // Decrement place count in the city document
                const cityRef = doc(db, 'cities', cityId);
                const cityDoc = await getDoc(cityRef);
                if (cityDoc.exists()) {
                    const cityData = cityDoc.data();
                    await updateDoc(cityRef, { placesCount: (cityData.placesCount || 1) - 1 });
                }

                toast.success('Place deleted successfully');
            } catch (error) {
                toast.error('Error deleting place: ' + error.message);
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'places', id), { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Error updating status: ' + error.message);
        }
    };

    const formatDate = (date) => {
        return moment(date?.toDate()).format('MMMM Do, YYYY');
    };

    return (
        <>
            {/* ***** Breadcumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcumb Area End ***** */}

            {/* Places Management Section */}
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Places Management</h2>
                    <Link to="/admin/places/add" className="btn dorne-btn-outline">
                        Add Place
                    </Link>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center">
                            <ClipLoader size={50} color="rgb(61, 18, 159)" loading={loading} />
                        </div>
                    ) : places.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-warning text-center" role="alert">
                                No places available at the moment.
                            </div>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>City Name</th>
                                    <th>Is Eatable</th>
                                    <th>Thumbnail</th>
                                    <th>Created At</th>
                                    <th>ID</th>
                                    <th>Description</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places.map((place) => (
                                    <tr key={place.id}>
                                        <td>{place.index}</td>
                                        <td>{place.name}</td>
                                        <td>{place.cityName}</td>
                                        <td>{place.isEatable ? 'Yes' : 'No'}</td>
                                        <td>
                                            <img
                                                src={place.image}
                                                alt={place.name}
                                                className="img-thumbnail"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </td>
                                        <td>{formatDate(place.createdAt)}</td>
                                        <td>{place.id}</td>
                                        <td>{place.description}</td>
                                        <td>{place.address}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${place.status === 'Active' ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => toggleStatus(place.id, place.status)}
                                            >
                                                {place.status}
                                            </button>
                                        </td>
                                        <td className="btn-group">
                                            <Link to={`/admin/places/edit/${place.id}`} className="btn btn-primary btn-sm">
                                                <i className="fa fa-edit"></i>
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => handleDelete(place.id, place.cityId)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
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
