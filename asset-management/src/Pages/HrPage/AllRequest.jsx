import React, { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import AllRequestData from './AllRequestData';
import useAuth from '../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

const AllRequest = () => {
  const { user } = useAuth();
  const axiosCommon = useAxiosCommon();
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [itemperPage, setItemperPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const {
    data: allAssets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/requestedAssets-hrManger/${user?.email}?page=${currentPage}&size=${itemperPage}&search=${search}`
      );
      console.log(data);
      return data;
    },
    queryKey: ['allAssets', count, search, currentPage, itemperPage],
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
      const { data } = await axiosCommon('/requestAssetsCount');
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

  return (
    <div className="mx-w-7xl pt-24 mx-auto px-5 md:px-8 lg:px-20 ">
      <Helmet>
        <title>Hr | All request</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        All <span className="text-[#FEBF32]">Request</span>
      </h1>
      <p className="text-center text-lg">Here Your All Request</p>
      <div className="flex justify-center items-center gap-3">
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
                placeholder="Enter employee name"
                aria-label="Enter employee name"
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

        <button
          onClick={handleReset}
          className="px-1 md:px-4 py-2 text-sm bg-[#FEBF32] text-white rounded-lg"
        >
          Reset
        </button>
      </div>
      <div className="py-8">
        <div className=" sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Asset Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Asset Type
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Email of Requester
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Name of Requester
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Req. Date
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Note
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Status
                  </th>

                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Reject
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Approve
                  </th>
                </tr>
              </thead>
              <tbody>
                {allAssets.map(asset => (
                  <AllRequestData
                    key={asset?._id}
                    refetch={refetch}
                    asset={asset}
                  ></AllRequestData>
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

export default AllRequest;
