import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/UploadFile';
import axios from 'axios'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: ''
  });

  const [fileName, setFileName] = useState(''); // For file name display
  const navigate = useNavigate();

  // Handle form data change
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]; // Get the file
    setFileName(file.name); // Store file name
    const uploadedFile = await uploadFile(file); // Upload the file
  
    if (uploadedFile) {
      setData((prev) => ({
        ...prev,
        profile_pic: uploadedFile.secure_url, // Store the file URL in the form data
      }));
    }
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault(); 
    setFileName(''); // Clear file name
    setData((prev) => ({
      ...prev,
      profile_pic: '', // Clear the uploaded photo URL
    }));
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try{
      const response = await axios.post(URL, data)
      console.log("response", response)

      toast.success(response.data.message)

      if(response.data.success){
        setData({
          name: '',
          email: '',
          password: '',
          profile_pic: ''
        })
        navigate('/email')
      }
    }catch(error){
      toast.error(error?.response?.data?.message
      )
      console.log("data",data)
    }
    
    console.log('Submitted data:', data);
  };



  // Function to trigger file input when clicking on the div
  const handleClickUploadDiv = () => {
    document.getElementById('profile_pic').click();
  };

  return (
    <div className='mt-5'>
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat App!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
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

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div
                className="h-14 bg-slate-200 flex justify-center items-center rounded hover:border-primary cursor-pointer"
                onClick={handleClickUploadDiv} // Trigger file input on click
              >
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {fileName ? fileName : 'Upload Profile Photo'}
                </p>
                {fileName && (
                  <button
                    className="text-lg ml-2 hover:text-red-500"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wider"
          >
            Register
          </button>
        </form>

        <p className="my-2">
          Already have an account?{' '}
          <Link to="/email" className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
