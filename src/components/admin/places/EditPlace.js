import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, onSnapshot, query, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../../../Firebase';
import { ClipLoader } from 'react-spinners'; // Import the loader

export default function EditPlace() {
    const [allCities, setAllCities] = useState([]);
    const [name, setName] = useState('');
    const [cityName, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [isEatable, setIsEatable] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(true); // State to track loading

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
        getPlaceData();
    }, []);

    const getPlaceData = async () => {
        setLoading(true); // Start loading
        try {
            const placeRef = doc(db, 'places', id);
            const placeDoc = await getDoc(placeRef);
            if (placeDoc.exists()) {
                const placeData = placeDoc.data();
                setName(placeData.name);
                setCity(placeData.cityName);
                setDescription(placeData.description);
                setAddress(placeData.address);
                setIsEatable(placeData.isEatable);
                setImageUrl(placeData.image);
            } else {
                toast.error('Place not found!');
                navigate('/admin/places/manage');
            }
        } catch (error) {
            toast.error('Error fetching place data: ' + error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleImageUpload = (file) => {
        if (!file) return;

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
                toast.success('Image uploaded successfully');
            });
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        handleImageUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        setThumbnail(file);
        handleImageUpload(file);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.error('Please upload an image');
            return;
        }

        setLoading(true); // Start loading

        const updatedPlace = {
            name,
            cityName,
            description,
            address,
            isEatable,
            image: imageUrl,
            status: 'Active', // Assuming status is active when editing
            updatedAt: new Date(),
        };

        try {
            const placeRef = doc(db, 'places', id);
            await updateDoc(placeRef, updatedPlace);
            toast.success('Place updated successfully');
            navigate('/admin/places/manage');
        } catch (error) {
            toast.error('Error updating place: ' + error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>

            <div className="contact-form container my-5 border p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Edit Place</h2>
                    <Link to="/admin/places/manage" className="btn dorne-btn-outline">Manage Places</Link>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <ClipLoader size={100} color="rgb(61, 18, 159)" loading={loading} />
                    </div>
                ) : (
                    <form onSubmit={handleFormSubmit} className="mb-4">
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
                                    style={{ height: "45%" }}
                                    value={cityName}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select City</option>
                                    {allCities.map((city) => (
                                        <option key={city.id} value={city.data.name}>{city.data.name}</option>
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

                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label>Upload Image</label>
                                <div
                                    className={`upload-area border bg-light p-5 text-center ${dragActive ? "active" : ""}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
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
                                {uploadProgress > 0 && <p>Upload progress: {Math.round(uploadProgress)}%</p>}
                                {imageUrl && !thumbnail && (
                                    <img src={imageUrl} alt="Place Thumbnail" className="img-thumbnail mt-2" />
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn dorne-btn">Submit</button>
                    </form>
                )}
            </div>
        </>
    );
}
