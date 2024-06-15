import { Link } from 'react-router-dom';
import { EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import img1 from '../../assets/banner5.png';
import img2 from '../../assets/bann2.jpg';

import { useState } from 'react';

const Banner = () => {
  return (
    <div className="max-w-7xl mx-auto pt-16  ">
      <div className=" relative">
        <Swiper
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, EffectFade]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="carousel-item relative w-full style h-[550px]">
              <img src={img2} className="w-full rounded-xl overflow-hidden" />
              <div className="absolute rounded-xl flex  items-center h-full left-0 top-0 bg-gradient-to-r from-[#151515] from-10% via-[#151515] via-10%  to-[rgba(21, 21, 21, 0)]  overflow-hidden ">
                <div className=" text-white space-y-10 ml-6 lg:ml-20 ">
                  <h2 className="text-5xl font-bold">
                    If you want to <br />{' '}
                    <span className="text-[#FEBF32]">make your</span> business
                    <br /> Smarter
                  </h2>
                  <p>Grape Package And start your business here</p>
                  <div>
                    <Link
                      to={'/hr-registration'}
                      className=" mr-5 bg-[#FEBF32]  px-6 py-2 rounded-xl text-white font-medium 
                      text-lg uppercase "
                    >
                      Join As HR
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="carousel-item relative w-full style h-[550px]">
              <img src={img1} className="w-full rounded-xl" />
              <div className="absolute rounded-xl flex  items-center h-full left-0 top-0 bg-gradient-to-r from-[#151515] from-10% via-[#151515] via-10%  to-[rgba(21, 21, 21, 0)]   ">
                <div className=" text-white space-y-10 ml-6 lg:ml-20 ">
                  <h2 className="text-5xl font-bold">
                    Searching for a job ?<br /> Find the{' '}
                    <span className="text-[#FEBF32]">best Startup</span> <br />{' '}
                    Job that fit you
                  </h2>
                  <p>
                    A good employee is the power of key of a company <br />
                  </p>
                  <div>
                    <Link
                      to={'/employee-registration'}
                      className=" mr-5 bg-[#FEBF32]  px-6 py-2 rounded-xl text-white font-medium 
                      text-lg uppercase"
                    >
                      Join As Employee
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        {/* <div className="carousel w-full h-[600px]  object-fill mt-7">
      </div> */}
      </div>
    </div>
  );
};

export default Banner;
