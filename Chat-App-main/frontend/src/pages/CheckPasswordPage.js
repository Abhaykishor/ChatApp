import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avtar from '../component/Avtar';
import {useDispatch} from 'react-redux';
import { setToken, setUser } from '../redux/UserSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: '',
    email: '' // Ensure email is being set
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Ensure the user is redirected if required data (name, email) is missing
    if (!location?.state?.name || !location?.state?.email) {
      navigate('/email'); // Redirect if name or email is not available
    } else {
      // Pre-populate email when location.state is available
      setData((prev) => ({
        ...prev,
        email: location.state.email // Set email from location.state
      }));
    }
  }, [location, navigate]);

  // Handle form data change
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

   
    try {
        const response = await axios({
          method:'post',
          url: URL,
          data : {
          userId : location?.state?._id,
          password:data.password
        },
          withCredentials: true
        })

        toast.success(response.data.message)

        if(response.data.success){
            dispatch(setToken(response?.data?.token))
            localStorage.setItem('token',response?.data?.token)

            setData({
              password : "",
            })
            navigate('/')
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center item-center flex-col">
          <Avtar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-1">{location?.state?.name}</h2>
        </div>

        <h3>Welcome to Chat App!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit" // Make sure form submission happens
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wider"
          >
            Login
          </button>
        </form>

        <p className="text-lg px-4 my-2 flex justify-center items-center">
          <Link to="/forgot-password" className="hover:text-primary font-semibold">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;




