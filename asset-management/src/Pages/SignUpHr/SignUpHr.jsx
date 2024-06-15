import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useAuth from '../../hooks/useAuth';
import { imageUpload } from '../../api/util';
import axios from 'axios';

const SignUpHr = () => {
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const {
    createUser,
    googleLogin,
    profileUpdate,
    loading,
    setLoading,
    setDateOfBirth,
  } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const companyName = form.companyName.value;
    const email = form.email.value;
    const birth = startDate;
    // setDateOfBirth(birth);
    console.log(birth);
    const password = form.password.value;
    const image = form.image.files[0];
    const companyLogo = form.companyLogo.files[0];
    const pacValue = parseFloat(form.category.value);

    try {
      setLoading(true);

      const image_url = await imageUpload(image);
      const companyLogo2 = await imageUpload(companyLogo);
      console.log(name);
      const hrData = {
        name,
        email,
        birth: birth,
        role: 'Hr Manager',
        companyName: companyName,
        companyLogo: companyLogo2,
        image_url,
        pacValue,
      };
      setDateOfBirth(hrData);
      await axios.put(`${import.meta.env.VITE_API_URL}/user`, hrData);

      //create user
      const result = await createUser(email, password);
      console.log(result);

      //save user name image
      await profileUpdate(name, image_url);
      navigate(`/payment/${pacValue}`);
      toast.success('Signup Succesfully');
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error('err.massage');
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      await googleLogin();
      navigate('/');
      toast.success('Signup Successful');
    } catch (err) {
      console.log(err);
      toast.error('err.massage');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen pt-16">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-400">Welcome to Asset Management</p>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate=""
          action=""
          className="space-y-6 ng-untouched ng-pristine ng-valid"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm">
                Select Company logo:
              </label>
              <input
                required
                type="file"
                id="companyLogo"
                name="companyLogo"
                accept="companyLogo/*"
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-2 text-sm">
                Select Your photo:
              </label>
              <input
                required
                type="file"
                id="image"
                name="image"
                accept="image/*"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            <div className=" flex flex-col gap-2">
              <label className="text-gray-700">Date Of Birth</label>

              <DatePicker
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm mb-2">
                  Password
                </label>
              </div>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                id="password"
                required
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="text-gray-700 " htmlFor="category">
                Package
              </label>
              <select
                name="category"
                id="category"
                className="border p-2 rounded-md"
              >
                <option value="5">5 Members for $5</option>
                <option value="8">10 Members for $8</option>
                <option value="15">20 Members for $15</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-[#FEBF32] w-full rounded-md py-3 text-white"
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin mx-auto" />
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
          <p className="px-3 text-sm dark:text-gray-400">
            Signup with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className=" disabled:cursor-not-allowed  flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer"
        >
          <FcGoogle size={32} />

          <p>Continue with Google</p>
        </button>
        <p className="px-6 text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="hover:underline hover:text-[#FEBF32] text-gray-600 "
          >
            Login
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUpHr;
