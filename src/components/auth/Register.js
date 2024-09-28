import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { app, db } from "../../Firebase";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Import the loader component

export default function Register() {
    const [userName, setName] = useState("");
    const [userEmail, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false); // Loader state
    const nav = useNavigate();

    const saveData = async (userId, userData = {}) => {
        try {
            const data = {
                username: userName || userData.name,
                email: userEmail || userData.email,
                contact: contact || userData.contact,
                address: address || userData.address,
                userType: 2,
                user_id: userId,
                status: true,
                createdAt: Timestamp.now(),
            };
            await setDoc(doc(db, "users", userId), data);
            toast.success("User registered successfully");
            nav("/login");
        } catch (err) {
            console.log(err);
            toast.error("Failed to save user data");
        }
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        const auth = getAuth(app);
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, userEmail, password);
            await saveData(userCredentials.user.uid);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const signUpWithGoogle = async () => {
        setLoading(true);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await saveData(user.uid, {
                name: user.displayName,
                email: user.email,
            });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="breadcumb-area bg-img bg-overlay" style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}></div>
            <div className="contact-form container my-5 border">
                <div className="contact-form-title text-center">
                    <h6>Register</h6>
                </div>


                <ClipLoader cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }} size={100} color="rgb(61, 18, 159)" loading={loading} />


                <form onSubmit={handleForm} className={loading ? "d-none" : ""}>
                    <div className="form-row">
                        <div className="form-group col-12 col-md-6">
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Your Name"
                                value={userName}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group col-12 col-md-6">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email Address"
                                value={userEmail}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group col-12">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group col-12">
                            <input
                                type="number"
                                name="contactNumber"
                                className="form-control"
                                placeholder="Contact Number"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>
                        <div className="form-group col-12">
                            <textarea
                                name="address"
                                className="form-control"
                                placeholder="Address"
                                rows={3}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="form-group col-12 d-flex flex-column flex-md-row justify-content-center align-items-center">
                            <Link to="/login" className="btn dorne-btn-outline mb-2 mb-md-0 mx-2">
                                Or Login
                            </Link>
                            <button type="submit" className="btn dorne-btn mb-2 mb-md-0 mx-2">
                                Register
                            </button>
                            <button type="button" className="btn dorne-btn mx-2" onClick={signUpWithGoogle}>
                            <img
                                src="https://img.icons8.com/color/16/000000/google-logo.png"
                                alt="Google logo"
                                className="mr-2"
                            />
                            Sign up with Google
                        </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
