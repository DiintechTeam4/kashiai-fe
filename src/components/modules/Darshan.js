import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  OutlinedInput,
} from "@mui/material";
import DeleteWithConfirmation from "../DeleteWithConfirmation";

function Darshan() {


  const backendUrl = "http://localhost:5000";

  const [formData, setFormData] = useState({
    darshan_name: "",
    darshan_streaming_time: "",
    live_streaming_link: "",
    live: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [darshans, setDarshans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDarshan, setEditingDarshan] = useState(null);

  const getYouTubeVideoId = (url) => {
    url = url.trim(); // Removes extra spaces from start/end

    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);

    return match ? match[1] : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateDarshan = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("darshan_name", formData.darshan_name);
    formDataToSend.append(
      "darshan_streaming_time",
      formData.darshan_streaming_time
    );
    formDataToSend.append("live_streaming_link", formData.live_streaming_link);
    formDataToSend.append("live", formData.live);

    if (imageFile) {
      formDataToSend.append("darshan_image", imageFile);
    }

    try {
      const response = await fetch(`${backendUrl}/api/darshan/`, {
        method: "POST",
        body: formDataToSend,
      });
      console.log(response);
      if (response.ok) {
        setFormData({
          darshan_name: "",
          darshan_streaming_time: "",
          live_streaming_link: "",
          live: false,
        });
        setImageFile(null);
        setImagePreview(null);
        alert("Darshan created successfully!");
      } else {
        throw new Error("Failed to create Darshan");
      }
    } catch (error) {
      console.error("Error creating darshan:", error);
      alert("An error occurred while creating Darshan.");
    }
  };

  const handleUpdateDarshan = async (darshanId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("darshan_name", editingDarshan.darshan_name);
    formDataToSend.append(
      "darshan_streaming_time",
      editingDarshan.darshan_streaming_time
    );
    formDataToSend.append(
      "live_streaming_link",
      editingDarshan.live_streaming_link
    );
    formDataToSend.append("live", editingDarshan.live);

    if (imageFile) {
      formDataToSend.append("file", imageFile);
    }

    const response = await fetch(`${backendUrl}/api/darshan/${darshanId}`, {
      method: "PUT",
      body: formDataToSend,
    });

    if (response.ok) {
      alert("Darshan updated successfully!");
      setEditingDarshan(null);
      fetchDarshans();
    } else {
      alert("Failed to update Darshan");
    }
  };

  const handleDeleteDarshan = async (darshanId) => {
    const response = await fetch(`${backendUrl}/api/darshan/${darshanId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Darshan deleted successfully!");
      fetchDarshans();
    } else {
      alert("Failed to delete Darshan");
    }
  };

  const fetchDarshans = async () => {
    const response = await fetch(`${backendUrl}/api/darshan/`);
    if (response.ok) {
      const data = await response.json();
      setDarshans(data);
    } else {
      alert("Failed to fetch Darshans");
    }
  };

  useEffect(() => {
    fetchDarshans();
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="flex w-full flex-row">
        <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start hover:font-sans outlined-text">
          DARSHAN
        </h1>
        <div className="flex flex-1 float-right justify-end">
          <button
            className="mr-5 rounded-xl px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all text-red-600 font-bold flex justify-center items-center float-right gap-2"
            onClick={() => {
              // Clear form
              setFormData({
                darshan_name: "",
                darshan_streaming_time: "",
                live_streaming_link: "",
                live: false,
              });
              setImageFile(null);
              setImagePreview(null);
              setEditingDarshan(null); // Not editing
              setShowForm(true);

              console.log("clicked");
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Create Darshan
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="flex justify-center items-center w-full p-10">
          <table className="w-full h-full p-7">
            <tr>
              <td colSpan="2" className="py-4">
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#ff1100" }}
                  component="label"
                  fullWidth
                >
                  Upload Image
                  <input type="file" hidden onChange={handleImageUpload} />
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                {imagePreview && (
                  <Box sx={{ overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      sx={{
                        maxWidth: "100%",
                        objectFit: "contain",
                        height: "25rem",
                      }}
                      image={imagePreview}
                      alt="Preview"
                    />
                  </Box>
                )}
              </td>
              <td>
                <TextField
                  label="Darshan Name"
                  fullWidth
                  name="darshan_name"
                  value={formData.darshan_name}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                <TextField
                  label="Darshan Streaming Time"
                  fullWidth
                  name="darshan_streaming_time"
                  value={formData.darshan_streaming_time}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                <TextField
                  label="Live Streaming Link"
                  fullWidth
                  name="live_streaming_link"
                  value={formData.live_streaming_link}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                <FormControl fullWidth>
                  <Select
                    value={formData.live}
                    onChange={(e) =>
                      setFormData({ ...formData, live: e.target.value })
                    }
                  >
                    <MenuItem value={true}>Live</MenuItem>
                    <MenuItem value={false}>Not Live</MenuItem>
                  </Select>
                </FormControl>
                <br />
                <br />
                <Button
                variant="contained"
                style={{ backgroundColor: "#ff1100",marginRight: "10px" }}
                onClick={() => {
                  setShowForm(false);
                }}              >
                Cancel
              </Button>
           
              <Button
                variant="contained"
                style={{ backgroundColor: "rgb(5, 189, 5)" }}
                onClick={handleCreateDarshan}
                >
                Update
              </Button>
              </td>
            </tr>
          </table>
        </div>
      ) : (
        <section className="w-full h-screen hide-scollbar mt-3 mr-5">
          {darshans.map((darshans) => (
            <div
              className="md:h-52 h-80 w-full flex flex-col md:flex-row m-2 shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-10 px-4 py-6 items-center"
              key={darshans._id}
            >
              <div className="img w-full md:h-46 md:w-80 h-40 flex items-center justify-center ">
                <iframe
                  className="md:h-46 h-40 md:w-80 w-full object-contain items-center justify-center rounded-lg "
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(darshans.live_streaming_link)}`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
              <div className="txt w-full md:h-52 h-20 flex-col items-center justify-center px-4 py-4 mt-5">
                <h1 className="text-xl font-bold text-red-950 my-2">
                  {darshans.darshan_name}
                </h1>
                <h1 className="text-xl text-black my-2">
                  Streaming Time :{darshans.darshan_streaming_time} AM
                </h1>
               
                <h1 className="text-xl text-red-700 font-bold my-2">
                  {darshans.live ? "Live" : "Not Live"}
                </h1>
                
              </div>

              <div className="w-full md:w-96 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
                <button
                  className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                  onClick={() => {
                    setShowForm(true);
                    setEditingDarshan(darshans); // mark the current darshan for editing
                    setFormData({
                      darshan_name: darshans.darshan_name,
                      darshan_streaming_time: darshans.darshan_streaming_time,
                      live_streaming_link: darshans.live_streaming_link,
                      live: darshans.live,
                    });
                    setImagePreview(darshans.darshan_image); // show existing image
                  }}
                >
                  EDIT
                  <i class="fa-solid fa-pen-to-square px-2"></i>
                </button>
                <DeleteWithConfirmation handleDeleteitem={() => handleDeleteDarshan(darshans._id)}/>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
export default Darshan;
