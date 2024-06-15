import Container from './Container';
import { AiOutlineMenu } from 'react-icons/ai';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatarImg from '../assets/placeholder.jpg';
import useAuth from '../hooks/useAuth';
import DefaultMenu from '../Component/Menu/DefaultMenu';
import useRool from '../hooks/useRool';
import HrMenu from '../Component/Menu/HrMenu';
import EmployeeMenu from '../Component/Menu/EmployeeMenu';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../Component/LoadingSpinner';

const Navbar = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut, loading } = useAuth();
  const [role] = useRool();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };
  const { data: userInfo = [] } = useQuery({
    queryKey: ['userInfo', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure(`/users/${user?.email}`);

      return data;
    },
  });
  // console.log(userInfo);
  if (loading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="">
      <div className=" w-full bg-white  shadow-sm  mx-auto fixed z-10  px-4">
        <header className="py-4 border-b-[1px]">
          <Container>
            <div className="flex flex-row  items-center justify-between md:gap-3 gap-0">
              {/* Logo */}
              <Link to="/">
                {role === 'Hr Manager' ? (
                  <img className="h-12" src={userInfo?.companyLogo} alt="" />
                ) : role === 'employee' ? (
                  <img className="h-12" src={userInfo?.companyLogo} alt="" />
                ) : (
                  <div>
                    <h1 className=" text-[#FEBF32] font-bold text-2xl">
                      ASSET
                    </h1>
                    <p>MANAGEMENT</p>
                  </div>
                )}
                {/* {!userInfo?.companyLogo && (
                  <div>
                    <h1 className=" text-[#FEBF32] font-bold text-2xl">
                      ASSET
                    </h1>
                    <p>MANAGEMENT</p>
                  </div>
                )} */}
              </Link>

              <div className="hidden md:flex">
                <div>
                  {role === 'employee' ? (
                    <EmployeeMenu></EmployeeMenu>
                  ) : role === 'Hr Manager' ? (
                    <HrMenu></HrMenu>
                  ) : (
                    <DefaultMenu></DefaultMenu>
                  )}
                </div>
              </div>
              {/* Dropdown Menu */}
              <div className="relative">
                <div className="flex flex-row items-center gap-3">
                  {/* Become A Host btn */}
                  <div className="hidden md:block">
                    {/* {!user && ( */}
                    {/* <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!user}
                    className="disabled:cursor-not-allowed cursor-pointer hover:bg-neutral-100 py-3 px-4 text-sm font-semibold rounded-full  transition"
                  >
                    Host your home
                  </button> */}
                    {/* )} */}
                  </div>
                  {/* Modal */}
                  {/* <HostRequest
                  isOpen={isModalOpen}
                  closeModal={closeModal}
                  modalHandler={modalHandler}
                ></HostRequest> */}
                  {/* Dropdown btn */}
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                  >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                      {/* Avatar */}
                      <img
                        className="rounded-full"
                        referrerPolicy="no-referrer"
                        src={user && user.photoURL ? user.photoURL : avatarImg}
                        alt="profile"
                        height="30"
                        width="30"
                      />
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                      {role === 'employee' ? (
                        <EmployeeMenu></EmployeeMenu>
                      ) : role === 'Hr Manager' ? (
                        <HrMenu></HrMenu>
                      ) : (
                        ''
                      )}

                      {user ? (
                        <>
                          <p className="pl-4">{user?.displayName}</p>
                          <div
                            onClick={handleLogout}
                            className="px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer"
                          >
                            Logout
                          </div>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
