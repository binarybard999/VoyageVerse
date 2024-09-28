import About from "./About";
import Category from "../common/Category";
import Clients from "../common/Clients";
import FeatureDestinations from "../common/FeatureDestinations";
import FeatureEvents from "../common/FeatureEvents";
import FeaturePlaces from "../common/FeaturePlaces";
import ExploreSearchForm from "../common/ExploreSearchForm";
import FeatureCities from "../common/FeatureCities";

export default function Home() {

    return (
        <>
            {/* ***** Welcome Area Start ***** */}
            <section
                className="dorne-welcome-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}>

                <ExploreSearchForm />

            </section>
            {/* ***** Welcome Area End ***** */}


            <Category />


            <About />


            <FeatureCities />


            <FeatureDestinations />


            <FeaturePlaces />


            {/* <FeatureEvents /> */}


            <Clients />
        </>

    );
}
