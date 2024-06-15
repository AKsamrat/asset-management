import React, { useState } from 'react';
import useAxiosCommon from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import DetailsAdd from './DetailsAdd';
import { Helmet } from 'react-helmet-async';

const ReqForAsset = () => {
  const axiosCommon = useAxiosCommon();
  const [search, setSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [itemperPage, setItemperPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
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
        `/employee-assets?page=${currentPage}&size=${itemperPage}&search=${search}&filter=${filter}&sort=${sort}`
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

  return (
    <div className="mx-w-5xl pt-24 mx-auto px-5 md:px-8 lg:px-20 ">
      <Helmet>
        <title>Employee | Req. for Asset</title>
      </Helmet>
      <h1 className="text-center text-4xl font-bold">
        Make <span className="text-[#FEBF32]">Request</span>
      </h1>
      <p className="text-center text-lg py-3">
        Here Your All Assets for make request
      </p>
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
        {/* filter by availability=========================================== */}

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
            <option value="">Filter By Availability</option>
            <option value="available">Available</option>
            <option value="Out Of Stock">Out Of Stock</option>
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
        <div className="  px-4 sm:px-8 py-4 overflow-x-auto mx-auto max-w-5xl">
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
                    Availability
                  </th>

                  <th
                    scope="col"
                    className="px-5 py-3 bg-[#FEBF32]  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-semibold"
                  >
                    Button
                  </th>
                </tr>
              </thead>
              <tbody>
                {allAssets.map(asset => (
                  <DetailsAdd
                    key={asset._id}
                    asset={asset}
                    isLoading={isLoading}
                  ></DetailsAdd>
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

export default ReqForAsset;
