import React from 'react';
import { TbFidgetSpinner } from 'react-icons/tb';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',

    backgroundColor: '#EEEEEE',
  },
};
Modal.setAppElement(document.getElementById('root'));
const DetailsAdd = ({ asset, isLoading }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let subtitle;
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  //Request asset========

  const handleRequest = e => {
    e.preventDefault();
    const form = e.target;
    const note = form.note.value;

    const requesterData = {
      reqName: user?.displayName,
      reqPhoto: user?.photoURL,
      reqEmail: user?.email,
      reqDate: new Date(),
      note: note,
      assetName: asset?.productName,
      assetType: asset?.productType,
      assetQty: asset?.productQty,
      assetId: asset?._id,
      reqStatus: 'pending',
      posterEmail: asset?.posterEmail,
    };
    console.log(requesterData);

    axiosSecure.post(`/requestAsset`, requesterData).then(res => {
      console.log(res.data);
      if (res.data.insertedId) {
        form.reset();
        // refetch();
        Swal.fire({
          title: 'Requested!',
          text: 'Your request has been send.',
          icon: 'success',
        });
        closeModal();
      }
    });
  };

  return (
    <tr>
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
        <p className="text-gray-900 whitespace-no-wrap">{asset?.productType}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{asset?.status}</p>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          disabled={asset?.status === 'Out Of Stock'}
          onClick={openModal}
          className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight disabled:cursor-not-allowed"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
          ></span>
          <span className="relative">REQUEST</span>
        </button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={_subtitle => (subtitle = _subtitle)}></h2>

          <form onSubmit={handleRequest}>
            <div className="w-48 bg-green-200">
              <label htmlFor="email" className="block mb-2 text-sm">
                Write Your Note
              </label>
              <textarea
                rows={10}
                type="text"
                name="note"
                id="note"
                placeholder="Enter Your Note Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                data-temp-mail-org="0"
              />
            </div>
            {/* <div className="hidden">
              <div>
                <input
                  defaultValue={asset?.productName}
                  type="text"
                  name="assetName"
                  id="assetName"
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
              <div>
                <input
                  defaultValue={asset?.productType}
                  type="text"
                  name="assetType"
                  id="assetType"
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
              <div>
                <input
                  defaultValue={asset?.productQty}
                  type="text"
                  name="assetQty"
                  id="assetQty"
                  placeholder="Enter Your Name Here"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                  data-temp-mail-org="0"
                />
              </div>
            </div> */}
            <div>
              <button
                type="submit"
                className="bg-[#FEBF32] w-full rounded-md py-3 text-white mt-3"
              >
                {isLoading ? (
                  <TbFidgetSpinner className="animate-spin mx-auto" />
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
          <button
            className="px-3 py-2 bg-red-400 rounded-xl mt-3"
            onClick={closeModal}
          >
            Close
          </button>
        </Modal>
      </td>
    </tr>
  );
};

export default DetailsAdd;
