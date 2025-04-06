import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiHeart } from "react-icons/fi";
import '../header/Header.css';
import logoImage from '../../assets/buyitlogo.png';
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userLoginSlice";

function Header() {
  const { loginStatus, currentUser } = useSelector(state => state.userLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  function signout() {
    dispatch(resetState());
  }

  function NavigateToCart() {
    if (loginStatus) {
      navigate('/cart');
    }
  }

  function NavigateToWishlist() {
    if (loginStatus) {
      navigate('/wishlist');
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container1 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#DC143C", fontWeight: "600" }}>
      <div className='logo'>
        <img src={logoImage} alt="Logo" />
      </div>

      {/* Navigation menu */}
      <ul className={`nav align-items-center ${menuOpen ? 'mobile-menu open' : 'mobile-menu'}`} ref={menuRef}>
        <li className='nav-item'><NavLink className="nav-link text-white" to="">Home</NavLink></li>
        <li className='nav-item'><NavLink className="nav-link text-white" to="about">About</NavLink></li>
        <li className='nav-item'><NavLink className="nav-link text-white" to="products">Products</NavLink></li>
        {(loginStatus === false || currentUser.userType !== "admin") && (
          <li className='nav-item'><NavLink className="nav-link text-white" to="contact">Contact</NavLink></li>
        )}
        {currentUser.userType === 'admin' && (
          <li className='nav-item'><NavLink className="nav-link text-white" to="addproduct">Add Product</NavLink></li>
        )}
        {!loginStatus ? (
          <li className='nav-item'><NavLink className="nav-link text-white" to="signup">SignUp</NavLink></li>
        ) : (
          <>
            <li className='nav-it'>
              <span className="lead text-white">Welcome, {currentUser.userName}</span>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="signin" onClick={signout}>Signout</NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Right side icons: Hamburger, Wishlist, Cart */}
      <div className='right-icons d-flex align-items-center'>
        <div className="hamburger d-md-none" onClick={() => setMenuOpen(prev => !prev)}>
          {menuOpen ? <FiX size={24} color="white" /> : <FiMenu size={24} color="white" />}
        </div>
        <div className='wishlistlogo d-flex justify-content-center align-items-center mx-2'>
          <FiHeart size={22} color='white' onClick={NavigateToWishlist} style={{ cursor: 'pointer' }} />
        </div>
        <div className='cartlogo d-flex justify-content-center align-items-center'>
          <FiShoppingCart size={22} color='white' onClick={NavigateToCart} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
}

export default Header;
