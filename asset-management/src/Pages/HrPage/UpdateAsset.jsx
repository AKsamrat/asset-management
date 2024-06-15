import React from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const UpdateAsset = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const axiosCommon = useAxiosCommon();
  const axiosSecure = useAxiosSecure();
  const { data: asset } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(`/singleAsset/${id}`);
      console.log(data);
      // refetch();
      return data;
    },
    queryKey: ['asset', id],
  });
  const onSubmit = async data => {
    const assetData = {
      productName: data.name,
      productType: data.category,
      productQty: parseInt(data.qty),
      status: 'available',
      addetDate: new Date(),
    };
    const assetRes = await axiosSecure.put(`/updateAsset/${id}`, assetData);
    console.log(assetRes.data);
    if (assetRes?.data?.modifiedCount > 0) {
      reset();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your data has been Updated',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/asset-list');
    }
    // toast.error('product already exist');
  };
  return (
    <div className="mx-w-7xl pt-24 ">
      <Helmet>
        <title>Update Asset</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        Update <span className="text-[#FEBF32]">ASSET</span>
      </h1>
      <p className="text-center text-lg">
        Please update your valuable asset Correctly
      </p>
      <div className="bg-slate-100 p-16 max-w-4xl mx-auto mt-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
            <div className="col-span-full ">
              <label htmlFor="address" className="text-sm ">
                Product Name
              </label>
              <input
                {...register('name', { required: true })}
                defaultValue={asset?.productName}
                id="name"
                name="name"
                type="text"
                placeholder=" Recipe Name"
                className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300 py-3"
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="address" className="text-sm">
                Product Type
              </label>
              <select
                defaultValue={asset?.productType}
                {...register('category', { required: true })}
                className="w-full py-3"
              >
                <option value="returnable">Returnable</option>
                <option value="non-returnable">Non-Returnable</option>
              </select>
            </div>
            <div className="col-span-full sm:col-span-3">
              <label htmlFor="lastname" className="text-sm">
                Product Quantity
              </label>
              <input
                {...register('qty', { required: true })}
                defaultValue={asset?.productQty}
                id="qty"
                name="qty"
                type="number"
                placeholder="Quantity"
                className="w-full rounded-md focus:ring focus:ring-opacity-75 dark:text-gray-50 focus:dark:ring-violet-600 dark:border-gray-300 py-3"
              />
            </div>
          </div>
          <button
            className="px-3 py-2 rounded-xl font-semibold w-full mt-10 bg-[#FEBF32]"
            type="submit"
          >
            Update Asset
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAsset;
