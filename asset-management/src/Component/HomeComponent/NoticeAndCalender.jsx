import { Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Link } from 'react-router-dom';
import { Calendar, DateRange } from 'react-date-range';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';

const NoticeAndCalender = () => {
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();

  const hrData = {
    email: user?.email,
    name: user?.displayName,
  };
  const {
    data: messAnswer = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(`/reply-empMessage/${user?.email}`);
      console.log(data);
      return data;
    },
    queryKey: ['messAnswer ', user?.email],
  });

  const handleMessage = e => {
    e.preventDefault();
    const form = e.target;
    const empName = form.name.value;
    const empEmail = form.email.value;
    const message = form.message.value;
    const messageData = {
      reqEmail: user?.email,
      reqName: user?.displayName,
      empName,
      empEmail,
      message,
      empPhoto: user?.photoURL,
      postdate: new Date(),
    };
    axiosCommon.post(`/send-massage`, messageData).then(res => {
      console.log(res.data);
      if (res.data.insertedId) {
        form.reset();
        Swal.fire({
          title: 'Added!',
          text: 'Your file has been added.',
          icon: 'success',
        });
      }
    });
  };
  return (
    <div>
      <h1 className="text-center text-4xl font-bold">
        Important <span className="text-[#FEBF32]">Notice</span>
      </h1>
      <p className="text-center text-lg py-3">
        Please Find Your Important Notice From Here
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-10">
        <div className="col-span-2">
          <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 dark:bg-gray-100 dark:text-gray-800">
            <div className="flex flex-col justify-between">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold leading-tight lg:text-5xl">
                  Let's talk!
                </h2>
                <div className="dark:text-gray-600">
                  Send your Message to Hr Manager
                </div>
              </div>
              <img src="./cCare.png" alt="" className="p-6 h-52 md:h-64" />
            </div>
            <form onSubmit={handleMessage} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm">
                  Full name
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  placeholder=""
                  className="w-full p-3 rounded bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  name="Email"
                  id="email"
                  type="email"
                  className="w-full p-3 rounded bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="3"
                  className="w-full p-3 rounded bg-gray-100"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-[#FEBF32] w-full rounded-md py-3 text-white"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* notice section */}

        <div className="col-span-1 ">
          <div className="bg-[#FEBF32] p-4 mt-16 rounded-t-xl">
            <h3 className="text-center text-2xl font-bold">NOTICE</h3>
          </div>
          <div className="">
            <Swiper
              slidesPerView={4}
              centeredSlides={true}
              // spaceBetween={5}
              grabCursor={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: true,
              }}
              direction={'vertical'}
              modules={[Autoplay]}
              className="mySwiper h-[400px]"
            >
              <SwiperSlide>
                <Link>
                  <div className="flex justify-center items-center gap-4  border-2 rounded-xl border-[#FEBF32] ">
                    <div className="bg-[#FEBF32] h-16  p-2 rounded-lg">
                      <p className="text-lg text-center">21</p>
                      <p className="font-bold text-xl">NOV</p>
                    </div>
                    <p>
                      Dear employee if you are facing any problem to send
                      request or to returnable issue please feel free to contact
                      with Hr manager
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link>
                  <div className="flex justify-center items-center gap-4  border-2 rounded-xl border-[#FEBF32] ">
                    <div className="bg-[#FEBF32] h-16  p-2 rounded-lg">
                      <p className="text-lg text-center">21</p>
                      <p className="font-bold text-xl">NOV</p>
                    </div>
                    <p>
                      Dear employee if you are facing any problem to send
                      request or to returnable issue please feel free to contact
                      with Hr manager
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link>
                  <div className="flex justify-center items-center gap-4  border-2 rounded-xl border-[#FEBF32] ">
                    <div className="bg-[#FEBF32] h-16  p-2 rounded-lg">
                      <p className="text-lg text-center">21</p>
                      <p className="font-bold text-xl">NOV</p>
                    </div>
                    <p>
                      Dear employee if you are facing any problem to send
                      request or to returnable issue please feel free to contact
                      with Hr manager
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link>
                  <div className="flex justify-center items-center gap-4  border-2 rounded-xl border-[#FEBF32] ">
                    <div className="bg-[#FEBF32] h-16  p-2 rounded-lg">
                      <p className="text-lg text-center">21</p>
                      <p className="font-bold text-xl">NOV</p>
                    </div>
                    <p>
                      Dear employee if you are facing any problem to send
                      request or to returnable issue please feel free to contact
                      with Hr manager
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link>
                  <div className="flex justify-center items-center gap-4  border-2 rounded-xl border-[#FEBF32] ">
                    <div className="bg-[#FEBF32] h-16  p-2 rounded-lg">
                      <p className="text-lg text-center">21</p>
                      <p className="font-bold text-xl">NOV</p>
                    </div>
                    <p>
                      Dear employee if you are facing any problem to send
                      request or to returnable issue please feel free to contact
                      with Hr manager
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link>
                  <div className="flex justify-center items-center gap-4  border-2 rounded-xl border-[#FEBF32] ">
                    <div className="bg-[#FEBF32] h-16  p-2 rounded-lg">
                      <p className="text-lg text-center">21</p>
                      <p className="font-bold text-xl">NOV</p>
                    </div>
                    <p>
                      Dear employee if you are facing any problem to send
                      request or to returnable issue please feel free to contact
                      with Hr manager
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
      <h1 className="text-center text-4xl font-bold">
        Previous Message <span className="text-[#FEBF32]">Answer</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 my-8">
        {messAnswer?.map(answer => (
          <div
            key={answer?._id}
            className="max-w-md p-6 overflow-hidden rounded-lg shadow dark:bg-gray-50 dark:text-gray-800 border-2 border-[#FEBF32]"
          >
            <article>
              <h2 className="text-[14px] font-medium pb-3">
                {' '}
                <span className="font-bold">Qsn :</span> {answer?.message}
              </h2>
              <hr />
              <p className="mt-4 text-gray-500">
                {' '}
                <span className="font-bold">Reply :</span> {answer?.reply}
              </p>
              <div className="flex items-center mt-8 space-x-4">
                <img
                  src={answer?.repPhoto}
                  alt=""
                  className="w-10 h-10 rounded-full dark:bg-gray-500"
                />
                <div>
                  <h3 className="text-sm font-medium">{answer?.repName}</h3>
                  <time className="text-sm dark:text-gray-600">
                    {new Date(answer?.repDate).toLocaleDateString()}
                  </time>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeAndCalender;
