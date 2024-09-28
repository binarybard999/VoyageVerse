import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, onSnapshot, query, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../../../Firebase';
import { ClipLoader } from "react-spinners";

export default function EditPackage() {
    const [allCities, setAllCities] = useState([]);
    const [packageName, setPackageName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [noOfPeople, setNoOfPeople] = useState('');
    const [days, setDays] = useState('');
    const [night, setNight] = useState('');
    const [meals, setMeals] = useState('');
    const [otherFeatures, setOtherFeatures] = useState('');
    const [cityName, setCity] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailURL, setThumbnailURL] = useState('');
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(true); // Track the loading state

    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch cities data from Firestore
    useEffect(() => {
        const q = query(collection(db, 'cities'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setAllCities(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        getPackageData();
    }, []);

    const getPackageData = async () => {
        setLoading(true);  // Start loading
        try {
            const packageRef = doc(db, 'packages', id);
            const packageDoc = await getDoc(packageRef);
            if (packageDoc.exists()) {
                const packageData = packageDoc.data();
                setPackageName(packageData.packageName);
                setPrice(packageData.price);
                setDescription(packageData.description);
                setNoOfPeople(packageData.noOfPeople);
                setDays(packageData.days);
                setNight(packageData.night);
                setMeals(packageData.meals);
                setOtherFeatures(packageData.otherFeatures);
                setCity(packageData.cityName);
                setThumbnailURL(packageData.thumbnail || '');
            } else {
                toast.error('Package not found!');
                navigate('/admin/packages/manage');
            }
        } catch (error) {
            toast.error('Error fetching package data: ' + error.message);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading

        try {
            let updatedPackage = {
                packageName,
                cityName,
                price: parseFloat(price),
                noOfPeople: Number(noOfPeople),
                days: Number(days),
                night: Number(night),
                meals,
                otherFeatures,
                description,
                updatedAt: new Date().toISOString().split('T')[0],
            };

            if (thumbnail) {
                // Upload the new image to Firebase Storage
                const storageRef = ref(storage, `package_images/${thumbnail.name}`);
                const uploadTask = uploadBytesResumable(storageRef, thumbnail);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(progressPercent);
                    },
                    (error) => {
                        toast.error('Image upload failed: ' + error.message);
                    },
                    async () => {
                        // On successful upload, get the download URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedPackage.thumbnail = downloadURL;
                        await updatePackageData(updatedPackage);
                    }
                );
            } else {
                // If no new image is uploaded, just update the other fields
                await updatePackageData(updatedPackage);
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.');
            setLoading(false);  // Stop loading in case of error
        }
    };

    const updatePackageData = async (data) => {
        try {
            const packageRef = doc(db, 'packages', id);
            await updateDoc(packageRef, data);
            toast.success('Package updated successfully');
            navigate('/admin/packages/manage');
        } catch (error) {
            toast.error('Error updating package: ' + error.message);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(file);
        } else {
            toast.error('Please upload an image file only');
        }
    };

    const handleDragDrop = (e, type) => {
        e.preventDefault();
        setDragActive(type === "over");
        if (type === "drop") {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>

            <div className="contact-form container my-5 border p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Edit Package</h2>
                    <Link to="/admin/packages/manage" className="btn dorne-btn-outline">Manage Packages</Link>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <ClipLoader size={100} color="rgb(61, 18, 159)" loading={loading} />
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="mb-4">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>Package Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={packageName}
                                    onChange={(e) => setPackageName(e.target.value)}
                                />
                            </div>

                            <div className="form-group col-md-4">
                                <label>City</label>
                                <select
                                    className="form-control"
                                    style={{ height: "45%" }}
                                    value={cityName}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option value="" disabled>Select City</option>
                                    {allCities.map((city) => (
                                        <option key={city.id} value={city.data.name}>{city.data.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group col-md-4">
                                <label>Price (₹)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label>No. of People</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={noOfPeople}
                                    onChange={(e) => setNoOfPeople(e.target.value)}
                                />
                            </div>

                            <div className="form-group col-md-4">
                                <label>Days</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                />
                            </div>

                            <div className="form-group col-md-4">
                                <label>Nights</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={night}
                                    onChange={(e) => setNight(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Meals</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={meals}
                                    onChange={(e) => setMeals(e.target.value)}
                                />
                            </div>

                            <div className="form-group col-md-6">
                                <label>Other Features</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={otherFeatures}
                                    onChange={(e) => setOtherFeatures(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Upload Image</label>
                                <div
                                    className={`upload-area border bg-light p-5 text-center ${dragActive ? "active" : ""}`}
                                    onDragOver={(e) => handleDragDrop(e, "over")}
                                    onDrop={(e) => handleDragDrop(e, "drop")}
                                    style={{ cursor: "pointer" }}
                                >
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="fileUpload"
                                    />
                                    <label htmlFor="fileUpload" className="w-100">
                                        {thumbnail ? (
                                            <span>{thumbnail.name}</span>
                                        ) : (
                                            <span>Drag & drop an image here, or click to select one</span>
                                        )}
                                    </label>
                                </div>
                                {thumbnailURL && !thumbnail && (
                                    <img src={thumbnailURL} alt="Package Thumbnail" className="img-thumbnail mt-2" />
                                )}
                            </div>
                        </div>

                        {progress > 0 && <p>Upload Progress: {Math.round(progress)}%</p>}
                        <button type="submit" className="btn dorne-btn">Submit</button>
                    </form>
                )}
            </div>
        </>
    );
}
