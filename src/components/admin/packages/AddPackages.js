import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { db, storage } from '../../../Firebase';
import { ClipLoader } from "react-spinners";

export default function AddPackage() {
    const [allCities, setAllCities] = useState([]);
    const [packageDetails, setPackageDetails] = useState({
        packageName: '',
        cityId: '',
        cityName: '', // Add cityName to the packageDetails state
        price: '',
        noOfPeople: '',
        days: '',
        night: '',
        meals: '',
        otherFeatures: '',
        description: '',
    });
    const [imageUrl, setImageUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Fetch active cities data from Firestore
    useEffect(() => {
        const fetchCities = () => {
            const q = query(collection(db, 'cities'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const citiesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })).filter(city => city.data.status === 'Active');
                setAllCities(citiesList);
            });
            return () => unsubscribe();
        };

        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPackageDetails({
            ...packageDetails,
            [name]: value,
        });
    };

    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        const selectedCity = allCities.find(city => city.id === selectedCityId);
        if (selectedCity) {
            setPackageDetails({
                ...packageDetails,
                cityId: selectedCity.id,
                cityName: selectedCity.data.name, // Store the city name as well
            });
        }
    };

    const handleFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setThumbnail(file);
            uploadImage(file);
        } else {
            toast.error("Please upload an image file only");
        }
    };

    const uploadImage = (file) => {
        const storageRef = ref(storage, `package_images/${file.name}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
        }, (error) => {
            toast.error('Error uploading image: ' + error.message);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUrl(downloadURL);
                toast.success('Image uploaded successfully');
            });
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!packageDetails.cityId) {
            toast.error('Please select a city');
            return;
        }

        setLoading(true);

        const newPackage = {
            ...packageDetails,
            cityId: packageDetails.cityId, // Storing city ID
            cityName: packageDetails.cityName, // Storing city name
            status: 'Active',
            price: parseFloat(packageDetails.price),
            noOfPeople: Number(packageDetails.noOfPeople),
            days: Number(packageDetails.days),
            night: Number(packageDetails.night),
            createdAt: new Date(),
        };

        // Add image URL only if image is uploaded
        if (imageUrl) {
            newPackage.image = imageUrl;
        }

        try {
            // Add the package
            await addDoc(collection(db, 'packages'), newPackage);

            // Increment package count in the city document
            const cityRef = doc(db, 'cities', packageDetails.cityId);
            await updateDoc(cityRef, { packagesCount: increment(1) });

            toast.success('Package added successfully');
            resetForm();
        } catch (error) {
            toast.error('Error adding package: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setPackageDetails({
            packageName: '',
            cityId: '',
            cityName: '',
            price: '',
            noOfPeople: '',
            days: '',
            night: '',
            meals: '',
            otherFeatures: '',
            description: '',
        });
        setImageUrl('');
        setUploadProgress(0);
        setThumbnail(null);
    };

    const handleDragDrop = (e, type) => {
        e.preventDefault();
        if (type === "over") {
            setDragActive(true);
        } else if (type === "drop") {
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
            }
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    return (
        <>
            {/* ***** Breadcrumb Area Start ***** */}
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>
            {/* ***** Breadcrumb Area End ***** */}

            <div className="contact-form container my-5 border p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Add Package</h2>
                    <Link to="/admin/packages/manage" className="btn dorne-btn-outline">Manage Packages</Link>
                </div>

                {/* Loader */}
                <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />

                {/* Form */}
                <form onSubmit={handleFormSubmit} className={loading ? "d-none" : "mb-4"}>
                    {/* Package Details */}
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>Package Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="packageName"
                                value={packageDetails.packageName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group col-md-4">
                            <label>City</label>
                            <select
                                className="form-control"
                                name="cityId"
                                style={{ height: "45%" }}
                                value={packageDetails.cityId}
                                onChange={handleCityChange}
                                required
                            >
                                <option value="" disabled>Select City</option>
                                {allCities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.data.name} ({city.data.packagesCount || 0} Packages)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-4">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={packageDetails.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>No. of People</label>
                            <input
                                type="number"
                                className="form-control"
                                name="noOfPeople"
                                value={packageDetails.noOfPeople}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group col-md-4">
                            <label>Days</label>
                            <input
                                type="number"
                                className="form-control"
                                name="days"
                                value={packageDetails.days}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group col-md-4">
                            <label>Nights</label>
                            <input
                                type="number"
                                className="form-control"
                                name="night"
                                value={packageDetails.night}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Meals</label>
                            <input
                                type="text"
                                className="form-control"
                                name="meals"
                                value={packageDetails.meals}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Breakfast, Lunch, Dinner"
                            />
                        </div>

                        <div className="form-group col-md-6">
                            <label>Other Features</label>
                            <input
                                type="text"
                                className="form-control"
                                name="otherFeatures"
                                value={packageDetails.otherFeatures}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Free WiFi, Airport Pickup"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label>Upload Image (Optional)</label>
                            <div
                                className={`upload-area border bg-light p-5 text-center ${dragActive ? "active" : ""}`}
                                onDragOver={(e) => handleDragDrop(e, "over")}
                                onDrop={(e) => handleDragDrop(e, "drop")}
                                onDragLeave={handleDragLeave}
                                style={{ cursor: "pointer" }}
                            >
                                <input
                                    type="file"
                                    className="form-control-file"
                                    onChange={(e) => handleFileChange(e.target.files[0])}
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
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <p className="mt-2">Upload progress: {Math.round(uploadProgress)}%</p>
                            )}
                            {imageUrl && (
                                <div className="mt-2">
                                    <img src={imageUrl} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={packageDetails.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                placeholder="Provide a detailed description of the package..."
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn dorne-btn">Submit</button>
                </form>
            </div>
        </>
    );
}
