import React, { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, query, updateDoc, doc, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { db, storage } from '../../../Firebase';
import { ClipLoader } from "react-spinners";

export default function AddPlace() {
    const [allCities, setAllCities] = useState([]);
    const [name, setName] = useState('');
    const [cityId, setCityId] = useState('');
    const [cityName, setCityName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [isEatable, setIsEatable] = useState(true);
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

    const handleFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setThumbnail(file);
            uploadImage(file);
        } else {
            toast.error("Please upload an image file only");
        }
    };

    const uploadImage = (file) => {
        const storageRef = ref(storage, `place_images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
        }, (error) => {
            toast.error('Error uploading image: ' + error.message);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUrl(downloadURL);
            });
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.error('Please upload an image');
            return;
        }

        setLoading(true);

        const newPlace = {
            name,
            cityId,
            cityName, // Store city name alongside cityId
            description,
            address,
            isEatable,
            image: imageUrl,
            status: 'Active',
            createdAt: new Date(),
        };

        try {
            // Add the new place
            await addDoc(collection(db, 'places'), newPlace);

            // Update the city's placesCount
            const cityRef = doc(db, 'cities', cityId);
            await updateDoc(cityRef, { placesCount: increment(1) });

            toast.success('Place added successfully');
            resetForm();
        } catch (error) {
            toast.error('Error adding place: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setCityId('');
        setCityName('');
        setDescription('');
        setAddress('');
        setIsEatable(true);
        setImageUrl('');
        setUploadProgress(0);
        setThumbnail(null);
    };

    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        const selectedCity = allCities.find(city => city.id === selectedCityId);

        if (selectedCity) {
            setCityId(selectedCity.id);
            setCityName(selectedCity.data.name); // Store city name
        }
    };

    const handleDragDrop = (e, type) => {
        e.preventDefault();
        if (type === "over") {
            setDragActive(true);
        } else if (type === "drop") {
            setDragActive(false);
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>

            <div className="contact-form container my-5 border p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Add Place</h2>
                    <Link to="/admin/places/manage" className="btn dorne-btn-outline">Manage Places</Link>
                </div>

                <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />

                <form onSubmit={handleFormSubmit} className={loading ? "d-none" : "mb-4"}>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>Place Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group col-md-4">
                            <label>City</label>
                            <select
                                className="form-control"
                                value={cityId}
                                style={{height: "45%"}}
                                onChange={handleCityChange}
                                required
                            >
                                <option value="" disabled>Select City</option>
                                {allCities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.data.name} ({city.data.placesCount || 0} Places)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group col-md-4">
                            <label>Is Eatable</label>
                            <div className="px-2 pt-3 pb-1 d-flex align-items-center" style={{ backgroundColor: "#ffffff" }}>
                                <label className="mr-3 col-md-5">
                                    <input
                                        type="radio"
                                        name="isEatable"
                                        value="true"
                                        checked={isEatable === true}
                                        onChange={() => setIsEatable(true)}
                                    /> Yes
                                </label>
                                <label className="mr-3 col-md-5">
                                    <input
                                        type="radio"
                                        name="isEatable"
                                        value="false"
                                        checked={isEatable === false}
                                        onChange={() => setIsEatable(false)}
                                    /> No
                                </label>
                            </div>
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
                            {uploadProgress > 0 && <p>Upload progress: {Math.round(uploadProgress)}%</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group col-md-6">
                            <label>Address</label>
                            <textarea
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn dorne-btn">Submit</button>
                </form>
            </div>
        </>
    );
}
