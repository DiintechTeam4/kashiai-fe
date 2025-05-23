import React, { useState, useEffect, use } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Tab,
  Tabs,
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import DeleteWithConfirmation from "../DeleteWithConfirmation";

const Poojas = () => {
  const [poojaDetails, setPoojaDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [open, setOpen] = useState(false);

  const [expandedPoojaId, setExpandedPoojaId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPoojaId, setSelectedPoojaId] = useState(null);
  const [editedPooja, setEditedPooja] = useState({
    addonPrices: {},
    packagePrices: {},
    images: [],
  });
  const toggleReadMore = (poojaId) => {
    setExpandedPoojaId(expandedPoojaId === poojaId ? null : poojaId);
  };
  const handleOpen = (pooja) => {
    setSelectedPooja(pooja);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPooja(null);
  };
  const handleEditMode=(pooja)=>{
    setEditMode(true);
    setSelectedPooja(pooja)
  }
  const [poojaData, setPoojaData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    availability: "true",
    valid_till: "",
    starting_price: "",
    gst_percentage: "",
    packages: [],
    images: [],
    faqs: [],
    poojaType: "",
    addons: [],
  });
  const fetchPoojaDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/poojas`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setPoojaDetails(data);
      } else {
        setPoojaDetails([]);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching pooja details:", error);
    }
  };

  useEffect(() => {
    // if (activeTab === 2) {
    fetchPoojaDetails();
    // }
  }, []);

  const handleFieldChange = (field, value) => {
    setEditedPooja((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleArrayFieldChange = (field, value) => {
    setEditedPooja((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? value : [],
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreatePooja = async () => {
    try {
      const formData = new FormData();

      formData.append("name", poojaData.name);
      formData.append("description", poojaData.description);
      formData.append("location", poojaData.location);
      formData.append("date", poojaData.date);
      formData.append("availability", poojaData.availability);
      formData.append("starting_price", poojaData.starting_price);
      formData.append("valid_till", poojaData.valid_till);
      formData.append("poojaType", poojaData.poojaType);
      formData.append("gst_percentage", poojaData.gst_percentage);

      formData.append("packages", JSON.stringify(poojaData.packages));
      formData.append("faqs", JSON.stringify(poojaData.faqs));
      formData.append("addons", JSON.stringify(poojaData.addons));
      // console.log('poojadata addons'+poojaData.addons.image)

      console.log(poojaData.images);
      console.log(poojaData.addons);

      poojaData.addons.forEach((addon /*index*/) => {
        if (addon.imageFile) {
          formData.append("addonImages", addon.imageFile);
        }
      });

      poojaData.images.forEach((image) => {
        if (image.file) formData.append("images", image.file);
      });

      const response = await fetch(`http://localhost:5000/api/poojas`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      alert(data.message);
    } catch (error) {
      console.error("Error creating pooja:", error);
    }
  };

  const handleUpdatePooja = async (poojaId) => {
    console.log(poojaId);
    
    try {
      const formData = new FormData();

      // Append all edited Pooja fields
      Object.keys(editedPooja).forEach((key) => {
        if (key !== "images" && key !== "addons") {
          formData.append(key, editedPooja[key]);
        }
      });

     

      editedPooja.images?.forEach((image, index) => {
        formData.append(`images`, image);
      });

     
      const response = await fetch(
        `http://localhost:5000/api/poojas/${poojaId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("response data" + data);
      alert(data.message);

      setPoojaDetails((prev) =>
        prev.map((pooja) =>
          pooja._id === poojaId ? { ...pooja, ...editedPooja } : pooja
        )
      );

      setSelectedPoojaId(null);
    } catch (error) {
      console.error("Error updating pooja:", error);
    }
  };

  const handleDeletePooja = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:5000/api/poojas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Pooja deleted successfully");
      }

      fetchPoojaDetails();
    } catch (error) {
      console.error("Error deleting pooja:", error);
    }
  };

  const handleAddPackage = () => {
    setPoojaData({
      ...poojaData,
      packages: [
        ...poojaData.packages,
        {
          name: "",
          price: "",
          availability_mode: "offline",
          offline_price: "",
          online_price: "",
        },
      ],
    });
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = poojaData.packages.map((pkg, idx) =>
      idx === index ? { ...pkg, [field]: value } : pkg
    );
    setPoojaData({ ...poojaData, packages: updatedPackages });
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = poojaData.packages.filter(
      (_, idx) => idx !== index
    );
    setPoojaData({ ...poojaData, packages: updatedPackages });
  };

  const handleAvailabilityModeChange = (index, value) => {
    const updatedPackages = poojaData.packages.map((pkg, idx) =>
      idx === index ? { ...pkg, availability_mode: value } : pkg
    );
    setPoojaData({ ...poojaData, packages: updatedPackages });
  };

  const handleAddFAQ = () => {
    setPoojaData({
      ...poojaData,
      faqs: [...poojaData.faqs, { question: "", answer: "" }],
    });
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFAQs = poojaData.faqs.map((faq, idx) =>
      idx === index ? { ...faq, [field]: value } : faq
    );
    setPoojaData({ ...poojaData, faqs: updatedFAQs });
  };

  const handleRemoveFAQ = (index) => {
    const updatedFAQs = poojaData.faqs.filter((_, idx) => idx !== index);
    setPoojaData({ ...poojaData, faqs: updatedFAQs });
  };

  const handleAddAddon = () => {
    setPoojaData({
      ...poojaData,
      addons: [...poojaData.addons, { name: "", description: "", price: "" }],
    });
  };

  const handleAddonChange = (index, field, value) => {
    const updatedAddons = poojaData.addons.map((addon, idx) =>
      idx === index ? { ...addon, [field]: value } : addon
    );
    setPoojaData({ ...poojaData, addons: updatedAddons });
  };

  const handleRemoveAddon = (index) => {
    const updatedAddons = poojaData.addons.filter((_, idx) => idx !== index);
    setPoojaData({ ...poojaData, addons: updatedAddons });
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedImages = [...poojaData.images];
      updatedImages[index] = { file, preview: URL.createObjectURL(file) };
      setPoojaData({ ...poojaData, images: updatedImages });
    }
  };

  const handleAddImage = () => {
    setPoojaData({
      ...poojaData,
      images: [...poojaData.images, { file: null, preview: "" }],
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = poojaData.images.filter((_, idx) => idx !== index);
    setPoojaData({ ...poojaData, images: updatedImages });
  };

  const handleAddonImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const updatedAddons = poojaData.addons.map((addon, idx) =>
      idx === index
        ? { ...addon, imageFile: file, imagePreview: URL.createObjectURL(file) }
        : addon
    );

    setPoojaData({ ...poojaData, addons: updatedAddons });

    event.target.value = "";
  };
  const handlePriceChange = (type, id, value) => {
    setEditedPooja((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: value,
      },
    }));
  };
  return (
    <div className="h-screen w-full">
      <div className="flex w-full flex-row">
        <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start hover:font-sans outlined-text">
          POOJA
        </h1>
        <div className="flex flex-1 float-right justify-end">
          <button
            className="mr-5 rounded-xl px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all text-red-600 font-bold flex justify-center items-center float-right gap-2"
            onClick={() => {
              
              setShowForm(true);

              console.log("clicked");
            }}
          >
            <i className="fa-solid fa-plus"></i>
            Create Pooja
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="flex justify-center items-center p-10 m-auto w-full">
         <div className="w-full">
          <TextField
            label="Pooja Name"
            fullWidth
            value={poojaData.name}
            onChange={(e) =>
              setPoojaData({ ...poojaData, name: e.target.value })
            }
          />
          <br />
          <br />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={poojaData.description}
            onChange={(e) =>
              setPoojaData({ ...poojaData, description: e.target.value })
            }
          />
          <br />
          <br />
          <TextField
            label="Location"
            fullWidth
            value={poojaData.location}
            onChange={(e) =>
              setPoojaData({ ...poojaData, location: e.target.value })
            }
          />
          <br />
          <br />
          <TextField
            label="Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={poojaData.date}
            onChange={(e) =>
              setPoojaData({ ...poojaData, date: e.target.value })
            }
          />
          <br />
          <br />
          <TextField
            label="Valid Till"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={poojaData.valid_till}
            onChange={(e) =>
              setPoojaData({ ...poojaData, valid_till: e.target.value })
            }
          />
          <br />
          <br />

          <FormControl component="fieldset">
            <br />
            <FormLabel component="legend">Availability</FormLabel>
            <RadioGroup
              row
              value={poojaData.availability}
              onChange={(e) =>
                setPoojaData({
                  ...poojaData,
                  availability: e.target.value === "true",
                })
              }
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Available"
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Not Available"
              />
            </RadioGroup>
          </FormControl>
          <br />
          <br />

          <TextField
            label="Price"
            fullWidth
            type="number"
            value={poojaData.starting_price}
            onChange={(e) =>
              setPoojaData({ ...poojaData, starting_price: e.target.value })
            }
          />
          <br />
          <br />
          <TextField
            label="GST Percentage"
            fullWidth
            type="number"
            InputProps={{ inputProps: { min: 0, max: 100 } }} // Ensures valid input range
            value={poojaData.gst_percentage}
            onChange={(e) =>
              setPoojaData({ ...poojaData, gst_percentage: e.target.value })
            }
          />
          <br />
          <br />

          <Typography variant="h6">Pooja Type</Typography>
          <RadioGroup
            row
            value={poojaData.poojaType}
            onChange={(e) =>
              setPoojaData({ ...poojaData, poojaType: e.target.value })
            }
          >
            <FormControlLabel
              value="special"
              control={<Radio />}
              label="Special"
            />
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label="Weekly"
            />
            <FormControlLabel
              value="ondemand"
              control={<Radio />}
              label="On Demand"
            />
          </RadioGroup>
          <br />
          <div className="pack" style={{ display: "flex" }}>
            <ul>
              <li>
                <Typography variant="h6">Packages</Typography>
                {poojaData.packages.map((pkg, index) => (
                  <Card key={index}>
                    <CardContent>
                      <TextField
                        label="Package Name"
                        value={pkg.name}
                        onChange={(e) =>
                          handlePackageChange(index, "name", e.target.value)
                        }
                      />
                      <br />
                      <br />
                      <TextField
                        label="Package Description"
                        value={pkg.description}
                        onChange={(e) =>
                          handlePackageChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      <RadioGroup
                        value={pkg.availability_mode}
                        onChange={(e) =>
                          handleAvailabilityModeChange(index, e.target.value)
                        }
                      >
                        {/* <FormControlLabel value="offline" control={<Radio />} label="Offline" /> */}
                        <FormControlLabel
                          value="online"
                          control={<Radio />}
                          label="Online"
                        />
                      </RadioGroup>
                      <br />
                      <br />
                      <TextField
                        label="Price"
                        type="number"
                        value={pkg.online_price}
                        onChange={(e) =>
                          handlePackageChange(
                            index,
                            "online_price",
                            e.target.value
                          )
                        }
                      />
                      <IconButton onClick={() => handleRemovePackage(index)}>
                        <Delete />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={handleAddPackage}>Add Package</Button>
              </li>

              <li>
                <Typography variant="h6">FAQs</Typography>
                {poojaData.faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent>
                      <TextField
                        label="Question"
                        value={faq.question}
                        onChange={(e) =>
                          handleFAQChange(index, "question", e.target.value)
                        }
                      />{" "}
                      &nbsp; &nbsp;
                      <TextField
                        label="Answer"
                        value={faq.answer}
                        onChange={(e) =>
                          handleFAQChange(index, "answer", e.target.value)
                        }
                      />
                      <IconButton onClick={() => handleRemoveFAQ(index)}>
                        <Delete />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={handleAddFAQ}>Add FAQ</Button>
              </li>

              <li>
                <Typography variant="h6">Addons</Typography>
                {poojaData.addons.map((addon, index) => (
                  <Card key={index}>
                    <CardContent>
                      <TextField
                        label="Addon Name"
                        value={addon.name}
                        onChange={(e) =>
                          handleAddonChange(index, "name", e.target.value)
                        }
                      />
                      &nbsp; &nbsp;
                      <TextField
                        label="Description"
                        value={addon.description}
                        onChange={(e) =>
                          handleAddonChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      &nbsp; &nbsp;
                      <TextField
                        label="Price"
                        value={addon.price}
                        type="number"
                        onChange={(e) =>
                          handleAddonChange(index, "price", e.target.value)
                        }
                      />
                      &nbsp; &nbsp;
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAddonImageUpload(index, e)}
                      />
                      <IconButton onClick={() => handleRemoveAddon(index)}>
                        <Delete />
                      </IconButton>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={handleAddAddon}>Add Addon</Button>
              </li>

              <li>
                <Typography variant="h6">Images</Typography>
                {poojaData.images.map((image, index) => (
                  <Box key={index} display="inline-block" marginRight={2}>
                    {image.preview && (
                      <img src={image.preview} alt="Pooja" width={100} />
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(index, e)}
                      accept="image/*"
                    />
                    <IconButton onClick={() => handleRemoveImage(index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button onClick={handleAddImage}>Add Image</Button>
                <br />
                <br />
                <Button
                  onClick={handleCreatePooja}
                  style={{
                    width: "130px",
                    height: "50px",
                    backgroundColor: "#ff1100",
                    fontWeight: "600",
                    color: "white",
                    marginRight:"10px"
                  }}
                >
                  Create
                </Button>

                <Button
                  variant="contained"
                  style={{
                    width: "130px",
                    height: "50px",
                    backgroundColor: "#ff1100",
                    fontWeight: "600",
                    color: "white",
                  }}
                    onClick={() => {
                    setShowForm(false);
                  }}
                >
                  Cancel
                </Button>
              </li>
            </ul>
          </div>
          {/* </Box> */}
        </div>
        </div>
      ) : editMode?(
         <>             <div className="flex justify-center items-center p-10 m-auto w-full">
                        <div className="w-full">   
                        <TextField fullWidth label="Name" onChange={(e) => handleFieldChange("name", e.target.value)} sx={{ mb: 1 }} />
                        <TextField fullWidth label="Description" onChange={(e) => handleFieldChange("description", e.target.value)} sx={{ mb: 1 }} />
                        <TextField fullWidth label="Location" onChange={(e) => handleFieldChange("location", e.target.value)} sx={{ mb: 1 }} />
                        <TextField fullWidth type="date" onChange={(e) => handleFieldChange("date", e.target.value)} sx={{ mb: 1 }} />
                        <TextField fullWidth label="Starting Price" onChange={(e) => handleFieldChange("starting_price", e.target.value)} sx={{ mb: 1 }} />
                        <TextField fullWidth label="GST Percentage" onChange={(e) => handleFieldChange("gst_percentage", e.target.value)} sx={{ mb: 1 }} />
                        <TextField fullWidth type="date" onChange={(e) => handleFieldChange("valid_till", e.target.value)} sx={{ mb: 1 }} />
                        
                        <InputLabel>Availability</InputLabel>
                        <Select fullWidth onChange={(e) => handleFieldChange("availability", e.target.value)} sx={{ mb: 1 }}>
                          <MenuItem value="true">Available</MenuItem>
                          <MenuItem value="false">Not Available</MenuItem>
                        </Select>
        
                        <FormControl fullWidth sx={{ mb: 1 }}>
                          <InputLabel>Pooja Type</InputLabel>
                          <Select onChange={(e) => handleFieldChange("poojaType", e.target.value)} label="Pooja Type">
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="special">Special</MenuItem>
                            <MenuItem value="ondemand">On-Demand</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography variant="h6">Upload Pooja Images</Typography>
        <input type="file" multiple onChange={(e) => setEditedPooja({ ...editedPooja, images: [...e.target.files] })} />
        
                        {/* Addons Section */}
        <Typography variant="h6">Addons</Typography>
        {selectedPooja.addons.map((addon,index) => (
          <Box key={addon._id} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ mr: 2 }}>{addon.name}</Typography>
            <TextField
              type="number"
              label="Price"
              // value={editedPooja.addonPrices?.[addon._id] || addon.price}
              onChange={(e) => handlePriceChange("addonPrices", addon._id, e.target.value)}
            />
        
          </Box>
        ))}
        
        {/* Packages Section */}
        <Typography variant="h6">Packages</Typography>
        {selectedPooja.packages.map((pkg) => (
          <Box key={pkg.packageId} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography sx={{ mr: 2 }}>{pkg.name}</Typography>
            <TextField
              type="number"
              label="Online Price"
              // value={editedPooja.packagePrices?.[pkg.packageId] || pkg.online_price}
              onChange={(e) => handlePriceChange("packagePrices", pkg.packageId, e.target.value)}
            />
          </Box>
        ))}
        
                        {/* Actions */}
                        <Box display="flex" justifyContent="space-around" mt={2}>
                          {/* <Button variant="contained" color="primary" onClick={() => { handleUpdatePooja(selectedPooja._id); setEditMode(false); }}>
                            Update
                          </Button>
                          <Button variant="contained" color="secondary" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button> */}
                           <Button
                                          variant="contained"
                                          style={{ backgroundColor: "#ff1100",marginRight: "10px" }}
                                          onClick={() => setEditMode(false)}              >
                                          Cancel
                                        </Button>
                                     
                                        <Button
                                          variant="contained"
                                          style={{ backgroundColor: "rgb(5, 189, 5)" }}
                                          onClick={() => { handleUpdatePooja(selectedPooja._id); setEditMode(false); }}                                          >
                                          Update
                                        </Button>
                        </Box>
                        </div>
                        </div>
                      </>
      ): (
        <section className="w-full h-screen hide-scollbar mt-3 mr-5">
          {poojaDetails.map((pooja) => (
            <div
              className="md:h-52 h-80 w-full flex flex-col md:flex-row m-2 cursor-pointer shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-7 px-4 py-6 items-center"
              key={pooja._id} 
            >
              <div className="img w-full md:h-46 md:w-80 h-40 flex items-center justify-center ">
                <img src={pooja.images[0].image_url} className="w-full h-full rounded-xl"></img>
              </div>
              <div className="txt w-full md:h-52 h-20 flex-col items-center justify-center px-4 py-4 mt-5" onClick={() => handleOpen(pooja)}>
                <h1 className="text-xl font-bold text-red-950 my-2">
                  {pooja.name}
                </h1>
                <h1 className="text-xl text-black my-2">{pooja.location}</h1>

                <h1 className="text-lg text-red-700 font-bold my-2">
                Date : {new Date(pooja.date).toDateString()}
                </h1>
                <h1 className="text-lg text-red-700 font-bold my-2">
                Valid Till: {new Date(pooja.valid_till).toDateString()}
                </h1>
                
                
              </div>

              <div className="w-full md:w-80 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
                <button
                  className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                  onClick={()=>{handleEditMode(pooja)}}
                >
                  EDIT
                  <i class="fa-solid fa-pen-to-square px-2"></i>
                </button>
                <DeleteWithConfirmation handleDeleteitem={() => handleDeletePooja(pooja._id)} />
              </div>
            </div>
            
          ))}

                <Modal
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{ timeout: 500 }}
                >
                  <Fade in={open}>
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
                      {selectedPooja && (
                        <>
                          <Typography variant="h5" gutterBottom>
                            {selectedPooja.name}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {selectedPooja.description}
                          </Typography>
                          <Typography variant="h6">Location:</Typography>
                          <Typography variant="body2" gutterBottom>
                            {selectedPooja.location}
                          </Typography>
                          <Typography variant="h6">Date:</Typography>
                          <Typography variant="body2" gutterBottom>
                            {new Date(selectedPooja.date).toDateString()}
                          </Typography>
                          <Typography variant="h6">GST Percentage</Typography>
                          <Typography variant="body2" gutterBottom>
                            {selectedPooja.gst_percentage}%
                          </Typography>
                          <Typography variant="h6">Valid Till</Typography>
                          <Typography variant="body2" gutterBottom>
                            ₹{selectedPooja.valid_till}
                          </Typography>
                          <Typography variant="h6">Availability:</Typography>
                          <Typography variant="body2" gutterBottom>
                            {selectedPooja.availability ? "Available" : "Not Available"}
                          </Typography>
                          <Typography variant="h6">Pooja Type:</Typography>
                          <Typography variant="body2" gutterBottom>
                            {selectedPooja.poojaType}
                          </Typography>
                          <Typography variant="h6">Starting Price:</Typography>
                          <Typography variant="body2" gutterBottom>
                            ₹{selectedPooja.starting_price}
                          </Typography>
                          <Typography variant="h6">Packages:</Typography>
                          {selectedPooja.packages.map((pkg) => (
                            <Typography key={pkg.packageId} variant="body2">
                              {pkg.name}: ₹{pkg.online_price} (Online) / ₹{pkg.offline_price} (Offline)
                            </Typography>
                          ))}
                          <Typography variant="h6">Add-ons:</Typography>
                          {selectedPooja.addons?.map((addon, index) => (
                            <Typography key={index} variant="body2">
                              {addon.name}: ₹{addon.price}
                            </Typography>
                          ))}
                          
                          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                            <Button variant="contained" color="primary" onClick={handleClose}>
                              Close
                            </Button>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Fade>
                </Modal>
          
          
        </section>
      )}
    </div>
  );
};
export default Poojas;
