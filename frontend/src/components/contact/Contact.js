import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';


function Contact() {
    const { register, handleSubmit } = useForm();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');

    const onSignUpFormSubmit = async (userObj) => {
        try {
            const response = await axios.post('http://localhost:5500/user-api/send-email', userObj);
            setSuccess('Email sent successfully!');
            setErr('');
        } catch (error) {
            setErr('Failed to send email. Please try again later.');
            console.error('Error:', error.response ? error.response.data : error.message);
            setSuccess('');
        }
    };

    return (
        <div className="container py-5 px-3">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-sm-10">
                    <div className="card shadow-sm form1">
                        <div className="card-title text-center border-bottom">
                            <h2 className="p-3 mb-0">Contact Us</h2>
                        </div>
                        <div className="card-body text-start">
                            {err && <div className="alert alert-danger">{err}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form onSubmit={handleSubmit(onSignUpFormSubmit)} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="Name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Name"
                                        placeholder="Enter your name"
                                        {...register('Name', { required: true })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        {...register('email', { required: true })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows="4"
                                        placeholder="Enter your message"
                                        {...register('message', { required: true })}
                                    ></textarea>
                                </div>
                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn text-white"
                                        style={{ backgroundColor: '#DC143C' }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
