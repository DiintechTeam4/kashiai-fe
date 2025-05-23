import React, { useEffect, useState } from "react";
import DeleteWithConfirmation from "../DeleteWithConfirmation";
import { toast } from "react-toastify";
import { Clock, UserCheck, Loader2, CheckCircle, Smile } from "lucide-react";

export default function Pandit() {
  const backendUrl = "http://localhost:5000";

  const languages = ["Hindi", "Sanskrit", "Tamil", "Telugu"];
  const categories = ["Karmakandi", "Jyotish", "Adhyatmik", "Vastu"];
  const specializations = [
    "Marriage",
    "Griha Pravesh",
    "Astrology",
    "Naamkaran",
  ];
  const services = ["Puja", "Kundali", "Kathavachan", "Online Consultation"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const communicationModes = ["Call", "WhatsApp", "Email"];
  const [pandit, setpandit] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [Editing, setEditing] = useState(null);
  const [Selected, setSelected] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [open, setopen] = useState(false);
  const [selectedpandit, setselectedpandit] = useState(null);
  const [activeForm, setActiveForm] = useState("pandit ji");
  const [panditbooking, setpanditbooking] = useState(null);
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [panditList, setPanditList] = useState([]);
  const [selectedPanditId, setSelectedPanditId] = useState(null);
  const [detail, setdetail] = useState(null);
  const [bookingdetail, setbookingdetail] = useState(false);

  // const [BookingId,setBookingId]=useState(null);
  const [PanditData, setPanditData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    profilePhoto: "",
    languagesSpoken: [],
    panditCategory: [],
    specializations: [],
    yearsOfExperience: "",
    servicesOffered: [],
    modeOfService: "",
    travelAvailability: false,
    serviceLanguages: [],
    availableDays: [],
    preferredTimeSlots: "",
    consultationFee: "",
    startingPrice: "",
    customPricingAvailable: false,
    preferredCommunication: "",
    readyForLiveConsultation: false,
    additionalInfo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setPanditData({ ...PanditData, [name]: files });
    } else if (type === "checkbox") {
      setPanditData({ ...PanditData, [name]: checked });
    } else {
      setPanditData({ ...PanditData, [name]: value });
    }
    if (type === "file") {
      setSelected((prev) => ({ ...prev, [name]: files }));
    } else if (type === "checkbox") {
      setSelected((prev) => ({ ...prev, [name]: checked }));
    } else {
      setSelected((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Keep the File object for uploading
      console.log(imageFile);
      setPanditData({ ...PanditData, profilePhoto: URL.createObjectURL(file) }); // Optional: for preview
    }
  };

  const handleMultiSelect = (name, value) => {
    setPanditData((prev) => {
      const current = prev[name] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [name]: updated };
    });
    setSelected((prev) => {
      const current = prev[name] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [name]: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(PanditData);
    alert("Form submitted!");
    setShowForm(false);
  };

  const handleCancel = () => {
    setPanditData({});
    setShowForm(false);
  };

  const handleopen = (pandit) => {
    setopen(true);
    setselectedpandit(pandit);
  };

  const handleclose = () => {
    setopen(false);
    setbookingdetail(false);
  };

  const handleAssignClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowAssignPopup(true);
    console.log(bookingId);
  };

  const showdetail = (booking) => {
    setdetail(booking);
    setbookingdetail(true);
  };
  console.log(bookingdetail);
  console.log(detail);

  const handleConfirmAssign = async () => {
    if (!selectedBookingId || !selectedPanditId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/pandit/${selectedBookingId}/assign`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ panditId: selectedPanditId }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert("Pandit assigned successfully!");
        setShowAssignPopup(false);
        setSelectedPanditId(null);
        getpanditbooking();
      } else {
        alert(result.message || "Failed to assign Pandit");
      }
    } catch (err) {
      console.error("Error assigning Pandit", err);
      alert("Error occurred!");
    }
  };

  const editmode = (pandit) => {
    console.log("Editing mode activated!");
    setEditing(true);
    setSelected(pandit);
  };

  const getpandit = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/pandit/`);
      const data = await response.json();
      setpandit(data);
      setPanditList(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createpandit = async () => {
    const formdata = new FormData();
    for (const key in PanditData) {
      formdata.append(key, PanditData[key]);
    }
    if (imageFile) {
      formdata.append("profilePhoto", imageFile);
    }
    try {
      const response = await fetch(`${backendUrl}/api/pandit/create`, {
        method: "POST",
        body: formdata,
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        getpandit();
        setPanditData({
          fullName: "",
          mobileNumber: "",
          email: "",
          profilePhoto: "",
        });
        setImageFile(null);
        // alert("pandit created successfully")
      }
    } catch (error) {
      console.error("Error creating pandit:", error);
    }
  };

  const deletePandit = async (pandit_id) => {
    try {
      const response = await fetch(`${backendUrl}/api/pandit/${pandit_id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        getpandit();
      }
    } catch (err) {
      toast.error("Error deleting pandit ji");
    }
  };
  const updatePandit = async (pandit_id) => {
    const formDataToSend = new FormData();

    for (const key in PanditData) {
      const value = PanditData[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formDataToSend.append(key, item);
          });
        } else {
          formDataToSend.append(key, value);
        }
      }
    }

    if (imageFile instanceof File) {
      formDataToSend.append("profilePhoto", imageFile);
    }

    try {
      const response = await fetch(`${backendUrl}/api/pandit/${pandit_id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Pandit updated successfully!");
        setSelected(null);
        setEditing(false);
        getpandit();
      } else if (response.status === 401) {
        alert("Unauthorized. Please log in again.");
      } else {
        alert("Failed to update Pandit");
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const getpanditbooking = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/pandit/pandit-booking`);
      const data = await response.json();
      console.log(response);
      setpanditbooking(data);
      console.log(panditbooking);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(panditbooking);

  useEffect(() => {
    if (activeForm === "pandit ji") {
      getpandit();
    }
    if (activeForm === "bookings") {
      getpanditbooking();
    }
    // if (bookingdetail) {
    //   console.log(detail);
    // }
  }, [activeForm]);

  return (
    <div className="w-full h-screen">
      <div className="flex w-full flex-row gap-4">
        <div
          className={`font-bold text-2xl ml-5 cursor-pointer outlined-text ${
            activeForm === "bookings"
              ? "text-red-600 underline"
              : "text-red-900"
          }`}
          onClick={() => {
            setActiveForm("bookings");
          }}
        >
          Bookings
        </div>
        <div
          className={`font-bold text-2xl ml-5 cursor-pointer outlined-text ${
            activeForm === "pandit ji"
              ? "text-red-600 underline"
              : "text-red-900"
          }`}
          onClick={() => {
            setActiveForm("pandit ji");
          }}
        >
          Pandit Ji
        </div>

        <div className="flex flex-1 float-right justify-end">
          <button
            className="mr-5 rounded-xl px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all text-red-600 font-bold flex justify-center items-center float-right gap-2"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Add Pandit
          </button>
        </div>
      </div>
      {activeForm === "pandit ji" && (
        <div>
          {showForm ? (
            <div>
              <form onSubmit={handleSubmit} className="p-4 w-full mx-auto">
                <table className="table-auto w-full border border-separate border-gray-300">
                  <tbody className="divide-y divide-gray-200">
                    {/* Full Name */}
                    <tr>
                      <td className="p-2 font-medium w-1/3">Full Name</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="fullName"
                          value={PanditData.fullName || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Mobile Number */}
                    <tr>
                      <td className="p-2 font-medium">Mobile Number</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="mobileNumber"
                          value={PanditData.mobileNumber || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Email */}
                    <tr>
                      <td className="p-2 font-medium">Email</td>
                      <td className="p-2">
                        <input
                          type="email"
                          name="email"
                          value={PanditData.email || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Profile Photo */}
                    <tr>
                      <td className="p-2 font-medium">Profile Photo</td>
                      <td className="p-2">
                        <input
                          type="file"
                          name="profilePhoto"
                          onChange={handleImageUpload}
                          className="input w-full"
                        />
                      </td>
                    </tr>

                    {/* Languages Spoken */}
                    <tr>
                      <td className="p-2 font-medium">Languages Spoken</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <label key={lang} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={PanditData.languagesSpoken?.includes(
                                lang
                              )}
                              onChange={() =>
                                handleMultiSelect("languagesSpoken", lang)
                              }
                            />
                            {lang}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Pandit Category */}
                    <tr>
                      <td className="p-2 font-medium">Pandit Category</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={PanditData.panditCategory?.includes(cat)}
                              onChange={() =>
                                handleMultiSelect("panditCategory", cat)
                              }
                            />
                            {cat}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Specializations */}
                    <tr>
                      <td className="p-2 font-medium">Specializations</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {specializations.map((spec) => (
                          <label key={spec} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={PanditData.specializations?.includes(
                                spec
                              )}
                              onChange={() =>
                                handleMultiSelect("specializations", spec)
                              }
                            />
                            {spec}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Years of Experience */}
                    <tr>
                      <td className="p-2 font-medium">Years of Experience</td>
                      <td className="p-2">
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={PanditData.yearsOfExperience || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Services Offered */}
                    <tr>
                      <td className="p-2 font-medium">Services Offered</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {services.map((serv) => (
                          <label key={serv} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={PanditData.servicesOffered?.includes(
                                serv
                              )}
                              onChange={() =>
                                handleMultiSelect("servicesOffered", serv)
                              }
                            />
                            {serv}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Mode of Service */}
                    <tr>
                      <td className="p-2 font-medium">Mode of Service</td>
                      <td className="p-2 flex gap-4">
                        {["Online", "Offline", "Both"].map((mode) => (
                          <label key={mode} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="modeOfService"
                              value={mode}
                              checked={PanditData.modeOfService === mode}
                              onChange={handleChange}
                            />
                            {mode}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Travel Availability */}
                    <tr>
                      <td className="p-2 font-medium">Travel Availability</td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          name="travelAvailability"
                          checked={PanditData.travelAvailability}
                          onChange={handleChange}
                        />{" "}
                        Available to Travel
                      </td>
                    </tr>

                    {/* Languages for Service */}
                    <tr>
                      <td className="p-2 font-medium">Languages for Service</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <label key={lang} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={PanditData.serviceLanguages?.includes(
                                lang
                              )}
                              onChange={() =>
                                handleMultiSelect("serviceLanguages", lang)
                              }
                            />
                            {lang}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Available Days */}
                    <tr>
                      <td className="p-2 font-medium">Available Days</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {days.map((day) => (
                          <label key={day} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={PanditData.availableDays?.includes(day)}
                              onChange={() =>
                                handleMultiSelect("availableDays", day)
                              }
                            />
                            {day}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Time Slots */}
                    <tr>
                      <td className="p-2 font-medium">Preferred Time Slots</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="preferredTimeSlots"
                          value={PanditData.preferredTimeSlots || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Pricing */}
                    <tr>
                      <td className="p-2 font-medium">Consultation Fee</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="consultationFee"
                          value={PanditData.consultationFee || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Starting Price</td>
                      <td className="p-2">
                        <input
                          type="number"
                          name="startingPrice"
                          value={PanditData.startingPrice || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">
                        Custom Pricing Available
                      </td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          name="customPricingAvailable"
                          checked={PanditData.customPricingAvailable}
                          onChange={handleChange}
                        />{" "}
                        Yes
                      </td>
                    </tr>

                    {/* Communication + Info */}
                    <tr>
                      <td className="p-2 font-medium">
                        Preferred Communication
                      </td>
                      <td className="p-2">
                        <select
                          name="preferredCommunication"
                          value={PanditData.preferredCommunication || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        >
                          <option value="">Select</option>
                          {communicationModes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">
                        Ready for Live Consultation
                      </td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          name="readyForLiveConsultation"
                          checked={PanditData.readyForLiveConsultation}
                          onChange={handleChange}
                        />{" "}
                        Yes
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Additional Info / Bio</td>
                      <td className="p-2">
                        <textarea
                          name="additionalInfo"
                          rows="4"
                          value={PanditData.additionalInfo || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Buttons */}
                    <tr>
                      <td colSpan={2} className="text-center p-4">
                        <button
                          type="submit"
                          onClick={async () => {
                            await createpandit();
                          }}
                          className=" text-white px-4 py-2 rounded mr-2"
                          style={{ backgroundColor: "rgb(5, 189, 5)" }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className=" text-white px-4 py-2 rounded"
                          style={{ backgroundColor: "#ff1100" }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          ) : Editing ? (
            <div>
              <form className="p-4 w-full mx-auto">
                <table className="table-auto w-full border border-separate border-gray-300">
                  <tbody className="divide-y divide-gray-200">
                    {/* Full Name */}
                    <tr>
                      <td className="p-2 font-medium w-1/3">Full Name</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="fullName"
                          value={Selected.fullName}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Mobile Number */}
                    <tr>
                      <td className="p-2 font-medium">Mobile Number</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="mobileNumber"
                          value={Selected.mobileNumber}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Email */}
                    <tr>
                      <td className="p-2 font-medium">Email</td>
                      <td className="p-2">
                        <input
                          type="email"
                          name="email"
                          value={Selected.email}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Profile Photo */}
                    <tr>
                      <td className="p-2 font-medium">Profile Photo</td>
                      <td className="p-2">
                        <input
                          type="file"
                          name="profilePhoto"
                          onChange={handleImageUpload}
                          className="input w-full"
                        />
                      </td>
                    </tr>

                    {/* Languages Spoken */}
                    <tr>
                      <td className="p-2 font-medium">Languages Spoken</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <label key={lang} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Selected.languagesSpoken?.includes(lang)}
                              onChange={() =>
                                handleMultiSelect("languagesSpoken", lang)
                              }
                            />
                            {lang}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Pandit Category */}
                    <tr>
                      <td className="p-2 font-medium">Pandit Category</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Selected.panditCategory?.includes(cat)}
                              onChange={() =>
                                handleMultiSelect("panditCategory", cat)
                              }
                            />
                            {cat}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Specializations */}
                    <tr>
                      <td className="p-2 font-medium">Specializations</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {specializations.map((spec) => (
                          <label key={spec} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Selected.specializations?.includes(spec)}
                              onChange={() =>
                                handleMultiSelect("specializations", spec)
                              }
                            />
                            {spec}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Years of Experience */}
                    <tr>
                      <td className="p-2 font-medium">Years of Experience</td>
                      <td className="p-2">
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={Selected.yearsOfExperience || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Services Offered */}
                    <tr>
                      <td className="p-2 font-medium">Services Offered</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {services.map((serv) => (
                          <label key={serv} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Selected.servicesOffered?.includes(serv)}
                              onChange={() =>
                                handleMultiSelect("servicesOffered", serv)
                              }
                            />
                            {serv}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Mode of Service */}
                    <tr>
                      <td className="p-2 font-medium">Mode of Service</td>
                      <td className="p-2 flex gap-4">
                        {["Online", "Offline", "Both"].map((mode) => (
                          <label key={mode} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="modeOfService"
                              value={mode}
                              checked={Selected.modeOfService === mode}
                              onChange={handleChange}
                            />
                            {mode}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Travel Availability */}
                    <tr>
                      <td className="p-2 font-medium">Travel Availability</td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          name="travelAvailability"
                          checked={Selected.travelAvailability}
                          onChange={handleChange}
                        />{" "}
                        Available to Travel
                      </td>
                    </tr>

                    {/* Languages for Service */}
                    <tr>
                      <td className="p-2 font-medium">Languages for Service</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {languages.map((lang) => (
                          <label key={lang} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Selected.serviceLanguages?.includes(
                                lang
                              )}
                              onChange={() =>
                                handleMultiSelect("serviceLanguages", lang)
                              }
                            />
                            {lang}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Available Days */}
                    <tr>
                      <td className="p-2 font-medium">Available Days</td>
                      <td className="p-2 flex flex-wrap gap-2">
                        {days.map((day) => (
                          <label key={day} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={Selected.availableDays?.includes(day)}
                              onChange={() =>
                                handleMultiSelect("availableDays", day)
                              }
                            />
                            {day}
                          </label>
                        ))}
                      </td>
                    </tr>

                    {/* Time Slots */}
                    <tr>
                      <td className="p-2 font-medium">Preferred Time Slots</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="preferredTimeSlots"
                          value={Selected.preferredTimeSlots}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Pricing */}
                    <tr>
                      <td className="p-2 font-medium">Consultation Fee</td>
                      <td className="p-2">
                        <input
                          type="text"
                          name="consultationFee"
                          value={Selected.consultationFee}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Starting Price</td>
                      <td className="p-2">
                        <input
                          type="number"
                          name="startingPrice"
                          value={Selected.startingPrice || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">
                        Custom Pricing Available
                      </td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          name="customPricingAvailable"
                          checked={Selected.customPricingAvailable}
                          onChange={handleChange}
                        />{" "}
                        Yes
                      </td>
                    </tr>

                    {/* Communication + Info */}
                    <tr>
                      <td className="p-2 font-medium">
                        Preferred Communication
                      </td>
                      <td className="p-2">
                        <select
                          name="preferredCommunication"
                          value={Selected.preferredCommunication}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        >
                          <option value="">Select</option>
                          {communicationModes.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">
                        Ready for Live Consultation
                      </td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          name="readyForLiveConsultation"
                          checked={Selected.readyForLiveConsultation}
                          onChange={handleChange}
                        />{" "}
                        Yes
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Additional Info / Bio</td>
                      <td className="p-2">
                        <textarea
                          name="additionalInfo"
                          rows="4"
                          value={Selected.additionalInfo || ""}
                          onChange={handleChange}
                          className="input w-full bg-blue-100"
                        />
                      </td>
                    </tr>

                    {/* Buttons */}
                    <tr>
                      <td colSpan={2} className="text-center p-4">
                        <button
                          type="submit"
                          onClick={async () => {
                            await updatePandit(Selected._id);
                          }}
                          className=" text-white px-4 py-2 rounded mr-2"
                          style={{ backgroundColor: "rgb(5, 189, 5)" }}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className=" text-white px-4 py-2 rounded"
                          style={{ backgroundColor: "#ff1100" }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          ) : (
            <section className="w-full h-screen hide-scollbar mt-3 mr-5">
              {pandit.map((pandit) => (
                <div
                  className="md:h-44 h-100 w-full flex flex-col cursor-pointer md:flex-row m-2 shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-7 px-4 py-6 items-center"
                  key={pandit._id}
                >
                  <div className="img w-80 md:h-46 md:w-80 h-40 flex items-center justify-center ">
                    <img
                      src={pandit.profilePhoto}
                      className="w-full h-full rounded-full"
                    ></img>
                  </div>
                  <div
                    className="txt w-full md:h-52 h-60 flex-col items-center justify-center px-4 py-4"
                    onClick={() => handleopen(pandit)}
                  >
                    <h1 className="text-2xl font-bold text-red-950 my-2">
                      {pandit.fullName}
                    </h1>
                    <table className="w-full border-separate border-spacing-y-3">
                      <tr>
                        <td className="font-bold">Mobile Number </td>
                        <td>{pandit.mobileNumber}</td>
                        <td className="font-bold">Email </td>
                        <td>{pandit.email}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Languages </td>
                        <td>{pandit.languagesSpoken?.join(", ")}</td>
                        <td className="font-bold">Starting Price </td>
                        <td>{pandit.startingPrice}</td>
                      </tr>
                      <tr>
                        <td className="font-bold">Experience</td>
                        <td>{pandit.yearsOfExperience}</td>
                        <td className="font-bold">Consultation Fee</td>
                        <td>{pandit.consultationFee}</td>
                      </tr>
                    </table>
                  </div>
                  <div className="w-full md:w-80 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
                    <button
                      className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => editmode(pandit)}
                    >
                      EDIT
                      <i class="fa-solid fa-pen-to-square px-2"></i>
                    </button>
                    <DeleteWithConfirmation
                      handleDeleteitem={() => deletePandit(pandit._id)}
                    />
                  </div>
                </div>
              ))}

              {open && selectedpandit && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={handleclose}
                >
                  <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative">
                    <button
                      onClick={handleclose}
                      className="absolute top-2 right-2 text-gray-600 hover:text-black"
                    >
                      ✕
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-red-800">
                      {selectedpandit.fullName}
                    </h2>
                    <table className="w-full rounded-lg text-sm border-collapse">
                      <tbody>
                        <tr>
                          <td className="p-2 " colSpan="2" rowSpan="4">
                            <img
                              src={selectedpandit.profilePhoto}
                              alt="Profile"
                              className="w-md h-md rounded-full object-cover"
                            />
                          </td>
                          <td>
                            <tr>
                              {" "}
                              <th className="p-2 text-center bg-gray-100 rounded-lg" colSpan="2">
                                Basic Details
                              </th>
                            </tr>
                            <tr>
                              <td className="font-semibold p-2">
                                Mobile
                              </td>
                              <td className="p-2">
                                {selectedpandit.mobileNumber}
                              </td>
                            </tr>
                            <tr>
                              {" "}
                              <td className="font-semibold p-2">Email</td>
                              <td className="p-2">{selectedpandit.email}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold p-2">
                                Experience
                              </td>
                              <td className="p-2">
                                {selectedpandit.yearsOfExperience}
                              </td>
                            </tr>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="w-full border-none rounded-lg text-sm">
                      <tbody>
                        <tr>
                          <td className="font-semibold p-2">Mode of Service</td>
                          <td className="p-2">
                            {selectedpandit.modeOfService}
                          </td>
                          <td className="font-semibold p-2">
                            Travel Availability
                          </td>
                          <td className="p-2">
                            {selectedpandit.travelAvailability}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold p-2">
                            Service Languages
                          </td>
                          <td className="p-2">
                            {selectedpandit.serviceLanguages?.join(", ")}
                          </td>
                          <td className="font-semibold p-2">Available Days</td>
                          <td className="p-2">
                            {selectedpandit.availableDays}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold p-2">
                            Preferred Time Slots
                          </td>
                          <td className="p-2">
                            {selectedpandit.preferredTimeSlots}
                          </td>
                          <td className="font-semibold p-2">
                            Consultation Fee
                          </td>
                          <td className="p-2">₹500</td>
                        </tr>
                        <tr>
                          <td className="font-semibold p-2">Starting Price</td>
                          <td className="p-2">
                            {selectedpandit.startingPrice}
                          </td>
                          <td className="font-semibold p-2">Custom Pricing</td>
                          <td className="p-2">
                            {selectedpandit.customPricingAvailable}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold p-2">
                            Preferred Communication
                          </td>
                          <td className="p-2">
                            {selectedpandit.preferredCommunication}
                          </td>
                          <td className="font-semibold p-2">
                            Live Consultation
                          </td>
                          <td className="p-2">
                            {selectedpandit.readyForLiveConsultation}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold p-2">Additional Info</td>
                          <td className="p-r" colSpan="3">
                            {selectedpandit.additionalInfo}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* add more details if needed */}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      )}
      {activeForm === "bookings" && (
        <div>
          {(panditbooking || []).map((booking, index) => (
            <div
              key={index}
              className="w-full bg-gradient-to-br from-white via-orange-50 to-orange-100 border border-orange-300 shadow-xl rounded-2xl p-6 mt-6 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-orange-800 tracking-wide flex items-center gap-2">
                  📅 Booking Details
                </h2>
                <button
                  className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md"
                  onClick={() => showdetail(booking)}
                >
                  Details
                </button>
              </div>

              <div
                className="text-gray-700 text-sm grid grid-cols-2 gap-y-2 gap-x-8"
                onClick={() => showdetail(booking)}
              >
                <div>
                  <span className="font-semibold text-orange-800">
                    👤 User Name:
                  </span>
                  {booking.userName}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    📞 Contact:
                  </span>
                  {booking.contactNumber}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    🏠 Address:
                  </span>
                  {booking.address}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    🧭 Latitude:
                  </span>
                  {booking.latitude}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    🧭 Longitude:
                  </span>
                  {booking.longitude}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    🏘️ House No:
                  </span>
                  {booking.houseNumber}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    📍 Landmark:
                  </span>
                  {booking.nearLandmark}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    📅 Date:
                  </span>
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    ⏰ Time:
                  </span>
                  {booking.bookingTime}
                </div>
                <div>
                  <span className="font-semibold text-orange-800">
                    ✅ Status:
                  </span>
                  <span className="inline-block mt-1 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-yellow-200 text-yellow-800">
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {bookingdetail && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-2xl md:w-[50%] w-full relative">
                <button
                  onClick={handleclose}
                  className="absolute top-1 right-2 text-gray-600 hover:text-black"
                >
                  ✕
                </button>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">
                    Booking Status
                  </h2>

                  <button
                    className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md"
                    onClick={() => handleAssignClick(detail._id)}
                  >
                    Assign Pandit
                  </button>
                </div>

                <div className="overflow-x-auto m-5">
                  <table className="min-w-full table-auto border-separate border-spacing-y-4">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-sm">
                        <th className="px-4 py-2 text-left"></th>
                        <th className="px-4 py-2 text-left">Event</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left" colSpan="2">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800 relative">
                      {/* Booking Received */}
                      <tr className="border-b hover:bg-gray-50 relative">
                        <td className="px-4 py-2 align-top relative">
                          <div className="flex items-start justify-center h-full relative z-10">
                            <Clock className="text-blue-500 z-20" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300 z-0"></div>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          Booking Received
                        </td>
                        <td className="px-4 py-2">
                          {new Date(detail.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{detail.bookingTime}</td>
                        <td className="px-4 py-2">{detail.status}</td>
                        <td className="px-4 py-2" colSpan="2">
                          <div className="flex flex-row gap-2">
                            <div>{detail.userName}</div>
                            <div>({detail.contactNumber})</div>
                          </div>
                        </td>
                      </tr>

                      {/* Pandit Assigned */}
                      <tr className="border-b hover:bg-gray-50 relative">
                        <td className="px-4 py-2 align-top relative">
                          <div className="flex items-start justify-center h-full relative z-10">
                            <UserCheck className="text-indigo-500 z-20" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300 z-0"></div>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          Pandit Assigned
                        </td>
                        <td className="px-4 py-2">
                          {detail.assignedAt
                            ? new Date(detail.assignedAt).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="px-4 py-2">
                          {detail.assignedAt
                            ? new Date(detail.assignedAt).toLocaleTimeString()
                            : ""}
                        </td>
                        <td className="px-4 py-2">
                          {detail.assignedAt ? detail.status : ""}
                        </td>
                        <td className="px-4 py-2" colSpan="2"></td>
                      </tr>

                      {/* Pooja In Progress */}
                      <tr className="border-b hover:bg-gray-50 relative">
                        <td className="px-4 py-2 align-top relative">
                          <div className="flex items-start justify-center h-full relative z-10">
                            <Loader2 className="text-yellow-500 animate-spin z-20" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300 z-0"></div>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          Pooja In Progress
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2" colSpan="2"></td>
                      </tr>

                      {/* Pooja Completed */}
                      <tr className="border-b hover:bg-gray-50 relative">
                        <td className="px-4 py-2 align-top relative">
                          <div className="flex items-start justify-center h-full relative z-10">
                            <CheckCircle className="text-green-500 z-20" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300 z-0"></div>
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          Pooja Completed
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2" colSpan="2"></td>
                      </tr>

                      {/* Feedback Received */}
                      <tr className="border-b hover:bg-gray-50 relative">
                        <td className="px-4 py-2 align-top relative">
                          <div className="flex items-start justify-center h-full relative z-10">
                            <Smile className="text-pink-500 z-20" />
                          </div>
                        </td>
                        <td className="px-4 py-2 font-semibold">
                          Feedback Received
                        </td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2"></td>
                        <td className="px-4 py-2" colSpan="2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {showAssignPopup && (
                  <div className="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h2 className="text-xl font-semibold mb-4">
                      Select a Pandit
                    </h2>

                    <select
                      className="w-full border p-2 rounded mb-4"
                      value={selectedPanditId}
                      onChange={(e) => setSelectedPanditId(e.target.value)}
                    >
                      <option value="">-- Select Pandit --</option>
                      {panditList.map((pandit) => (
                        <option key={pandit._id} value={pandit._id}>
                          {pandit.fullName} ({pandit.mobileNumber})
                        </option>
                      ))}
                    </select>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAssignPopup(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmAssign}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
