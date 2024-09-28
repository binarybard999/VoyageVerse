export default function FormSearch() {

    return (
        <>
            {/* ***** Search Form Area ***** */}
            <div className="dorne-search-form d-flex align-items-center">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="search-close-btn" id="closeBtn">
                                <i className="pe-7s-close-circle" aria-hidden="true" />
                            </div>
                            <form action="#" method="get">
                                <input
                                    type="search"
                                    name="caviarSearch"
                                    id="search"
                                    placeholder="Search Your Desire Destinations or Events"
                                />
                                <input type="submit" className="d-none" defaultValue="submit" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}