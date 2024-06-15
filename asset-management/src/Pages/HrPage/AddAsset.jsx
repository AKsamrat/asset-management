import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import useAuth from '../../hooks/useAuth';

const AddAsset = () => {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const axiosSecure = useAxiosSecure();
  const onSubmit = async data => {
    const assetData = {
      productName: data.name,
      productType: data.category,
      productQty: parseInt(data.qty),
      status: 'available',
      addetDate: new Date(),
      reqCount: 0,
      posterEmail: user?.email,
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
    <div className="mx-w-7xl pt-24 ">
      <Helmet>
        <title>Hr|Add Asset</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        Add <span className="text-[#FEBF32]">ASSET</span>
      </h1>
      <p className="text-center text-lg">
        Please add your valuable asset Correctly
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
                <option value="non-returnable">Non-Returnable</option>
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
            Add Asset
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
