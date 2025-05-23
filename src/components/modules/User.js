import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function User() {
  const backendUrl = "http://localhost:5000";
  const { userid } = useParams();
  const [user, setuser] = useState(null);
  const [activeForm, setActiveForm] = useState("all");
  const [pooja, setpooja] = useState([]);
  const [credit, setcredit] = useState([]);
  const [product, setproduct] = useState([]);
  const [pandit, setpandit] = useState([]);

  const getuserdata = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/usersection/user/${userid}`
      );
      const data = await response.json();
      setuser(data);
    } catch (error) {
      toast.error("Failed to fetch user data");
    }
  };

  const getpoojaorderhistory = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/orderhistory/pooja/${userid}`
      );
      const data = await response.json();
      setpooja(data?.orderHistory || []);
    } catch (error) {
      toast.error("Failed to fetch user data");
      setpooja([]);
    }
  };

  const getOrderHistoryForCredits = async () => {
    try {
      const response = await fetch(
        // `${backendUrl}/api/orderhistory/credit/67c6a309c32095fac3c51ed0`
        `${backendUrl}/api/orderhistory/credit/${userid}`
      );
      const data = await response.json();
      setcredit(data?.orderHistory || []);
      console.log("Credit Order History:", data);
    } catch (error) {
      toast.error("Failed to fetch user data");
      setcredit([]);
      console.log(error);
    }
  };

  const getOrderHistoryForProducts = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/orderhistory/product/${userid}`
      );
      const data = await response.json();
      setproduct(data?.orderHistory || []);
      console.log("product Order History:", data);
    } catch (error) {
      toast.error("Failed to fetch user data");
      setproduct([]);
      console.log(error);
    }
  };

  const getPanditBookingHistory = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/pandit/pandit-booking-history/${userid}`
      );
      const data = await response.json();
      setpandit(data?.bookings || []);
      console.log(data.bookings);
    } catch (error) {
      toast.error("Failed to fetch user data");
      setpandit([]);
      console.log(error);
    }
  };
  useEffect(() => {
    getuserdata();
  }, [userid]);

  useEffect(() => {
    if (activeForm === "pooja") {
      getpoojaorderhistory();
    }
    if (activeForm === "credit") {
      getOrderHistoryForCredits();
    }
    if (activeForm === "product") {
      getOrderHistoryForProducts();
    }
    if (activeForm === "pandit") {
      getPanditBookingHistory();
    }
  }, [user, activeForm]);

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-red-700">User Dashboard</h2>

      {user ? (
        <div className="flex justify-start gap-6">
          <div className="bg-gradient-to-br from-white via-green-50 to-green-100 border-green-300 transition-transform duration-300 hover:scale-[1.02] rounded-3xl p-4 border md:w-[70%] w-full flex mt-5 gap-4">
            <div className="flex justify-start items-center">
              {user?.profileImage ? (
                <img
                  src={user.
                    profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              ) : (
                <img
                  src="/user.jpg"
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
              )}
            </div>
            <div className="flex flex-1 ">
              <table className="w-full flex-1 border-spacing-y-3 border-spacing-x-3">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td className="font-bold text-green-900">
                      {user.fullName}
                    </td>
                    <th className="border-l-2 border-gray-300 pl-4">Email</th>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td>{user.mobileNumber}</td>
                    <th className="border-l-2 border-gray-300 pl-4">City</th>
                    <td>{user.city}</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>{user.gender}</td>
                    <th className="border-l-2 border-gray-300 pl-4">
                      Occupation
                    </th>
                    <td>{user.occupation}</td>
                  </tr>
                  <tr>
                    <th>Gotra</th>
                    <td>{user.gotra}</td>
                    <th className="border-l-2 border-gray-300 pl-4">
                      Available Credits
                    </th>
                    <td>{user.available_credits}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1 mt-5 border-l-2 border-gray-300 pl-6">
            <div className="bg-white shadow-md rounded-xl p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                🕒 Last Login
              </h2>
              <p className="text-gray-600">
                {user.lastLogin || "No login data available"}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                💳 Last Transaction
              </h2>
              <p className="text-gray-600">
                {user.lastTransaction || "No transaction data available"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No user found</p>
      )}
      <div className="w-full flex justify-center items-center mt-10">
        <div className="grid grid-cols-8 gap-7 w-full m-auto justify-center items-center">
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("all");
            }}
          >
            All
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("pooja");
              getpoojaorderhistory();
            }}
          >
            Pooja
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("yatra");
            }}
          >
            Yatra
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("product");
            }}
          >
            Product
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("astro");
            }}
          >
            Astro
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("pandit");
            }}
          >
            Pandit
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("AI");
            }}
          >
            AI
          </h1>
          <h1
            className="text-center font-bold text-lg text-gray-800 cursor-pointer bg-gradient-to-tr from-white to-gray-100 hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-2xl px-4 py-2"
            onClick={() => {
              setActiveForm("credit");
            }}
          >
            Credit
          </h1>
        </div>
      </div>

      <section className="flex justify-center mt-10 w-full">
        {activeForm === "all" && <div>All</div>}
        {activeForm === "pooja" && (
          <div className="w-full h-screen">
            {pooja.length === 0 ? (
              <div className="p-4 bg-gray-100 rounded-md mb-4 shadow">
                <p className="text-gray-600">No Pooja order history found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pooja.map((item, index) => (
                  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-extrabold text-red-900 mb-2">
                      {item.pooja_name}
                    </h2>
                    <p className="text-lg text-gray-500 mb-4">
                      {item.poojaType} Pooja
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                      <div>
                        <span className="text-lg font-bold">Package:</span>{" "}
                        {item.package_name}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Place:</span>{" "}
                        {item.place}
                      </div>
                      <div>
                        <span className="text-lg font-bold">
                          Package Price:
                        </span>{" "}
                        ₹{item.package_price}
                      </div>
                      <div>
                        <span className="text-lg font-bold">GST %:</span>{" "}
                        {item.gst_percentage}%
                      </div>
                      <div>
                        <span className="text-lg font-bold">GST Amount:</span> ₹
                        {item.gst_amount}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Before GST:</span> ₹
                        {item.total_amount_before_gst}
                      </div>
                      <div>
                        <span className="text-lg font-bold">
                          Total (After GST):
                        </span>{" "}
                        ₹{item.total_amount_after_gst}
                      </div>
                      <div>
                        <span className="text-lg font-bold">
                          Payment Status:
                        </span>
                        <span
                          className={`ml-1 font-semibold ${item.payment_status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.payment_status}
                        </span>
                      </div>
                      <div>
                        <span className="text-lg font-bold">Payment Date:</span>{" "}
                        {new Date(item.payment_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Booked On:</span>{" "}
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Pooja Status:</span>{" "}
                        {item.pooja_status}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Pooja Date:</span>{" "}
                        {new Date(item.perform_pooja_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Pooja Time:</span>{" "}
                        {item.perform_pooja_time}
                      </div>
                      <div className="col-span-2">
                        <span className="text-lg font-bold">Live URL:</span>{" "}
                        <a
                          href={item.live_url}
                          target="_blank"
                          className="text-blue-600 underline ml-1"
                        >
                          {item.live_url}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {item.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.image_url}
                          alt={`Image ${i + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeForm === "yatra" && <div>Yatra</div>}
        {activeForm === "product" && <div>Product</div>}
        {activeForm === "astro" && <div>Astro</div>}
        {activeForm === "pandit" && (
          <div className="w-full h-screen">
            {pandit.length === 0 ? (
              <div className="p-4 bg-gray-100 rounded-md mb-4 shadow">
                <p className="text-gray-600">No pandit order history found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pandit.map((item, index) => (
                  <div
                    key={index}
                    className="max-w-2xl mx-auto bg-gradient-to-br from-white via-orange-50 to-orange-100 border border-orange-300 shadow-lg rounded-2xl p-6 mt-6 transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <h2 className="text-2xl font-extrabold text-orange-800 mb-2 tracking-wide">
                      📅 Booking Details
                    </h2>

                    <div className="text-gray-700 text-sm grid grid-cols-2 gap-y-3 gap-x-6">
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          User Name:
                        </span>
                        {item.userName}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Contact:
                        </span>
                        {item.contactNumber}
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold text-orange-800 mr-2">
                          Address:
                        </span>
                        {item.address}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Latitude:
                        </span>
                        {item.latitude}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Longitude:
                        </span>
                        {item.longitude}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          House No:
                        </span>
                        {item.houseNumber}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Near Landmark:
                        </span>
                        {item.nearLandmark}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Date:
                        </span>
                        {new Date(item.bookingDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Time:
                        </span>
                        {item.bookingTime}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-800 mr-2">
                          Status:
                        </span>
                        <span className="ml-2 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-yellow-200 text-yellow-800">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeForm === "credit" && (
          <div className="w-full h-screen">
            {credit.length === 0 ? (
              <div className="p-4 bg-gray-100 rounded-md mb-4 shadow">
                <p className="text-gray-600">No credit order history found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {credit.map((item, index) => (
                  <div
                    key={index}
                    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                  >
                    <h2 className="text-2xl font-extrabold text-red-900 mb-2">
                      Credit Plan
                    </h2>
                    <p className="text-md text-gray-500 mb-4 italic">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                      <div>
                        <span className="text-lg font-bold">
                          Credit Amount:
                        </span>{" "}
                        ₹{item.creditAmount}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Credit:</span>{" "}
                        {item.credit}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Extra Credit:</span>{" "}
                        {item.extraCredit}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Offer:</span>{" "}
                        {item.offer}%
                      </div>
                      <div>
                        <span className="text-lg font-bold">Valid Upto:</span>{" "}
                        {item.validUpto}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Voice/Min:</span>{" "}
                        {item.voicePerMinute}
                      </div>
                      <div>
                        <span className="text-lg font-bold">
                          Questions/Credit:
                        </span>{" "}
                        {item.questionPerCredit}
                      </div>
                      <div>
                        <span className="text-lg font-bold">Payment Date:</span>{" "}
                        {new Date(item.payment_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeForm === "AI" && <div>AI</div>}
      </section>
    </div>
  );
}
