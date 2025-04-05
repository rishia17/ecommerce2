import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import '../header/Header.css';
import logoImage from '../../assets/logo.PNG';
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userLoginSlice";
import { FiHeart } from "react-icons/fi";


function Header() {
  const { loginStatus, currentUser } = useSelector(state => state.userLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function signout() {
    dispatch(resetState());
  }

  function NavigateToCart() {
    if (loginStatus) {
      navigate('/cart');
    }
  }

  return (
    <div className="container1 d-flex align-items-center" style={{ backgroundColor: "#eb5757", fontWeight: "600" }}>
      <div className='logo'>
        <img src={logoImage} alt="Logo" />
      </div>
      <div className='nav align-items-center'>
        <li className='nav-item'>
          <NavLink className="nav-link text-white" to="">Home</NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className="nav-link text-white" to="about">About</NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className="nav-link text-white" to="products">Products</NavLink>
        </li>
        <li className='nav-item'>
          <NavLink className="nav-link text-white" to="contact">Contact</NavLink>
        </li>
        {currentUser.userType === 'admin' && (
          <li className='nav-item'>
            <NavLink className="nav-link text-white" to="addproduct">Add product</NavLink>
          </li>
        )}
        {!loginStatus ? (
          <li className='nav-item'>
            <NavLink className="nav-link text-white" to="signup">SignUp</NavLink>
          </li>
        ) : (
          <>
            <li className='nav-it'>
              <span className="lead" style={{ color: "white", margin: "8px" }}>
                welcome, {currentUser.userName}
              </span>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="signin" onClick={signout} style={{ color: "white" }}>
                Signout
              </NavLink>
            </li>
          </>
        )}
      </div>
      <div className='wishlistlogo d-flex justify-content-center align-items-center' style={{ marginRight: "15px" }}>
        <FiHeart size={22} color='white' onClick={() => navigate('/wishlist')} style={{ cursor: 'pointer' }} />
      </div>
      <div className='cartlogo d-flex justify-content-center align-items-center'>
        <FiShoppingCart height="8px" width="6px" color='white' onClick={NavigateToCart} />
      </div>

    </div>
  );
}

export default Header;
