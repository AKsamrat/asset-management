import { getAuth, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';

import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import Swal from 'sweetalert2';
import app from '../../Firebase/Firebase.config';
const auth = getAuth(app);

const UpdateProfile = () => {
  const { user, setReload } = useAuth();
  const axiosCommon = useAxiosCommon();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state ? location.state : '/';
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    const updateData = {
      name: data.name,
    };
    // const { email, password } = data;
    // setUser(data);
    axiosCommon
      .patch(`/profile-update/${user?.email}`, updateData)
      .then(res => {
        console.log(res.data);
        if (res.data.insertedId) {
          Swal.fire({
            title: 'Updated!',
            text: 'Your Data has been Updated.',
            icon: 'success',
          });
        }
      });
    updateProfile(auth.currentUser, {
      displayName: data.name,
    }).then(result => setReload(true));
    toast('Profile Update Seccesfully');
    if (data.user) {
      navigate(from);
    }
    reset();
  };
  return (
    <div className="bg-[linear-gradient(45deg,rgba(0,0,0,0.4),rgba(0,0,0,0.1))] w-full bg-no-repeat bg-cover rounded-[32px] bg-img h-[100vh] lg:h-[80vh] flex justify-center items-center  ">
      {/* <img src={img1} alt="" /> */}

      <div
        className="max-w-md p-8 sm:flex sm:space-x-6 bg-gray-50 text-gray-800"
        data-aos="fade-right"
        data-aos-delay="800"
        data-aos-duration="700"
      >
        <div className="flex-shrink-0 w-full mb-6 h-44 sm:h-32 sm:w-32 sm:mb-0">
          <img
            src={user?.photoURL}
            alt=""
            className="object-cover object-center w-full h-full rounded bg-gray-500"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{user?.displayName}</h2>
          </div>
          <div className="space-y-1">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                aria-label="Email address"
                className="w-4 h-4"
              >
                <path
                  fill="currentColor"
                  d="M274.6,25.623a32.006,32.006,0,0,0-37.2,0L16,183.766V496H496V183.766ZM464,402.693,339.97,322.96,464,226.492ZM256,51.662,454.429,193.4,311.434,304.615,256,268.979l-55.434,35.636L57.571,193.4ZM48,226.492,172.03,322.96,48,402.693ZM464,464H48V440.735L256,307.021,464,440.735Z"
                ></path>
              </svg>
              <span className="text-gray-600">{user?.email}</span>
            </span>
            <span className="flex items-center space-x-2"></span>
          </div>
        </div>
      </div>
      <div
        className=" lg:pl-32"
        data-aos="fade-left"
        data-aos-delay="800"
        data-aos-duration="700"
      >
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-[#ffffffad] text-gray-800">
          <div className="mb-8 text-center">
            <h1
              className="my-3 text-4xl font-extrabold text-[#AD8B00]"
              data-aos="fade-left"
              data-aos-duration="700"
              data-aos-delay="700"
            >
              Profile Update
            </h1>
            <p
              className="text-sm text-gray-600 font-bold"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-delay="1200"
            >
              Please Enter your new Data
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            action=""
            className="space-y-12"
          >
            <div className="space-y-4">
              <div data-aos="fade-left" data-aos-duration="1000">
                <label className="block mb-2 text-sm font-extrabold">
                  Your Name
                </label>
                <input
                  data-aos="fade-left"
                  data-aos-duration="1000"
                  data-aos-delay="1200"
                  {...register('name', { required: true })}
                  required
                  type="text"
                  name="name"
                  id="name"
                  placeholder="A k samrat"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
                />
                {errors.name && <span>This field is required</span>}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <button
                  data-aos="fade-left"
                  data-aos-duration="700"
                  data-aos-delay="700"
                  type="submit"
                  className="w-full px-8 py-3 font-semibold rounded-md bg-[#AD8B00] text-gray-50"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
