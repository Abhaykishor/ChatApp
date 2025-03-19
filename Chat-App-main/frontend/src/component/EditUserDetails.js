import React, { useEffect, useRef, useState } from 'react';
import Avtar from './Avtar';
import UploadFile from '../helpers/UploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/UserSlice';
import Divider from './Divider';

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.user || '',
    profile_pic: user?.profile_pic || ''
  });

  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // Filter only necessary fields from user object
    const { name, profile_pic } = user || {};
    setData({ name, profile_pic });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await UploadFile(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url || prev.profile_pic
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/UpdateUserDetails`;

      // Create a JSON-safe payload by spreading only the necessary fields
      const payload = { ...data };

      console.log('Submitting data to:', URL);
      console.log('Data:', payload);

      const response = await axios.post(URL, payload, {
        withCredentials: true,
      });

      console.log('Response:', response);
      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('Failed to update user details');
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Details</h2>
        <p className='text-sm'>Edit user details</p>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full py-1 px-2 focus:outline-primary border-0.5'
            />
          </div>

          <div>
            <div>Photo:</div>
            <div className='my-1 flex items-center gap-4'>
              <Avtar
                width={40}
                height={40}
                imageUrl={data.profile_pic}
                name={data.name}
              />
              <label htmlFor='profile_pic'>
                <button className='font-semibold' onClick={handleOpenUploadPhoto}>
                  Change Photo
                </button>
                <input
                  type='file'
                  id='profile_pic'
                  className='hidden'
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />
          <div className='flex gap-2 w-fit ml-auto'>
            <button
              onClick={onClose}
              className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
