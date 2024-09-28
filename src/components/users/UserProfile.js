import React, { useEffect, useState } from 'react';
import { getAuth, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../Firebase';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";

export default function UserProfile() {
    const [userDetails, setUserDetails] = useState({
        username: sessionStorage.getItem('username') || "",
        address: sessionStorage.getItem('address') || "",
        contact: sessionStorage.getItem('contact') || "",
        email: sessionStorage.getItem('email') || "",
        profilePic: sessionStorage.getItem('profilePic') || "",
    });
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const auth = getAuth();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // Check if user data is already in sessionStorage
            if (!sessionStorage.getItem('username')) {
                fetchUserData(user.uid);
            }
        } else {
            toast.error("No user is signed in. Please log in first.");
            setRedirect(true); // Trigger redirection
        }
    }, [auth]);

    const fetchUserData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserDetails(userData);
                // Store user data in sessionStorage
                sessionStorage.setItem('username', userData.username);
                sessionStorage.setItem('address', userData.address);
                sessionStorage.setItem('contact', userData.contact);
                sessionStorage.setItem('email', userData.email);
                sessionStorage.setItem('profilePic', userData.profilePic || "");
            } else {
                toast.error("User data not found!");
            }
        } catch (error) {
            toast.error("Error fetching user data: " + error.message);
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setNewProfilePic(file);
        } else {
            toast.error("Please upload a valid image file.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userId = auth.currentUser.uid;
        let updatedData = { ...userDetails };

        try {
            if (newProfilePic) {
                const storageRef = ref(storage, `profile_pics/${userId}`);
                const uploadTask = uploadBytesResumable(storageRef, newProfilePic);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => { },
                    (error) => {
                        toast.error("Image upload failed: " + error.message);
                        setLoading(false);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        updatedData.profilePic = downloadURL;
                        await updateProfile(auth.currentUser, { photoURL: downloadURL });
                        await updateUserData(userId, updatedData);
                    }
                );
            } else {
                await updateUserData(userId, updatedData);
            }

            if (newPassword) {
                await updatePassword(auth.currentUser, newPassword);
                toast.success("Password updated successfully");
            }

            setLoading(false);
        } catch (error) {
            toast.error("Failed to update profile: " + error.message);
            setLoading(false);
        }
    };

    const updateUserData = async (userId, data) => {
        await updateDoc(doc(db, "users", userId), data);
        // Update sessionStorage with new data
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('address', data.address);
        sessionStorage.setItem('contact', data.contact);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('profilePic', data.profilePic || "");
        toast.success("Profile updated successfully");
        fetchUserData(userId);
    };

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <img
                                    src={userDetails.profilePic || "/assets/img/clients-img/default_profile_pic.png"}
                                    className="rounded-circle img-fluid"
                                    alt="Profile"
                                    style={{ width: '150px', height: '150px' }}
                                />
                                <h3 className="mt-3">{userDetails.username}</h3>
                                <p className="text-muted">{userDetails.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <ul className="nav nav-tabs" id="profileTab" role="tablist">
                                    <li className="nav-item">
                                        <a
                                            className="nav-link active"
                                            id="details-tab"
                                            data-toggle="tab"
                                            href="#details"
                                            role="tab"
                                            aria-controls="details"
                                            aria-selected="true"
                                        >
                                            Details
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a
                                            className="nav-link"
                                            id="settings-tab"
                                            data-toggle="tab"
                                            href="#settings"
                                            role="tab"
                                            aria-controls="settings"
                                            aria-selected="false"
                                        >
                                            Settings
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="profileTabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="details"
                                        role="tabpanel"
                                        aria-labelledby="details-tab"
                                    >
                                        <h5 className="mt-3">User Details</h5>


                                        <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />


                                        <div className={loading === true ? "d-none" : "form-group"}>
                                            <label htmlFor="fullName">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="fullName"
                                                placeholder="Full Name"
                                                value={userDetails.username}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="address"
                                                placeholder="Address"
                                                value={userDetails.address}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="contactNumber">Contact Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="contactNumber"
                                                placeholder="Contact Number"
                                                value={userDetails.contact}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Email"
                                                value={userDetails.email}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="settings"
                                        role="tabpanel"
                                        aria-labelledby="settings-tab"
                                    >
                                        <h5 className="mt-3">Settings</h5>
                                        <p>Update your Profile</p>


                                        <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />


                                        <form onSubmit={handleUpdate} className={loading === true ? "d-none" : ""}>
                                            <div className="form-group">
                                                <label htmlFor="username">Username</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Username"
                                                    value={userDetails.username}
                                                    onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Email"
                                                    value={userDetails.email}
                                                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="newPassword">New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="newPassword"
                                                    placeholder="New Password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="profilePic">Profile Picture</label>
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    id="profilePic"
                                                    onChange={handleProfilePicChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="address"
                                                    placeholder="Address"
                                                    value={userDetails.address}
                                                    onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="contactNumber">Contact Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="contactNumber"
                                                    placeholder="Contact Number"
                                                    value={userDetails.contact}
                                                    onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
                                                />
                                            </div>
                                            <button type="submit" className="btn dorne-btn" disabled={loading}>
                                                {loading ? "Updating..." : "Update"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
