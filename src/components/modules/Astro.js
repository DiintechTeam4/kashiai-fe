import React, { useState, useEffect, useMemo } from "react";

import {
  Button,
  TextField,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Box,
  Modal,
  Backdrop,
  Fade,
  CardMedia,
} from "@mui/material";
import DeleteWithConfirmation from "../DeleteWithConfirmation";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

function Astro() {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:5000";

  const [astroDetails, setAstroDetails] = useState({
    name: "",
    description: "",
    astro_image: "",
    languages_known: "",
    phone_number: "",
    experience: "",
    chat_number: "",
    status: "",
    skills: "",
    chat_price_per_minute: "",
    call_price_per_minute: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingAstro, setEditingAstro] = useState(null);
  const [astros, setAstros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (selectedAstro) {
      setEditingAstro({ ...selectedAstro });
    }
    fetchAstros();
  }, [selectedAstro]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAstro((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const editmode = (astro) => {
    setEditingAstro(true);
    setSelectedAstro(astro);
  };
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const fetchAstros = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/astro`);
      const data = await response.json();
      if (response.ok) {
        setAstros(data);
      } else {
        setError("Failed to load Astros");
      }
    } catch (err) {
      setError("Error fetching data");
    }
  };

  const handleCreateAstro = async () => {
    const formData = new FormData();
    for (const key in astroDetails) {
      formData.append(key, astroDetails[key]);
    }
    if (imageFile) {
      formData.append("astro_image", imageFile);
    }
    try {
      const response = await fetch(`${backendUrl}/api/astro`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Astro created successfully");
        fetchAstros();
        setAstroDetails({
          name: "",
          description: "",
          astro_image: "",
          languages_known: "",
          phone_number: "",
          experience: "",
          chat_number: "",
          status: "",
          skills: "",
          chat_price_per_minute: "",
          call_price_per_minute: "",
        });
        setImageFile(null);
        alert("Astro created successfully");
      } else {
        setError(data.message || "Failed to create Astro");
      }
    } catch (err) {
      setError("Failed to create Astro");
    }
  };

  const handleUpdateAstro = async (astroId) => {
    if (!editingAstro) {
      alert("Please fill in the form before updating.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", editingAstro.name);
    formDataToSend.append("description", editingAstro.description);
    formDataToSend.append("languages_known", editingAstro.languages_known);
    formDataToSend.append("phone_number", editingAstro.phone_number);
    formDataToSend.append("experience", editingAstro.experience);
    formDataToSend.append("chat_number", editingAstro.chat_number);
    formDataToSend.append("status", editingAstro.status);
    formDataToSend.append("skills", editingAstro.skills);
    formDataToSend.append(
      "chat_price_per_minute",
      editingAstro.chat_price_per_minute
    );
    formDataToSend.append(
      "call_price_per_minute",
      editingAstro.call_price_per_minute
    );

    if (imageFile) {
      formDataToSend.append("astro_image", imageFile);
    }
    console.log(editingAstro._id);
    try {
      const response = await fetch(
        `${backendUrl}/api/astro/${editingAstro._id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert("Astro updated successfully!");
        setEditingAstro(null);
        fetchAstros();
        setOpenModal(false);
      } else {
        alert("Failed to update Astro");
      }
    } catch (error) {
      alert("Error updating Astro");
    }
  };

  const handleDeleteAstro = async (astroId) => {
    try {
      console.log(astroId);
      const response = await fetch(`${backendUrl}/api/astro/${astroId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Astro deleted successfully");
        fetchAstros();
      } else {
        setError(data.message || "Failed to delete Astro");
      }
    } catch (err) {
      setError("Error deleting Astro");
    }
  };

  const handleOpenModal = (astro) => {
    setSelectedAstro(astro);
    setOpenModal(true);
    // setEditingAstro(true)
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAstro(null);
  };

  const renderCreateAstro = () => (
    <div className="flex justify-center items-center w-full mt-4">
      <table className="w-full max-w-5xl bg-white shadow-xl rounded-xl border-2 border-separate border-spacing-y-6 border-spacing-x-4 px-6">
        <tbody>
          <tr>
            <td
              rowSpan="3"
              style={{
                width: "12rem",
                height: "12rem",
                padding: "20px",
              }}
            >
              {/* Hidden file input */}
              <input
                type="file"
                id="imageUpload"
                hidden
                onChange={handleImageUpload}
              />

              {/* Label to trigger file input */}
              <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                <img
                  className="logo w-full h-full object-cover rounded-md "
                  src={imagePreview ? imagePreview : "/upload image.png"}
                  alt="logo"
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </label>
            </td>

            <td>
              <TextField
                label="Name"
                fullWidth
                value={astroDetails.name}
                onChange={(e) =>
                  setAstroDetails({ ...astroDetails, name: e.target.value })
                }
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField
                label="Languages Known"
                fullWidth
                value={astroDetails.languages_known}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    languages_known: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <TextField
                label="Phone Number"
                fullWidth
                value={astroDetails.phone_number}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    phone_number: e.target.value,
                  })
                }
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField
                label="Chat Number"
                fullWidth
                value={astroDetails.chat_number}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    chat_number: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <TextField
                label="Experience (years)"
                fullWidth
                value={astroDetails.experience}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    experience: e.target.value,
                  })
                }
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField
                label="Chat Price per Minute"
                fullWidth
                value={astroDetails.chat_price_per_minute}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    chat_price_per_minute: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <TextField
                label="Call Price per Minute"
                fullWidth
                value={astroDetails.call_price_per_minute}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    call_price_per_minute: e.target.value,
                  })
                }
              />
            </td>
          </tr>

          <tr>
            <td>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={astroDetails.status}
                  onChange={(e) =>
                    setAstroDetails({ ...astroDetails, status: e.target.value })
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </td>
            <td>
              <TextField
                label="Skills"
                fullWidth
                value={astroDetails.skills}
                onChange={(e) =>
                  setAstroDetails({ ...astroDetails, skills: e.target.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <TextField
                label="Description"
                fullWidth
                value={astroDetails.description}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    description: e.target.value,
                  })
                }
              />
            </td>
          </tr>
          <tr>
            <td className="text-center">
              <Button
                variant="contained"
                style={{ backgroundColor: "#ff1100" }}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </td>
            <td className="text-center">
              <Button
                variant="contained"
                style={{ backgroundColor: "rgb(5, 189, 5)" }}
                onClick={async () => {
                  await handleCreateAstro();
                }}
              >
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderManageAstro = () => (
    <div className="flex justify-center items-center w-full mt-4">
      <table className="w-full max-w-5xl bg-white shadow-xl rounded-xl border-2 border-separate border-spacing-y-6 border-spacing-x-4 px-6">
        <tbody>
          <tr>
            <td
              rowSpan="3"
              style={{
                width: "15rem",
                height: "15rem",
                padding: "20px",
              }}
            >
              {/* Hidden file input */}
              <input
                type="file"
                hidden
                id="imageUpload"
                onChange={handleImageUpload}
              />

              {/* Label to trigger file input */}
              <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : editingAstro.astro_image
                  }
                  alt="Astro"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </label>
            </td>

            <td>
              <TextField
                label="name"
                name="name"
                fullWidth
                value={editingAstro.name || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <TextField
                label="Phone Number"
                name="phone_number"
                fullWidth
                value={editingAstro.phone_number || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <TextField
                label="Experience (years)"
                name="experience"
                fullWidth
                value={editingAstro.experience || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField
                label="Chat Number"
                name="chat_number"
                fullWidth
                value={editingAstro.chat_number || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
            <td>
              <TextField
                label="Skills"
                name="skills"
                fullWidth
                value={editingAstro.skills || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <TextField
                label="Chat Price per Minute"
                name="chat_price_per_minute"
                fullWidth
                value={editingAstro.chat_price_per_minute || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
            <td>
              <TextField
                label="Call Price per Minute"
                name="call_price_per_minute"
                fullWidth
                value={editingAstro.call_price_per_minute || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <FormControl fullWidth style={{ marginBottom: "1rem" }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editingAstro.status || ""}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </td>
            <td>
              <TextField
                label="Languages Known"
                name="languages_known"
                fullWidth
                value={editingAstro.languages_known || ""}
                onChange={handleInputChange}
                style={{ marginBottom: "1rem" }}
              />
            </td>
          </tr>
          {/* <tr>
            <td colSpan="2">
              <TextField
                label="Description"
                fullWidth
                value={astroDetails.description}
                onChange={(e) =>
                  setAstroDetails({
                    ...astroDetails,
                    description: e.target.value,
                  })
                }
              />
            </td>
          </tr> */}
          <tr>
            <td className="text-center">
              <Button
                variant="contained"
                style={{ backgroundColor: "#ff1100" }}
                onClick={() => setEditingAstro(false)}
              >
                Cancel
              </Button>
            </td>
            <td className="text-center">
              <Button
                variant="contained"
                style={{ backgroundColor: "rgb(5, 189, 5)" }}
                onClick={handleUpdateAstro}
              >
                Update
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    //     <div className="flex justify-center items-center w-full m-auto">
    //       <div className="w-96 justify-center p-5 m-5">
    //       <div
    //         style={{
    //           width: "150px",
    //           height: "150px",
    //           overflow: "hidden",
    //           marginBottom: "1rem",
    //           border: "1px solid #ccc",
    //           borderRadius: "8px",
    //         }}
    //       >
    //         <img
    //           src={
    //             imageFile
    //               ? URL.createObjectURL(imageFile)
    //               : editingAstro.astro_image
    //           }
    //           alt="Astro"
    //           style={{ width: "100%", height: "100%", objectFit: "cover" }}
    //         />
    //       </div>

    //       <input
    //         type="file"
    //         onChange={handleFileChange}
    //         style={{ marginBottom: "1rem" }}
    //       />

    //       <TextField
    //         label="Languages Known"
    //         name="languages_known"
    //         fullWidth
    //         value={editingAstro.languages_known || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />
    //       <TextField
    //         label="Phone Number"
    //         name="phone_number"
    //         fullWidth
    //         value={editingAstro.phone_number || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />
    //       <TextField
    //         label="Experience (years)"
    //         name="experience"
    //         fullWidth
    //         value={editingAstro.experience || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />
    //       <TextField
    //         label="Chat Number"
    //         name="chat_number"
    //         fullWidth
    //         value={editingAstro.chat_number || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />
    //       <TextField
    //         label="Skills"
    //         name="skills"
    //         fullWidth
    //         value={editingAstro.skills || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />
    //       <TextField
    //         label="Chat Price per Minute"
    //         name="chat_price_per_minute"
    //         fullWidth
    //         value={editingAstro.chat_price_per_minute || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />
    //       <TextField
    //         label="Call Price per Minute"
    //         name="call_price_per_minute"
    //         fullWidth
    //         value={editingAstro.call_price_per_minute || ""}
    //         onChange={handleInputChange}
    //         style={{ marginBottom: "1rem" }}
    //       />

    //       <FormControl fullWidth style={{ marginBottom: "1rem" }}>
    //         <InputLabel>Status</InputLabel>
    //         <Select
    //           name="status"
    //           value={editingAstro.status || ""}
    //           onChange={handleInputChange}
    //         >
    //           <MenuItem value="active">Active</MenuItem>
    //           <MenuItem value="inactive">Inactive</MenuItem>
    //         </Select>
    //       </FormControl>
    // {/* </Grid>
    //  </Grid> */}
    // </div>
    // </div>
  );

  const renderDisplayAstros = () => (
    <section className="w-full h-screen hide-scollbar mt-3 mr-5">
      {astros.map((astro) => (
        <div
          className="md:h-52 h-80 w-full flex flex-col md:flex-row m-2 shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-7 px-4 py-6 items-center"
          key={astro._id}
        >
          <div
            className="img w-80 md:h-46 md:w-80 h-40 flex items-center justify-center "
            onClick={() => handleOpenModal(astro)}
          >
            <img
              src={astro.astro_image}
              className="w-full h-full rounded-full"
            ></img>
          </div>
          <div className="txt w-full md:h-52 h-20 flex-col items-center justify-center px-4 py-4">
            <div className="flex gap-2">
            <h1 className="text-xl font-bold text-red-950 my-2">
              {astro.name}
            </h1>
            <button
              className="rounded-xl px-3 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
              onClick={() =>
                navigate(`/dashboard/astro/chat/${astro._id}`, {
                  state: {
                    role: "astro",
                    userId: astro._id,
                  },
                })
              }
            >
              chat
            </button>
            </div>
            
            <table className="w-full">
              <tr>
                <td className="font-bold">Languages </td>
                <td>{astro.languages_known}</td>
                <td className="font-bold">Experience </td>
                <td>{astro.experience}</td>
              </tr>
              <tr>
                <td className="font-bold">Phone no </td>
                <td>{astro.phone_number}</td>
                <td className="font-bold">Chat no </td>
                {/* <td>
                  <a
                    href={`https://wa.me/${astro.chat_number}?text=Hello Astro, I need help with something.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {astro.chat_number}
                  </a>
                </td> */}
                <td
                  onClick={() =>
                    navigate(`/dashboard/astro/chat/${astro._id}`, {
                      state: {
                        role: "user",
                        userId: "userid",
                      },
                    })
                  }
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  {astro.chat_number}
                </td>
              </tr>
              <tr>
                <td className="font-bold">Skills </td>
                <td>{astro.skills}</td>
                <td className="font-bold">Status </td>
                <td className="text-green-400 font-semibold">
                  {astro.status.charAt(0).toUpperCase() + astro.status.slice(1)}
                </td>
              </tr>
              <tr>
                <td className="font-bold">call price </td>
                <td>{astro.call_price_per_minute}/min</td>
                <td className="font-bold">Chat price </td>
                <td>{astro.chat_price_per_minute}/min</td>
              </tr>
            </table>
          </div>

          <div className="w-full md:w-80 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
            <button
              className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
              onClick={() => editmode(astro)}
            >
              EDIT
              <i class="fa-solid fa-pen-to-square px-2"></i>
            </button>
            <DeleteWithConfirmation
              handleDeleteitem={() => handleDeleteAstro(astro._id)}
            />
            
          </div>
        </div>
      ))}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {selectedAstro && (
              <>
                <Typography variant="h5" gutterBottom>
                  {selectedAstro.name}
                </Typography>
                <Typography variant="h6">languages_known:</Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedAstro.languages_known}
                </Typography>
                <Typography variant="h6">Phone:</Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedAstro.phone_number}
                </Typography>
                <Typography variant="h6">Description:</Typography>
                <Typography variant="body2" gutterBottom>
                  {new Date(selectedAstro.description).toDateString()}
                </Typography>
                <Typography variant="h6">Experience</Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedAstro.experience}
                </Typography>
                <Typography variant="h6">Status</Typography>
                <Typography variant="body2" gutterBottom>
                  ₹{selectedAstro.status}
                </Typography>

                <Typography variant="h6">Skills:</Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedAstro.skills}
                </Typography>
                <Typography variant="h6">Chat number:</Typography>
                <Typography variant="body2" gutterBottom>
                  ₹{selectedAstro.chat_number}
                </Typography>
                <Typography variant="h6">Chat price:</Typography>
                <Typography variant="body2" gutterBottom>
                  ₹{selectedAstro.chat_price_per_minute}
                </Typography>
                <Typography variant="h6">Call Price:</Typography>
                <Typography variant="body2" gutterBottom>
                  ₹{selectedAstro.call_price_per_minute}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </section>
  );

  return (
    <div className="h-screen w-full">
      <div className="flex w-full flex-row">
        <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start hover:font-sans outlined-text">
          ASTRO
        </h1>
        <div className="flex flex-1 float-right justify-end">
          <button
            className="mr-5 rounded-xl px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all text-red-600 font-bold flex justify-center items-center float-right gap-2"
            onClick={() => {
              setShowForm(true);
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Add Astro
          </button>
        </div>
      </div>
      {showForm
        ? renderCreateAstro()
        : editingAstro
          ? renderManageAstro()
          : renderDisplayAstros()}
    </div>
  );
}

export default Astro;
