import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../../Firebase';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import { ClipLoader } from "react-spinners";

export default function ManagePackages() {
    const [packages, setPackages] = useState([]);
    const [cities, setCities] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch packages data from Firestore
        const unsubscribePackages = onSnapshot(collection(db, 'packages'), (snapshot) => {
            setPackages(snapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                index: index + 1, // Adding a serial number
                showFullDescription: false // State to manage description toggle
            })));
            setLoading(false); // Data is fully loaded, turn off loader
        });

        // Fetch city data from Firestore
        const unsubscribeCities = onSnapshot(collection(db, 'cities'), (snapshot) => {
            const cityData = {};
            snapshot.docs.forEach(doc => {
                cityData[doc.id] = doc.data();
            });
            setCities(cityData);
        });

        return () => {
            unsubscribePackages();
            unsubscribeCities();
        };
    }, []);

    const handleDelete = async (id, cityId) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                // Delete the package
                await deleteDoc(doc(db, 'packages', id));

                // Decrement package count in the city document
                const cityRef = doc(db, 'cities', cityId);
                const cityDoc = await getDoc(cityRef);
                if (cityDoc.exists()) {
                    const cityData = cityDoc.data();
                    await updateDoc(cityRef, { packagesCount: (cityData.packagesCount || 1) - 1 });
                }

                toast.success('Package deleted successfully');
            } catch (error) {
                toast.error('Error deleting package: ' + error.message);
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'packages', id), { status: currentStatus === 'Active' ? 'Inactive' : 'Active' });
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Error updating status: ' + error.message);
        }
    };

    const formatDate = (date) => {
        if (typeof date === 'string') {
            return moment(new Date(date)).format('MMMM Do, YYYY');
        } else if (date?.toDate) {
            return moment(date.toDate()).format('MMMM Do, YYYY');
        }
        return ''; // return an empty string if date is null or undefined
    };

    const toggleDescription = (index) => {
        setPackages(prevPackages =>
            prevPackages.map((pkg, i) => i === index
                ? { ...pkg, showFullDescription: !pkg.showFullDescription }
                : pkg
            )
        );
    };

    const renderDescription = (pkg, index) => {
        const maxLength = 50;
        if (pkg.showFullDescription) {
            return (
                <div>
                    <p>{pkg.description}</p>
                    <button className="btn btn-link p-0" onClick={() => toggleDescription(index)}>Show less</button>
                </div>
            );
        }

        if (pkg.description.length > maxLength) {
            return (
                <div>
                    <p>{pkg.description.substring(0, maxLength)}...</p>
                    <button className="btn btn-link p-0" onClick={() => toggleDescription(index)}>Read more</button>
                </div>
            );
        }

        return <p>{pkg.description}</p>;
    };

    return (
        <>
            {/* ***** Breadcumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcumb Area End ***** */}

            {/* Packages Management Section */}
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Packages Management</h2>
                    <Link to="/admin/packages/add" className="btn dorne-btn-outline">
                        Add Package
                    </Link>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center">
                            <ClipLoader size={50} color="rgb(61, 18, 159)" loading={loading} />
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="col-12">
                            <div className="alert alert-warning text-center" role="alert">
                                No packages available at the moment.
                            </div>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>S.No.</th>
                                    <th>Package Name</th>
                                    <th>City</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>No. of People</th>
                                    <th>Days</th>
                                    <th>Nights</th>
                                    <th>Meals</th>
                                    <th>Other Features</th>
                                    <th>Package ID</th>
                                    <th>Created At</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((pkg, index) => (
                                    <tr key={pkg.id}>
                                        <td>{pkg.index}</td>
                                        <td>{pkg.packageName}</td>
                                        {/* <td>{cities[pkg.cityId]?.name || 'Unknown City'}</td> */}
                                        <td>{pkg.cityName || 'Unknown City'}</td>
                                        <td>
                                            <img 
                                                src={pkg.image || cities[pkg.cityId]?.thumbnail || '/assets/img/default-package.jpg'} 
                                                alt={pkg.packageName} 
                                                className="img-thumbnail"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </td>
                                        <td>₹{pkg.price}</td>
                                        <td>{pkg.noOfPeople}</td>
                                        <td>{pkg.days}</td>
                                        <td>{pkg.night}</td>
                                        <td>{pkg.meals}</td>
                                        <td>{pkg.otherFeatures}</td>
                                        <td>{pkg.id}</td>
                                        <td>{formatDate(pkg.createdAt)}</td>
                                        <td>{renderDescription(pkg, index)}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${pkg.status === 'Active' ? 'btn-success' : 'btn-warning'}`}
                                                onClick={() => toggleStatus(pkg.id, pkg.status)}
                                            >
                                                {pkg.status}
                                            </button>
                                        </td>
                                        <td className="btn-group">
                                            <Link to={`/admin/packages/edit/${pkg.id}`} className="btn btn-primary btn-sm">
                                                <i className="fa fa-edit"></i>
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm ml-2"
                                                onClick={() => handleDelete(pkg.id, pkg.cityId)} // Use cityId instead of city
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
