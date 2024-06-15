import React, { useRef } from 'react';
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const UpdateAssetModal = ({
  setIsEditModalOpen,
  isEditModal,
  room,
  refetch,
}) => {
  const { register, handleSubmit, reset } = useForm();
  let refDiv = useRef(null);

  const axiosSecure = useAxiosSecure();

  const onSubmit = async data => {
    const assetData = {
      productName: data.name,
      productType: data.category,
      productQty: parseInt(data.qty),
      status: 'available',
      addetDate: new Date(),
    };
    const assetRes = await axiosSecure.post('/addAsset', assetData);
    console.log(assetRes.data);
    if (assetRes.data.insertedId) {
      reset();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your data has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    toast.error('product already exist');
  };
  return (
    <Transition appear show={isEditModal} as={Fragment}>
      <Dialog
        as="div"
        // initialFocus={refDiv}
        className="relative z-10"
        onClose={() => setIsEditModalOpen(false)}
      >
        {/* <div ref={refDiv}> */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium text-center leading-6 text-gray-900"
                >
                  Update Asset info
                </DialogTitle>
                <div className="mt-2 w-full">
                  {/* Update room form */}
                  {/* <UpdateRoomForm
                    handleSubmit={handleSubmit}
                    dates={dates}
                    handleDates={handleDates}
                    roomData={roomData}
                    loading={loading}
                    handleImage={handleImage}
                    setRoomData={setRoomData}
                  /> */}
                  {/* <div className="bg-slate-100 p-6 max-w-4xl mx-auto mt-10">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                          <div className="col-span-full ">
                            <label htmlFor="address" className="text-sm ">
                              Product Name
                            </label>
                            <input
                              {...register('name', { required: true })}
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
                              {...register('category', { required: true })}
                              className="w-full py-3"
                            >
                              <option value="returnable">Returnable</option>
                              <option value="non-returnable">
                                Non-Returnable
                              </option>
                            </select>
                          </div>
                          <div className="col-span-full sm:col-span-3">
                            <label htmlFor="lastname" className="text-sm">
                              Product Quantity
                            </label>
                            <input
                              {...register('qty', { required: true })}
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
                    </div> */}
                </div>
                <hr className="mt-8 " />
                <div className="mt-2 ">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
        {/* </div> */}
      </Dialog>
    </Transition>
  );
};

export default UpdateAssetModal;
