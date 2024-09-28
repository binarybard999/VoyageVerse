export default function Error() {
    return (
        <>
            {/* ***** Breadcumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcumb Area End ***** */}

            <div style={{ fontSize: '40px', textAlign: 'center', marginTop: '100px' }}>404 - Something went wrong</div>
        </>
    );
}