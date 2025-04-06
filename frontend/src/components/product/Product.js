import React from 'react'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useLocation } from 'react-router-dom'
import './Product.css';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RelatedProductsCarousel from '../relatedProducts/relatedProducts';

function Product() {
  const { state } = useLocation()
  let [mainImage, setMainImage] = useState(state.imageUrls[0]);
  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });
  let navigate = useNavigate();
  let [err, setErr] = useState('');

  const [relatedProducts, setRelatedProducts] = useState([]);
  const { loginStatus, currentUser } = useSelector((state) => state.userLogin)


  useEffect(() => {
    async function fetchRelated() {
      if (!loginStatus) {
        navigate('/signin');
        return;
      }
      if (currentUser.userType === 'user') {
        const res = await axios.get(`http://localhost:5500/user-api/related/${state.productId}`);
        const rel = res.data;
        setRelatedProducts(rel);
      }
      else {
        const res = await axios.get(`http://localhost:5500/admin-api/related/${state.productId}`);
        setRelatedProducts(res.data);
        const rel = res.data;
        setRelatedProducts(rel);
      }

    }
    fetchRelated();
  }, [state.productId]);



  const addCart = async (productid) => {
    if (loginStatus) {
      let cartObj = {
        userName: currentUser.userName,
        productId: productid
      }
      if (currentUser.userType === 'user') {
        const res = await axiosWithToken.post(`http://localhost:5500/user-api/cart`, {
          obj: cartObj,
          productId: state.productId,
          user: {
            name: currentUser.userName,
            email: currentUser.email
          }
        })
        if (res.data.message === 'product added') {
          // console.log("added")
          toast.success("Added to Cart!");


        } else {
          // setErr(res.data.message)
          toast.error("Product is already in Cart!\n");
        }
      }

    }
    else {
      navigate('/signin');
    }
  }

  const addToWishlist = async (productid) => {
    if (loginStatus) {
      let cartObj = {
        userName: currentUser.userName,
        productId: productid
      }
      if (currentUser.userType === 'user') {
        const res = await axiosWithToken.post(`http://localhost:5500/user-api/wishlist`, cartObj)
        if (res.data.message === 'product added to wishlist') {
          // console.log("added")
          toast.success("Added to Wishlist!");
        } else {
          // setErr(res.data.message)
          toast.error("Product is already in Wishlist!\n");
        }
      }
    }
    else {
      navigate('/signin');
    }
  }

  const addToRecentlyViewed = async (product) => {
    if (loginStatus && currentUser.userType === 'user') {
      try {
        const res = await axiosWithToken.post('http://localhost:5500/user-api/recently-viewed', {
          userName: currentUser.userName,
          productId: product.productId
        });
        // You can log or handle response if needed
        // console.log(res.data.message);
      } catch (err) {
        console.error("Error adding to recently viewed:", err);
      }
    }
  };


  useEffect(() => {
    if (state && state.productId) {
      addToRecentlyViewed(state);
    }
  }, [state]);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="row">
        {/* Images Section */}
        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
          <div className="d-flex flex-md-row flex-column align-items-center">
            <div className="d-flex flex-md-column flex-row overflow-auto" style={{ gap: "10px", maxHeight: "300px" }}>
              {
                state.imageUrls.map((image, index) => (
                  <div className='image-box border' key={index} style={{ width: "60px", height: "60px", cursor: "pointer" }} onClick={() => setMainImage(image)}>
                    <img src={image} alt="thumbnail" className="img-fluid" style={{ objectFit: "contain", height: "100%", width: "100%" }} />
                  </div>
                ))
              }
            </div>

            <div className="product-image mx-md-3 mt-3 mt-md-0" style={{ height: "352px", width: "352px" }}>
              <img src={mainImage} alt="main" className="img-fluid" style={{ objectFit: "contain", height: "100%", width: "100%" }} />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className='product-details'>
            <h5 className='fw-bold'>{state.name}</h5>

            <Stack spacing={1}>
              <Rating name="half-rating-read" defaultValue={parseFloat(`${state.rating}`)} precision={0.5} readOnly />
            </Stack>

            <div className="product-price my-2">
              <span style={{ fontSize: "28px", fontWeight: "600" }}>
                ₹{Math.floor((state.price - (state.price * (state.discount / 100))) || 0)}
              </span>
            </div>

            <div className="product-mrp mb-2">
              <p className="mb-1">
                MRP: <span style={{ textDecoration: "line-through" }}>₹{state.price}</span>
              </p>
              <span className="text-danger">{state.discount}% off</span>
            </div>

            <p className="mb-2">Brand: <strong>{state.brand}</strong></p>

            <div className='d-flex flex-wrap gap-2 mb-3'>
              <button className='btn btn-warning' onClick={() => addCart(state.productId)}>Add to Cart</button>
              <button className='btn btn-outline-danger' onClick={() => addToWishlist(state.productId)}>Add to WishList</button>
            </div>

            <div className='product-description text-start'>
              <p><strong>Description</strong></p>
              <p>{state.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products mt-5">
        <h4>You might also like</h4>
        <div className="d-flex flex-wrap justify-content-center mt-3">
          <RelatedProductsCarousel relatedProducts={relatedProducts} />
        </div>
      </div>
    </div>

  )
}

export default Product