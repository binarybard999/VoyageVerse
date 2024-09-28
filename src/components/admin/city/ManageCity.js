import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../../Firebase';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { ClipLoader } from "react-spinners";

export default function ManageCity() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch cities data from Firestore
        const unsubscribe = onSnapshot(collection(db, 'cities'), (snapshot) => {
            setCities(snapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                index: index + 1,
            })));
            setLoading(false); // Data is fully loaded, turn off loader
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this city?')) {
            try {
                await deleteDoc(doc(db, 'cities', id));
                toast.success('City deleted successfully');
            } catch (error) {
                toast.error('Error deleting city: ' + error.message);
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'cities', id), { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
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

            {/* City Management Section */}
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>City Management</h2>
                    <Link to="/admin/city/add" className="btn dorne-btn-outline">
                        Add City
                    </Link>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center">
                            <ClipLoader size={50} color="rgb(61, 18, 159)" loading={loading} />
                        </div>
                    ) : cities.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-warning text-center" role="alert">
                                No cities available at the moment.
                            </div>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Name</th>
                                    <th>Thumbnail</th>
                                    <th>Created At</th>
                                    <th>City ID</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cities.map((city) => (
                                    <tr key={city.id}>
                                        <td>{city.index}</td>
                                        <td>{city.name}</td>
                                        <td>
                                            <img
                                                src={city.thumbnail}
                                                alt={city.name}
                                                className="img-thumbnail"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </td>
                                        <td>{formatDate(city.createdAt)}</td>
                                        <td>{city.id}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${city.status === 'Active' ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => toggleStatus(city.id, city.status)}
                                            >
                                                {city.status === 'Active' ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="btn-group">
                                            <Link to={`/admin/city/edit/${city.id}`} className="btn btn-primary btn-sm">
                                                <i className="fa fa-edit"></i>
                                            </Link>
                                            <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDelete(city.id)}>
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
