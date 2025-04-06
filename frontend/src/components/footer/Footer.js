import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import footLogo from '../../assets/buyitlogo.png';
import './Footer.css'
function Footer() {
  return (
    <div className='p-3' style={{ backgroundColor: "#DC143C"}}>
    <div className='foot-nav d-flex justify-content-between flex-wrap' style={{ marginTop: "1%" }}>
      <div className='foot-logo m-2'>
        <img
          src={footLogo}
          alt="Footer Logo"
          style={{ width: "100px" }}
        />
      </div>
      <div className='foot-icons d-flex justify-content-between align-items-center' style={{ width: "80px", marginRight: "5%" }}>
        <FaTwitterSquare color='white' size={24} />
        <FaFacebook color='white' size={24} />
        <FaInstagram color='white' size={24} />
      </div>
    </div>
    <div className='footer-sections d-flex justify-content-between flex-wrap mt-4'>
      <div className='footer-section'>
        <h5>Get to Know Us</h5>
        <ul>
          <li><a href="#about">About Us</a></li>
          <li><a href="#careers">Careers</a></li>
          <li><a href="#press">Press Releases</a></li>
          <li><a href="#blog">Blog</a></li>
        </ul>
      </div>
      <div className='footer-section'>
        <h5>Connect with Us</h5>
        <ul>
          <li><a href="#twitter">Twitter</a></li>
          <li><a href="#facebook">Facebook</a></li>
          <li><a href="#instagram">Instagram</a></li>
        </ul>
      </div>
      <div className='footer-section'>
        <h5>Make Money with Us</h5>
        <ul>
          <li><a href="#sell">Sell on Our Platform</a></li>
          <li><a href="#affiliate">Become an Affiliate</a></li>
          <li><a href="#advertising">Advertise Your Products</a></li>
        </ul>
      </div>
      <div className='footer-section'>
        <h5>Let Us Help You</h5>
        <ul>
          <li><a href="#account">Your Account</a></li>
          <li><a href="#orders">Your Orders</a></li>
          <li><a href="#shipping">Shipping Rates & Policies</a></li>
          <li><a href="#returns">Returns & Replacements</a></li>
          <li><a href="#help">Help</a></li>
        </ul>
      </div>
    </div>
    <div className='footer-bottom text-center mt-2' style={{color:"white"}}>
      <p className=''>&copy; 2024 BuyIt Company. All rights reserved.</p>
    </div>
  </div>
  )
}

export default Footer