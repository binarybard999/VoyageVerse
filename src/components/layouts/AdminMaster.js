import { Navigate, Outlet } from "react-router-dom";
import { AdminHeader } from "./AdminHeader";
import Footer from "../layouts/Footer";
import { toast } from "react-toastify";


export default function AdminMaster({ children }) {

    const email = sessionStorage.getItem("email");
    const userType = sessionStorage.getItem("userType");

    if (!email || userType==="2") {
        toast.error("Login First!");
        return <Navigate to={"/login"} />
    }

    return (

        <>
            <AdminHeader />

            <div style={{ minHeight: "80vh" }}>
                <Outlet />
            </div>

            <Footer />
        </>
    );
}