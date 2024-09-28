import React, { useState, useEffect } from "react";
import { doc, setDoc, Timestamp, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { db, storage } from "../../../Firebase";
import { ClipLoader } from "react-spinners";

export default function AddCity() {
    const [cityName, setCityName] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [status, setStatus] = useState("Active");
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (file) => {
        if (file && file.type.startsWith("image/")) {
            setThumbnail(file);
        } else {
            toast.error("Please upload an image file only");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!thumbnail) {
            toast.error("Please upload an image");
            return;
        }

        setLoading(true);

        try {
            const storageRef = ref(storage, `cities/${thumbnail.name}`);
            const uploadTask = uploadBytesResumable(storageRef, thumbnail);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progressPercent);
                },
                (error) => {
                    toast.error("Image upload failed: " + error.message);
                    setLoading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await saveCityData(downloadURL);
                    setLoading(false);
                }
            );
        } catch (error) {
            toast.error("An error occurred: " + error.message);
            setLoading(false);
        }
    };

    const saveCityData = async (downloadURL) => {
        const newCityId = doc(collection(db, "cities")).id;

        const newCity = {
            id: newCityId,
            name: cityName,
            thumbnail: downloadURL,
            status,
            createdAt: Timestamp.now(),
        };

        try {
            await setDoc(doc(db, "cities", newCityId), newCity);
            toast.success("City added successfully");
            resetForm();
        } catch (error) {
            toast.error("Error adding city: " + error.message);
        }
    };

    const resetForm = () => {
        setCityName("");
        setThumbnail(null);
        setStatus("Active");
        setProgress(0);
    };

    const handleDragDrop = (e, type) => {
        e.preventDefault();
        if (type === "drop") {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>

            <div className="contact-form container my-5 border p-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Add City</h2>
                    <Link to="/admin/city/manage" className="btn dorne-btn-outline">Manage Cities</Link>
                </div>


                <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />


                <form onSubmit={handleFormSubmit} className={loading ? "d-none" : ""}>
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
                                className={`upload-area border bg-light p-5 text-center ${thumbnail ? "active" : ""}`}
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
                                    {thumbnail ? <span>{thumbnail.name}</span> : <span>Drag & drop an image here, or click to select one</span>}
                                </label>
                            </div>
                        </div>
                    </div>
                    {progress > 0 && <p>Upload Progress: {Math.round(progress)}%</p>}
                    <button type="submit" className="btn dorne-btn">Submit</button>
                </form>
            </div>
        </>
    );
}
