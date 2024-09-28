import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import ClipLoader from 'react-spinners/ClipLoader';

export default function PlaceDetailsPopup({ placeId, onClose }) {
    const [placeData, setPlaceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const docRef = doc(db, 'places', placeId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPlaceData(docSnap.data());
                } else {
                    console.error("Place not found");
                }
            } catch (error) {
                console.error("Error fetching place details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceDetails();
    }, [placeId]);

    if (loading) {
        return (
            <div className="popup-background">
                <div className="popup-container">
                    <ClipLoader size={60} color="#7643ea" />
                </div>
            </div>
        );
    }

    return (
        <div className="popup-background">
            <div className="popup-container">
                <button onClick={onClose} className="close-btn">&times;</button>
                {placeData ? (
                    <>
                        <h3>{placeData.name}</h3>
                        <img src={placeData.image} alt={placeData.name} style={{ width: '100%', height: 'auto' }} />
                        <p><strong>City:</strong> {placeData.cityName}</p>
                        <p><strong>Address:</strong> {placeData.address}</p>
                        <p><strong>Description:</strong> {placeData.description}</p>
                        <p><strong>Is Eatable:</strong> {placeData.isEatable ? 'Yes' : 'No'}</p>
                    </>
                ) : (
                    <p>Place details not found.</p>
                )}
            </div>
        </div>
    );
}
