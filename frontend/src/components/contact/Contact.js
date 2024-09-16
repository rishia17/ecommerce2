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
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card shadow form1">
                        <div className="card-title text-center border-bottom">
                            <h2 className="p-3">Contact Form</h2>
                        </div>
                        <div className="card-body">
                            {err && <div className="alert alert-danger">{err}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="Name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Name"
                                        placeholder="Enter your name"
                                        {...register('Name')}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        {...register('email')}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="message"
                                        placeholder="Enter your message"
                                        {...register('message')}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ backgroundColor: '#eb5757' }}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
