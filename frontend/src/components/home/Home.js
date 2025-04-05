import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import slide1 from '../../assets/carousel/slide1.jpg';
import slide2 from '../../assets/carousel/slide2.jpg';
import slide3 from '../../assets/carousel/slide3.jpg';
import slide4 from '../../assets/carousel/slide4.jpg';
import slide5 from '../../assets/carousel/slide5.jpg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css'; 
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// Custom arrow button components
const CustomPrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <FaAngleLeft 
      className={className} 
      onClick={onClick} 
      style={{ 
        color: '#eb5757', 
        position: 'absolute',
        left: '10px',
        zIndex: 1,
      }} 
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <FaAngleRight 
      className={className} 
      onClick={onClick} 
      style={{ 
        color:"#eb5757",
        position: 'absolute',
        right: '10px',
        zIndex: 1,
      }} 
    />
  );
};

function Home() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };
  
  const images = [slide1, slide2, slide3, slide4, slide5];
  const [topProductsList, setTopProductsList] = useState([]);
  const [limitedOffersList, setLimitedOffersList] = useState([]);
  const token = sessionStorage.getItem('token');
  const {loginStatus,currentUser} = useSelector((state)=>state.userLogin)
  
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
  
  const navigate = useNavigate();
  let [err, setErr] = useState('');

  const [recentlyViewed, setRecentlyViewed] = useState([]);

    const getRecentlyViewed = async () => {
      if (loginStatus) {
        const res = await axiosWithToken.get(`http://localhost:5500/user-api/recently-viewed/${currentUser.userName}`);
        if (res.data.message === 'recently viewed products') {
          setRecentlyViewed(res.data.payload);
        }
      }
    };

    useEffect(() => {
      getRecentlyViewed();
    }, []);

  const getTopNewProducts = async () => {
      const res = await axiosWithToken.get(`http://localhost:5500/user-api/products/top-new`);
      if (res.data.message === 'products fetched') {
        setTopProductsList(res.data.payload);
      } else {
        setErr(res.data.message);
      }
  };

  useEffect(() => {
    getTopNewProducts();
  }, []);

  const getLimitedOfferProducts = async () => {
    const res = await axiosWithToken.get(`http://localhost:5500/user-api/products/offers`);
    if (res.data.message === 'products fetched') {
      setLimitedOffersList(res.data.payload);
    } else {
      setErr(res.data.message);
    }
};

useEffect(() => {
  getLimitedOfferProducts();
}, []);
  const getProductDetails = (productObj) => {
    navigate(`../product`, { state: productObj });
  };

  return (
    <div className='home-container'>
      <Carousel>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100 carousel-image" src={image} alt={`Slide ${index + 1}`} />
          </Carousel.Item>
        ))}
      </Carousel>

      <div>
        <div className='recommended-products'>
          <h5 style={{ textAlign: 'left', marginLeft: '10px' }}>Recommended products</h5>
          <div className='products-slider' style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            {topProductsList.length === 0 ? (
              <p>No products found</p>
            ) : (
              <Slider {...settings}>
                {topProductsList.map((products) => (
                  <div className="card d-flex product-card" key={products.productId} 
                    style={{
                      width: '200px',
                      margin: '0 10px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <div className='card-side1' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <img 
                        src={`${products.imageUrls[0]}`} 
                        alt="" 
                        style={{ height: '100px', width: '100px', objectFit: 'contain' }} 
                        onClick={() => getProductDetails(products)}
                      />
                    </div>
                    <div className='product-details' style={{ textAlign: 'center' }}>
                      <p onClick={() => getProductDetails(products)}  
                        style={{ marginTop: '5%', fontWeight: '500', fontSize: '1rem' }}>
                        {`${products.name.substring(0, 40)}...`}
                      </p>
                    </div>
                    <div className='product-brand' style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                        <span style={{ fontWeight: 'bold' }}>Brand:</span> {`${products.brand}`}
                      </p>
                    </div>
                    <div className='prices-card' style={{ textAlign: 'center' }}>
                      <div className='card-price'>
                        <span style={{ fontSize: '28px', fontWeight: '600' }} onClick={() => getProductDetails(products)}>
                          {`\u20B9 ${Math.floor((products.price - (products.price * (products.discount / 100))) || 0)}`}
                        </span>
                      </div>
                      <div className='card-mrp' onClick={() => getProductDetails(products)}>
                        <p>
                          MRP: <span style={{ textDecoration: 'line-through' }}>&#x20B9; {`${products.price}`}</span>
                          <span style={{ color: '#eb5757' }}>{`${products.discount}`}% off</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>

        <div className='limited-offers'>
          <h5 style={{ textAlign: 'left', marginLeft: '10px', fontWeight: '500' }}>Limited offers</h5>
          <div className='products-slider' style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            {limitedOffersList.length === 0 ? (
              <p>No products found</p>
            ) : (
              <Slider {...settings}>
                {limitedOffersList.map((products) => (
                  <div className="card d-flex product-card" key={products.productId} 
                    style={{
                      width: '200px',
                      margin: '0 10px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <div className='card-side1' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <img 
                        src={`${products.imageUrls[0]}`} 
                        alt="" 
                        style={{ height: '100px', width: '100px', objectFit: 'contain' }} 
                        onClick={() => getProductDetails(products)}
                      />
                    </div>
                    <div className='product-details' style={{ textAlign: 'center' }}>
                      <p onClick={() => getProductDetails(products)}  
                        style={{ marginTop: '5%', fontWeight: '500', fontSize: '1rem' }}>
                        {`${products.name.substring(0, 40)}...`}
                      </p>
                    </div>
                    <div className='product-brand' style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                        <span style={{ fontWeight: 'bold' }}>Brand:</span> {`${products.brand}`}
                      </p>
                    </div>
                    <div className='prices-card' style={{ textAlign: 'center' }}>
                      <div className='card-price'>
                        <span style={{ fontSize: '28px', fontWeight: '600' }} onClick={() => getProductDetails(products)}>
                          {`\u20B9 ${Math.floor((products.price - (products.price * (products.discount / 100))) || 0)}`}
                        </span>
                      </div>
                      <div className='card-mrp' onClick={() => getProductDetails(products)}>
                        <p>
                          MRP: <span style={{ textDecoration: 'line-through' }}>&#x20B9; {`${products.price}`}</span>
                          <span style={{ color: '#eb5757' }}>{`${products.discount}`}% off</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
        {recentlyViewed.length > 0 && (
      <div className='recently-viewed'>
        <h5 style={{ textAlign: 'left', marginLeft: '10px', fontWeight: '500' }}>Recently Viewed</h5>
        <div className='products-slider' style={{ maxWidth: '100%', overflowX: 'hidden' }}>
          <Slider {...settings}>
            {recentlyViewed.map((product) => (
              <div className="card d-flex product-card" key={product.productId}
                style={{
                  width: '200px',
                  margin: '0 10px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <div className='card-side1' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <img
                    src={`${product.imageUrls[0]}`}
                    alt=""
                    style={{ height: '100px', width: '100px', objectFit: 'contain' }}
                    onClick={() => getProductDetails(product)}
                  />
                </div>
                <div className='product-details' style={{ textAlign: 'center' }}>
                  <p onClick={() => getProductDetails(product)}
                    style={{ marginTop: '5%', fontWeight: '500', fontSize: '1rem' }}>
                    {`${product.name.substring(0, 40)}...`}
                  </p>
                </div>
                <div className='product-brand' style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                    <span style={{ fontWeight: 'bold' }}>Brand:</span> {`${product.brand}`}
                  </p>
                </div>
                <div className='prices-card' style={{ textAlign: 'center' }}>
                  <div className='card-price'>
                    <span style={{ fontSize: '28px', fontWeight: '600' }} onClick={() => getProductDetails(product)}>
                      {`\u20B9 ${Math.floor((product.price - (product.price * (product.discount / 100))) || 0)}`}
                    </span>
                  </div>
                  <div className='card-mrp' onClick={() => getProductDetails(product)}>
                    <p>
                      MRP: <span style={{ textDecoration: 'line-through' }}>&#x20B9; {`${product.price}`}</span>
                      <span style={{ color: '#eb5757' }}>{`${product.discount}`}% off</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    )}
    </div>
    </div>
  );
}

export default Home;
