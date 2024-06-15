import React from 'react';
import { EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const EmployeeQuery = () => {
  const axiosCommon = useAxiosCommon();
  const { user } = useAuth();

  const {
    data: messDatas = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(`/query-empMessage/${user?.email}`);
      console.log(data);
      return data;
    },
    queryKey: ['messDatas ', user?.email],
  });

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mt-10">
        Employee <span className="text-[#FEBF32]">Massages</span>
      </h1>
      <p className="text-center text-lg my-3">
        Here is your all employee messages
      </p>
      <Swiper
        slidesPerView={3}
        centeredSlides={true}
        spaceBetween={11}
        grabCursor={true}
        autoplay={{
          delay: 2700,
          disableOnInteraction: true,
        }}
        modules={[Autoplay]}
        className="mySwiper md:h-[400px]"
      >
        {messDatas?.map(datas => (
          <SwiperSlide key={datas._id}>
            <div>
              <div className="container flex flex-col w-full max-w-lg p-6 mx-auto divide-y rounded-md dark:divide-gray-300 dark:bg-gray-50 dark:text-gray-800 border-2 border-[#FEBF32] mt-6 h-[300px]">
                <div className="flex justify-between p-4 h-full">
                  <div className="flex space-x-4 ">
                    <div>
                      <img
                        src={datas?.empPhoto}
                        alt=""
                        className="object-cover w-12 h-12 rounded-full dark:bg-gray-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{datas?.empName}</h4>
                      <span className="text-xs dark:text-gray-600">
                        {new Date(datas?.postdate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-sm dark:text-gray-600">
                  <p>{datas?.message}</p>
                </div>

                <Link
                  to={`mes-reply/${datas._id}`}
                  className="flex justify-center items-center mt-2 mx-4"
                >
                  <button
                    disabled={datas?.status === 'replied'}
                    // onClick={`mes-reply/${datas._id}`}
                    className="relative cursor-pointer inline-block  py-2 font-semibold text-green-900 leading-tight disabled:cursor-not-allowed bg-[#FEBF32] rounded-full px-10"
                  >
                    Reply
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default EmployeeQuery;
