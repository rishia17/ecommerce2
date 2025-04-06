import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userLoginThunk } from "../../redux/slices/userLoginSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Signin() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const { isPending, currentUser, errorStatus, errorMessage, loginStatus } = useSelector(state => state.userLogin);

  // Handle form submit
  function handleFormSubmit(userCred) {
    console.log(userCred);
    const userCredentialsWithType = userCred;
    let actionObj = userLoginThunk(userCredentialsWithType);
    dispatch(actionObj);
  }

  useEffect(() => {
    if (loginStatus) {
      if (currentUser.userType === 'user') {
        navigate('/');
      }
      if (currentUser.userType === 'admin') {
        navigate('/');
      }
    }
  }, [loginStatus]);
  
  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-6 col-md-10 col-sm-8">
          <div className="card shadow form1">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3">Signin</h2>
            </div>
            <div className="card-body text-start">
              {/* Invalid credentials error message */}
              {errorStatus === true && (
                <p className="text-center error-msg text-dark">
                  {errorMessage}
                </p>
              )}
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* UserType Selection - Using Radio Buttons */}
                <div className="mb-4">
                  <label className="form-label">Select User Type</label><br />
                  <label>
                    <input type="radio" value="admin" {...register("userType")} /> Admin
                  </label>
                  <label className="ms-4">
                    <input type="radio" value="user" {...register("userType")} /> User
                  </label>
                </div>

                <div className="mb-4">
                  <label htmlFor="userName" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    {...register("userName")}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    {...register("password")}
                  />
                </div>

                <button type="submit" className="btn d-block text-center w-100" style={{ backgroundColor: "#DC143C", color: "white" }}>
                  Login
                </button>

                <p className="text-center w-100 mt-3">
                  Don't have an account?{' '}
                  <button onClick={navigateToSignUp} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    Sign up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
