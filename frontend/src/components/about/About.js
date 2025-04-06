import React from 'react';
import { MdVerified } from "react-icons/md";
import { IoCartSharp } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { FaRegCommentAlt } from "react-icons/fa";
import './About.css'; 
function About() {
  return (
    <div className='container'>
      <div className='desc text-center mx-auto mb-5 mt-4'>
        <p>WHY BuyIt OUTDOORS?</p>
        <h3>We’re the best in the business.</h3>
        <p>For more than 30 years, we’ve been leading the way across Oklahoma — creating the best possible customer experience since 1989.</p>
      </div>
      <div className='d-flex row justify-content-center'>
        {/* Card 1 */}
        <div className='col-md-3 d-flex flex-column align-items-center mb-4'>
          <div className='card p-3 text-center hover-card' style={{ width: '100%', height: '100%', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div className='d-flex justify-content-center mb-3'>
                <MdVerified size={40} style={{ color: "#eb5757" }} />
            </div>
            <h4 style={{ textAlign: 'center' }}>Lifetime Warranty</h4>
            <p style={{ textAlign: 'left' }}>All our products — whether we make them or not — are backed by our lifetime warranty.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className='col-md-3 d-flex flex-column align-items-center mb-4'>
          <div className='card p-3 text-center hover-card' style={{ width: '100%', height: '100%', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div className='d-flex justify-content-center mb-3'>
                <IoCartSharp size={40} style={{ color: "#eb5757" }} />
            </div>
            <h4 style={{ textAlign: 'center' }}>Shopping Experience</h4>
            <p style={{ textAlign: 'left' }}>Your shopping experience with us is always a priority, and we guarantee a seamless and enjoyable process every time.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className='col-md-3 d-flex flex-column align-items-center mb-4'>
          <div className='card p-3 text-center hover-card' style={{ width: '100%', height: '100%', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div className='d-flex justify-content-center mb-3'>
                <TbTruckDelivery size={40} style={{ color: "#eb5757" }} />
            </div>
            <h4 style={{ textAlign: 'center' }}>On-time Delivery</h4>
            <p style={{ textAlign: 'left' }}>We ensure your order reaches you on time, every time — because prompt delivery is something you can count on with us.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className='col-md-3 d-flex flex-column align-items-center mb-4'>
          <div className='card p-3 text-center hover-card' style={{ width: '100%', height: '100%', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div className='d-flex justify-content-center mb-3'>
                <FaRegCommentAlt size={40} style={{ color: "#eb5757" }} />
            </div>
            <h4 style={{ textAlign: 'center' }}>Best in Class Service</h4>
            <p style={{ textAlign: 'left' }}>Our commitment to you goes beyond the sale. We back all our interactions with best-in-class service that you can trust, every step of the way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
