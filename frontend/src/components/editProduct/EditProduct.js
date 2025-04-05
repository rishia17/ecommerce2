import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

function EditProduct() {
  const { register, handleSubmit } = useForm();
  const { state: productData } = useLocation();
  const navigate = useNavigate();
  const [err, setErr] = useState('');
  const token = sessionStorage.getItem('token');

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const saveModifiedProduct = async (editedFields) => {
    let updatedProduct = {
      ...productData,
      ...editedFields,
      dateOfModification: new Date(),
    };
    delete updatedProduct._id; // MongoDB _id is immutable

    // Convert imageUrls from string to array
    updatedProduct.imageUrls = updatedProduct.imageUrls
      .split('\n')
      .map((url) => url.trim());

    try {
      const res = await axiosWithToken.put(
        'http://localhost:5500/admin-api/edit-product',
        updatedProduct
      );
      if (res.data.message === 'product modified') {
        navigate('../products', { state: res.data.product });
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error('Edit failed:', error);
      setErr('Something went wrong while editing the product.');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Edit Product</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(saveModifiedProduct)}>
                <div className="mb-4">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={productData.name}
                    {...register('name')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    defaultValue={productData.description}
                    {...register('description')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={productData.price}
                    {...register('price')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={productData.quantity}
                    {...register('quantity')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={productData.rating}
                    {...register('rating')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    defaultValue={productData.category}
                    {...register('category')}
                  >
                    <option value="All">All</option>
                    <option value="Mobile">Mobile</option>
                    <option value="TV">TV</option>
                    <option value="IPAD">IPAD</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Watch">Watch</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={productData.color}
                    {...register('color')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Discount</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={productData.discount}
                    {...register('discount')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={productData.brand}
                    {...register('brand')}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Image URLs (one per line)</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    defaultValue={productData.imageUrls.join('\n')}
                    {...register('imageUrls')}
                  />
                </div>

                <div className="text-end">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                </div>
              </form>
              {err && <p className="text-danger mt-2">{err}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;