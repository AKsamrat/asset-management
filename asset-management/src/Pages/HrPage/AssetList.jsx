import React, { useState } from 'react';
import useAxiosCommon from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import UpdateAssetModal from '../../Component/Modal/UpdateAssetModal';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AssetList = () => {
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [itemperPage, setItemperPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [availability, setAvailability] = useState('');
  // const [isOpen, setIsOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  console.log(sort);
  const {
    data: allAssets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(
        `/all-assets/${user?.email}?page=${currentPage}&size=${itemperPage}&search=${search}&filter=${filter}&sort=${sort}&availability=${availability}`
      );
      console.log(data);
      return data;
    },
    queryKey: [
      'allAssets',
      filter,
      count,
      search,
      currentPage,
      itemperPage,
      sort,
      availability,
    ],
  });
  const handleSearch = e => {
    e.preventDefault();

    setSearch(searchText);
    refetch();
    // mutateAsync(search);
  };
  const handleReset = () => {
    setSearch('');
    setSearchText('');
    setSort('');
    setFilter('');
    setAvailability('');
  };

  //for pagination------

  const numberOfpages = Math.ceil(count / itemperPage);
  const pages = [...Array(numberOfpages).keys()];

  const handleItemsPerPage = e => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setItemperPage(val);
    setCurrentPage(0);
  };

  const { data: assetCount } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon('/assetsCount');
      console.log(data);
      // refetch();
      setCount(data.count);

      return data;
    },
    queryKey: ['assetCount', search],
  });

  const handlePreviouspage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextpage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  //delete asset========

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/asset/${id}`).then(res => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
            });
          }
        });
      }
    });
  };
  return (
    <div className="mx-w-5xl pt-24 mx-auto px-5 md:px-8 lg:px-20 ">
      <Helmet>
        <title>Hr | Asset List</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        Asset <span className="text-[#FEBF32]">LIST</span>
      </h1>
      <p className="text-center text-lg">Here Your All Assets</p>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-3">
        {/* search=================================== */}

        <div className="flex justify-center items-center gap-4 my-6">
          <form onSubmit={handleSearch}>
            <div className=" p-1 overflow-hidden      focus-within:border-blue-400 ">
              <input
                className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent border rounded-lg"
                type="text"
                onChange={e => setSearchText(e.target.value)}
                value={searchText}
                name="search"
                placeholder="Enter asset name"
                aria-label="Enter asset name"
              />

              <button
                type="submit"
                className="px-1 md:px-4 py-2 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-[#FEBF32] rounded-md hover:bg-gray-600 focus:bg-[#3facb2] focus:outline-none"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filter=========================================== */}

        <div className="flex justify-center items-center">
          <select
            onChange={e => {
              setFilter(e.target.value);
            }}
            value={filter}
            name="productType"
            id="productType"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#FEBF32]"
          >
            <option value="" className="font-semibold">
              Filter By Type
            </option>
            <option value="returnable">Returnable</option>
            <option value="non-returnable">Non-Returnable</option>
          </select>
        </div>
        {/* Filter=========================================== */}
        <div>
          <select
            onChange={e => {
              setAvailability(e.target.value);
              // setCurrentPage(1);
            }}
            value={availability}
            name="sort"
            id="sort"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#FEBF32]"
          >
            <option value="">Filter By Availability</option>
            <option value="available">Available</option>
            <option value="Out Of Stock">Out Of Stock</option>
          </select>
        </div>
        {/* sort=========================================== */}

        <div>
          <select
            onChange={e => {
              setSort(e.target.value);
              // setCurrentPage(1);
            }}
            value={sort}
            name="sort"
            id="sort"
            className="px-1 md:px-4 py-2 border text-sm rounded-lg border-[#FEBF32]"
          >
            <option value="">Sort By Quantity</option>
            <option value="dsc">Descending Order</option>
            <option value="asc">Ascending Order</option>
          </select>
        </div>
        <button
          onClick={handleReset}
          className="px-1 md:px-4 py-2 text-sm bg-[#FEBF32] text-white rounded-lg"
        >
          Reset
        </button>
      </div>
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Added Date
                  </th>

                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Delete
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Update
                  </th>
                </tr>
              </thead>
              <tbody>
                {allAssets.map(asset => (
                  <tr
                    data-aos="fade-left"
                    data-aos-duration="1000"
                    key={asset._id}
                  >
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {asset?.productName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {asset?.productType}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {asset?.productQty} Pcs
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(asset?.addetDate).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleDelete(asset?._id)}
                        className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Delete</span>
                      </button>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Link
                        to={`/updateAsset/${asset?._id}`}
                        className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Update</span>
                      </Link>
                      {/* Update Modal */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="pagination ">
        <button onClick={handlePreviouspage}>Prev</button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`hidden ${
              currentPage === p ? 'bg-[#FEBF32] text-white' : ''
            } px-4 py-2 mx-1 transition-colors duration-300 transform  rounded-md sm:inline hover:bg-[#ffd16c] hover:text-white`}
          >
            {p}
          </button>
        ))}

        <button onClick={handleNextpage}>Next</button>

        <select value={itemperPage} onChange={handleItemsPerPage} name="" id="">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  );
};

export default AssetList;
