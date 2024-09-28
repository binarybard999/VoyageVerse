import { Outlet } from "react-router-dom";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import FormSearch from "../common/FormSearch";

export default function Master(){

    return(
        <>
            <FormSearch />

            <Header />

            <div style={{ minHeight: "85vh" }}>
                <Outlet />
            </div>

            <Footer />
        </>
    );
}