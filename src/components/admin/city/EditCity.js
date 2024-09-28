import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../../../Firebase';
import { ClipLoader } from "react-spinners";

export default function EditCity() {
    const [cityName, setCityName] = useState('');
    const [thumbnail, setThumbnail] = useState(null);  // Store image file
    const [thumbnailURL, setThumbnailURL] = useState('');  // Store existing image URL
    const [progress, setProgress] = useState(0);  // Track upload progress
    const [dragActive, setDragActive] = useState(false);  // Handle drag-and-drop
    const [loading, setLoading] = useState(false);  // Track the loading state

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getCityData();
    }, []);

    const getCityData = async () => {
        setLoading(true);  // Start loading
        try {
            const cityRef = doc(db, 'cities', id);
            const cityDoc = await getDoc(cityRef);
            if (cityDoc.exists()) {
                const cityData = cityDoc.data();
                setCityName(cityData.name);
                setThumbnailURL(cityData.thumbnail);
            } else {
                toast.error('City not found!');
            }
        } catch (error) {
            toast.error('Error fetching city data: ' + error.message);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading
        try {
            let updatedData = { name: cityName };

            if (thumbnail) {
                // Upload the new image to Firebase Storage
                const storageRef = ref(storage, `cities/${thumbnail.name}`);
                const uploadTask = uploadBytesResumable(storageRef, thumbnail);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(progressPercent);
                    },
                    (error) => {
                        toast.error('Image upload failed: ' + error.message);
                        setLoading(false);  // Stop loading if there's an error
                    },
                    async () => {
                        // On successful upload, get the download URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedData.thumbnail = downloadURL;
                        await updateCityData(updatedData);
                    }
                );
            } else {
                // If no new image is uploaded, just update the name
                await updateCityData(updatedData);
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.');
            setLoading(false);  // Stop loading if there's an error
        }
    };

    const updateCityData = async (data) => {
        try {
            const cityRef = doc(db, 'cities', id);
            await updateDoc(cityRef, data);
            toast.success('City updated successfully');
            navigate('/admin/city/manage');
        } catch (error) {
            toast.error('Error updating city: ' + error.message);
        } finally {
            setLoading(false);  // Stop loading after update
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

    return (
        <>
            {/* ***** Breadcrumb Area Start ***** */}
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>
            {/* ***** Breadcrumb Area End ***** */}

            <div className="contact-form container my-5 border p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Edit City</h2>
                    <Link to="/admin/city/manage" className="btn dorne-btn-outline">Manage Cities</Link>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <ClipLoader size={100} color="rgb(61, 18, 159)" loading={loading} />
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label>City Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cityName}
                                    onChange={(e) => setCityName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-12">
                                <label>Upload Image</label>
                                <div
                                    className={`upload-area border bg-light p-5 text-center ${dragActive ? "active" : ""}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragActive(false);
                                        handleFileChange(e);
                                    }}
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
                                    <img src={thumbnailURL} alt="City Thumbnail" className="img-thumbnail mt-2" />
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
