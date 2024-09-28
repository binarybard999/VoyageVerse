import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { app, db } from "../../Firebase";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        const auth = getAuth(app);
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user_id = userCredentials.user.uid;
            const docRef = doc(db, "users", user_id);
            const docData = await getDoc(docRef);

            if (docData.exists()) {
                const userData = docData.data();

                // Store user details in sessionStorage
                sessionStorage.setItem("username", userData.username);
                sessionStorage.setItem("address", userData.address);
                sessionStorage.setItem("contact", userData.contact);
                sessionStorage.setItem("email", userData.email);
                sessionStorage.setItem("userType", userData.userType);
                sessionStorage.setItem("profilePic", userData.profilePic || "");
                sessionStorage.setItem("userId", user_id);

                toast.success("Login success");

                // Navigate based on user type
                if (userData.userType === 1) {
                    nav("/admin/dashboard");
                } else {
                    nav("/");
                }
            } else {
                toast.error("No data found");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false); // Ensure the loader is turned off after the process
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        try {
            const result = await signInWithPopup(auth, provider);
            const user_id = result.user.uid;
            const docRef = doc(db, "users", user_id);
            const docData = await getDoc(docRef);

            if (docData.exists()) {
                const userData = docData.data();

                // Store user details in sessionStorage
                sessionStorage.setItem("username", userData.username);
                sessionStorage.setItem("address", userData.address);
                sessionStorage.setItem("contact", userData.contact);
                sessionStorage.setItem("email", userData.email);
                sessionStorage.setItem("userType", userData.userType);
                sessionStorage.setItem("profilePic", userData.profilePic || "");
                sessionStorage.setItem("userId", user_id);

                toast.success("Login success");
            } else {
                // If user does not exist, create new user document
                const newUserData = {
                    username: result.user.displayName,
                    email: result.user.email,
                    contact: "",
                    address: "",
                    userType: 2, // Default user type
                    user_id: user_id,
                    status: true,
                    createdAt: Timestamp.now(),
                };
                await setDoc(doc(db, "users", user_id), newUserData);

                // Store new user details in sessionStorage
                sessionStorage.setItem("username", newUserData.username);
                sessionStorage.setItem("address", newUserData.address);
                sessionStorage.setItem("contact", newUserData.contact);
                sessionStorage.setItem("email", newUserData.email);
                sessionStorage.setItem("userType", newUserData.userType);
                sessionStorage.setItem("profilePic", newUserData.profilePic || "");
                sessionStorage.setItem("userId", user_id);

                toast.success("Google Sign-In successful");
            }

            nav("/"); // Redirect to homepage or desired location after successful sign-in
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>

            <div className="contact-form container my-5 border">
                <div className="contact-form-title text-center">
                    <h6>Login</h6>
                </div>

                <ClipLoader
                    cssOverride={{ display: "block", margin: "0 auto", top: "30vh" }}
                    size={100}
                    color="rgb(61, 18, 159)"
                    loading={loading}
                />

                <form onSubmit={handleForm} className={loading ? "d-none" : ""}>
                    <div className="form-row">
                        <div className="form-group col-12">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email Address"
                                value={email}
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
                        <div className="form-group col-12 d-flex flex-column flex-md-row justify-content-center align-items-center">
                            <Link to="/register" className="btn dorne-btn-outline mb-2 mb-md-0 mx-2">
                                Or Register
                            </Link>
                            <button type="submit" className="btn dorne-btn mx-2">
                                Login
                            </button>
                            <button type="button" className="btn dorne-btn mx-2" onClick={signInWithGoogle}>
                                <img
                                    src="https://img.icons8.com/color/16/000000/google-logo.png"
                                    alt="Google logo"
                                    className="mr-2"
                                />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
