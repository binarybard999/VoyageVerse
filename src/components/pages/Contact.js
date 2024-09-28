import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Add Firestore methods
import { db } from '../../Firebase'; // Import the Firebase db
import { toast } from 'react-toastify'; // For notifications
import { ClipLoader } from 'react-spinners'; // Import loader

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false); // For submit button and loader

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!name || !email || !message || !subject) {
            toast.error('All fields are required');
            return;
        }

        setLoading(true); // Show loader during submission

        try {
            // Add the query to Firestore with additional fields
            await addDoc(collection(db, 'queries'), {
                name,
                email,
                message,
                subject, // Take subject input from user
                status: 'Active', // Hidden field, default value
                createdAt: serverTimestamp(), // Add timestamp
            });

            // Success message
            toast.success('Message sent successfully');
            
            // Clear form fields
            setName('');
            setEmail('');
            setMessage('');
            setSubject('Query'); // Reset subject to default
        } catch (error) {
            console.error('Error submitting query:', error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setLoading(false); // Hide loader after submission
        }
    };

    return (
        <>
            {/* ***** Breadcumb Area Start ***** */}
            <div
                className="breadcumb-area bg-img bg-overlay"
                style={{ backgroundImage: "url(/assets/img/bg-img/hero-1.jpg)" }}
            ></div>
            {/* ***** Breadcumb Area End ***** */}

            {/* ***** Contact Area Start ***** */}
            <div className="dorne-contact-area d-md-flex" id="contact">
                {/* Contact Form Area */}
                <div className="contact-form-area equal-height">
                    <div className="contact-text">
                        <h4>Hello, Get in touch with us</h4>
                        <p>
                            Feel free to reach out to us! Whether you have questions, feedback, or need assistance, our friendly team is here to help. Drop us a message, and let’s make your travel dreams a reality! We value your input and look forward to connecting with fellow adventurers like you.
                        </p>
                        <div className="contact-info d-lg-flex">
                            <div className="single-contact-info">
                                <h6>
                                    <i className="fa fa-map-signs" aria-hidden="true" /> K24, Block K, Hauz Khas Enclave, Hauz Khas
                                </h6>
                                <h6>
                                    <i className="fa fa-map-signs" aria-hidden="true" /> New Delhi, Delhi 110016
                                </h6>
                            </div>
                            <div className="single-contact-info">
                                <h6>
                                    <i className="fa fa-envelope-o" aria-hidden="true" />{" "}
                                    contact@voyageverse.in
                                </h6>
                                <h6>
                                    <i className="fa fa-phone" aria-hidden="true" /> +91 98765 43210
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className="contact-form">
                        <div className="contact-form-title">
                            <h6>Contact Business</h6>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-6">
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
                                <div className="col-12">
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-control"
                                        placeholder="Subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)} // Allow user to edit subject
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        id="Message"
                                        cols={30}
                                        rows={10}
                                        placeholder="Your Message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn dorne-btn" disabled={loading}>
                                        {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Send'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Map Area */}
                <div className="dorne-map-area equal-height">
                    <div id="googleMap" className="embed-responsive embed-responsive-16by9">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d876.1880822138825!2d77.20087826958157!3d28.54716319848196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce20ea0f46c75%3A0x3b2a8c8939fea629!2sK24%2C%20Block%20K%2C%20Hauz%20Khas%20Enclave%2C%20Hauz%20Khas%2C%20New%20Delhi%2C%20Delhi%20110016!5e0!3m2!1sen!2sin!4v1720974684800!5m2!1sen!2sin"
                            title="Google Map"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="embed-responsive-item"
                            style={{ border: 0 }}
                        />
                    </div>
                </div>
            </div>
            {/* ***** Contact Area End ***** */}
        </>
    );
}
