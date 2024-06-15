import React from 'react';

import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { EffectFade, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

const MsgReply = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  //Request asset========

  const handleRequest = e => {
    e.preventDefault();
    const form = e.target;
    const note = form.message.value;

    const requesterData = {
      repName: user?.displayName,
      repPhoto: user?.photoURL,

      repDate: new Date(),
      reply: note,
      // assetName: asset?.productName,
      // assetType: asset?.productType,
      // assetQty: asset?.productQty,
      // assetId: asset?._id,
      // reqStatus: 'pending',
      // posterEmail: asset?.posterEmail,
    };
    console.log(requesterData);

    axiosSecure.patch(`/message-reply/${id}`, requesterData).then(res => {
      console.log(res.data);
      if (res.data.modifiedCount) {
        form.reset();
        // refetch();
        navigate('/');
        Swal.fire({
          title: 'Sent!',
          text: 'Your reply has been send.',
          icon: 'success',
        });
      }
    });
  };

  return (
    <div className="w-4xl  pt-20 ">
      <h1 className="text-center text-4xl font-bold mt-10">
        Reply <span className="text-[#FEBF32]">Here</span>
      </h1>
      <form
        onSubmit={handleRequest}
        className="w-96  bg-slate-100 mx-auto mt-8 "
      >
        <div>
          <label htmlFor="message" className="text-sm">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="10"
            className="w-full p-3 rounded bg-gray-100"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="bg-[#FEBF32] w-full rounded-md py-3 text-white mt-3"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MsgReply;
