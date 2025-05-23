import React, { useState, useEffect } from 'react';
import { Modal,Backdrop,
  Fade,InputLabel, Select, MenuItem, FormControl, FormLabel, Tab, Tabs, Container, Box, TextField, Button, Typography, Card, CardContent, IconButton, Grid, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { Delete } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { style } from 'framer-motion/client';

const Pooja = () => {
  // const { id } = useParams();
  // const navigate = useNavigate();
  const [poojaDetails, setPoojaDetails] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [open, setOpen] = useState(false);

  const [expandedPoojaId, setExpandedPoojaId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPoojaId, setSelectedPoojaId] = useState(null);
  const [editedPooja, setEditedPooja] = useState({
    addonPrices: {},  
  packagePrices: {},
  images: []
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
  const [poojaData, setPoojaData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    availability: 'true',
    valid_till: '',
    starting_price: '',
    gst_percentage: '',
    packages: [],
    images: [],
    faqs: [],
    poojaType: '',
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
      console.error('Error fetching pooja details:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 2) {
      fetchPoojaDetails();
    }
  }, [activeTab]);

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

      formData.append('name', poojaData.name);
      formData.append('description', poojaData.description);
      formData.append('location', poojaData.location);
      formData.append('date', poojaData.date);
      formData.append('availability', poojaData.availability);
      formData.append('starting_price', poojaData.starting_price);
      formData.append('valid_till', poojaData.valid_till);
      formData.append('poojaType', poojaData.poojaType);
      formData.append('gst_percentage', poojaData.gst_percentage);

      formData.append('packages', JSON.stringify(poojaData.packages));
      formData.append('faqs', JSON.stringify(poojaData.faqs));
      formData.append('addons', JSON.stringify(poojaData.addons));
      // console.log('poojadata addons'+poojaData.addons.image)

      console.log(poojaData.images)
      console.log(poojaData.addons)

      poojaData.addons.forEach((addon, /*index*/) => {
        if (addon.imageFile) {
          formData.append('addonImages', addon.imageFile);
        }
      });


      poojaData.images.forEach((image) => {
        if (image.file) formData.append('images', image.file);
      });


      const response = await fetch(`http://localhost:5000/api/poojas`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data)
      alert(data.message);
    } catch (error) {
      console.error('Error creating pooja:', error);
    }
  };

  const handleUpdatePooja = async (poojaId) => {
    console.log(poojaId)
    // try {
    //   const updatedData = {
    //     ...editedPooja,
    //     addons: poojaData.addons.map((addon) => ({
    //       _id: addon._id,
    //       price: editedPooja.addonPrices?.[addon._id] || addon.price,
    //     })),
    //     packages: poojaData.packages.map((pkg) => ({
    //       packageId: pkg.packageId,
    //       online_price: editedPooja.packagePrices?.[pkg.packageId] || pkg.online_price,
    //     })),
    //   };
    //   console.log(updatedData)
    //   const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/poojas/${poojaId}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(editedPooja),  
    //   });
  
    //   const data = await response.json();
    //   alert(data.message);
      
      
    //   setPoojaDetails((prev) =>
    //     prev.map((pooja) =>
    //       pooja._id === poojaId ? { ...pooja, ...editedPooja } : pooja
    //     )
    //   );
  
    //   setSelectedPoojaId(null);
    // } catch (error) {
    //   console.error("Error updating pooja:", error);
    // }
    try {
      const formData = new FormData();
  
      // Append all edited Pooja fields
      Object.keys(editedPooja).forEach((key) => {
        if (key !== "images" && key !== "addons") {
          formData.append(key, editedPooja[key]);
        }
      });
  
      // Append Pooja Images
      // editedPooja.images.forEach((image, index) => {
      //   formData.append(`images`, image); 
      // });
  
      // Append Addon Images
      // editedPooja.addons.forEach((addon, index) => {
      //   if (addon.image) {
      //     formData.append(`addons[${index}][image]`, addon.image);
      //     formData.append(`addons[${index}][_id]`, addon._id);
      //   }
      // });


      editedPooja.images?.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      // Append Addon Images
      // editedPooja.addons?.forEach((addon, index) => {
      //   if (addon?.image) {
      //     formData.append(`addons[${index}][image]`, addon.image);
      //     formData.append(`addons[${index}][_id]`, addon._id);
      //   }
      // });
      const response = await fetch(`http://localhost:5000/api/poojas/${poojaId}`, {
        method: "PUT",
        body: formData,
      });
  
      const data = await response.json();
      console.log("response data"+data)
      alert(data.message);
  
      setPoojaDetails((prev) =>
        prev.map((pooja) => (pooja._id === poojaId ? { ...pooja, ...editedPooja } : pooja))
      );
  
      setSelectedPoojaId(null);
    } catch (error) {
      console.error("Error updating pooja:", error);
    }
  };

  const handleDeletePooja = async (id) => {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:5000/api/poojas/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Pooja deleted successfully');
      }

      fetchPoojaDetails();
    } catch (error) {
      console.error('Error deleting pooja:', error);
    }
  };

  const handleAddPackage = () => {
    setPoojaData({
      ...poojaData,
      packages: [...poojaData.packages, { name: '', price: '', availability_mode: 'offline', offline_price: '', online_price: '' }],
    });
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = poojaData.packages.map((pkg, idx) =>
      idx === index ? { ...pkg, [field]: value } : pkg
    );
    setPoojaData({ ...poojaData, packages: updatedPackages });
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = poojaData.packages.filter((_, idx) => idx !== index);
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
      faqs: [...poojaData.faqs, { question: '', answer: '' }],
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
      addons: [...poojaData.addons, { name: '', description: '', price: '' }],
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
      images: [...poojaData.images, { file: null, preview: '' }],
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
        [id]: value
      }
    }));
  };
  

  return (
    <Container>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Create Pooja" />
        <Tab label="Manage Pooja" />
        <Tab label="Display Pooja" />
      </Tabs>


      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5">Create Pooja</Typography>
            <br />
            <TextField
              label="Pooja Name"
              fullWidth
              value={poojaData.name}
              onChange={(e) => setPoojaData({ ...poojaData, name: e.target.value })}
            />
            <br />
            <br />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={poojaData.description}
              onChange={(e) => setPoojaData({ ...poojaData, description: e.target.value })}
            />
            <br />
            <br />
            <TextField
              label="Location"
              fullWidth
              value={poojaData.location}
              onChange={(e) => setPoojaData({ ...poojaData, location: e.target.value })}
            />
            <br />
            <br />
            <TextField
              label="Date"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={poojaData.date}
              onChange={(e) => setPoojaData({ ...poojaData, date: e.target.value })}
            />
            <br />
            <br />
            <TextField
              label="Valid Till"
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={poojaData.valid_till}
              onChange={(e) => setPoojaData({ ...poojaData, valid_till: e.target.value })}
            />
            <br />
            <br />

            <FormControl component="fieldset">
              <br />
              <FormLabel component="legend">Availability</FormLabel>
              <RadioGroup
                row
                value={poojaData.availability}
                onChange={(e) => setPoojaData({ ...poojaData, availability: e.target.value === 'true' })}
              >
                <FormControlLabel value="true" control={<Radio />} label="Available" />
                <FormControlLabel value="false" control={<Radio />} label="Not Available" />
              </RadioGroup>
            </FormControl>
            <br />
            <br />

            <TextField
              label="Price"
              fullWidth
              type="number"
              value={poojaData.starting_price}
              onChange={(e) => setPoojaData({ ...poojaData, starting_price: e.target.value })}
            />
            <br />
            <br />
            <TextField
              label="GST Percentage"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0, max: 100 } }} // Ensures valid input range
              value={poojaData.gst_percentage}
              onChange={(e) => setPoojaData({ ...poojaData, gst_percentage: e.target.value })}
            />
            <br />
            <br />

            <Typography variant="h6">Pooja Type</Typography>
            <RadioGroup
              row
              value={poojaData.poojaType}
              onChange={(e) => setPoojaData({ ...poojaData, poojaType: e.target.value })}
            >
              <FormControlLabel value="special" control={<Radio />} label="Special" />
              <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
              <FormControlLabel value="ondemand" control={<Radio />} label="On Demand" />
            </RadioGroup>
            <br />
            <div className='pack' style={{ display: "flex",}}>
              <ul>
                <li>
                  <Typography variant="h6">Packages</Typography>
                  {poojaData.packages.map((pkg, index) => (
                    <Card key={index}>
                      <CardContent>
                        <TextField
                          label="Package Name"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                        />
                        <br />
                        <br />
                        <TextField
                          label="Package Description"
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                        />
                        <RadioGroup
                          value={pkg.availability_mode}
                          onChange={(e) => handleAvailabilityModeChange(index, e.target.value)}
                        >
                          {/* <FormControlLabel value="offline" control={<Radio />} label="Offline" /> */}
                          <FormControlLabel value="online" control={<Radio />} label="Online" />
                        </RadioGroup>
                        <br />
                        <br />
                        {/* <TextField
                          label="Offline Price"
                          type="number"
                          value={pkg.offline_price}
                          onChange={(e) => handlePackageChange(index, 'offline_price', e.target.value)}
                        />
                        <br />
                        <br /> */}
                        <TextField
                          label="Price"
                          type="number"
                          value={pkg.online_price}
                          onChange={(e) => handlePackageChange(index, 'online_price', e.target.value)}
                        />
                        <IconButton onClick={() => handleRemovePackage(index)}>
                          <Delete />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={handleAddPackage}>Add Package</Button>
                </li>


                  <li><Typography variant="h6">FAQs</Typography>
                    {poojaData.faqs.map((faq, index) => (
                      <Card key={index}>
                        <CardContent>
                          <TextField
                            label="Question"
                            value={faq.question}
                            onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                          /> &nbsp; &nbsp;
                          <TextField
                            label="Answer"
                            value={faq.answer}
                            onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                          />
                          <IconButton onClick={() => handleRemoveFAQ(index)}>
                            <Delete />
                          </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={handleAddFAQ}>Add FAQ</Button>
                  </li>


                  <li><Typography variant="h6">Addons</Typography>
                    {poojaData.addons.map((addon, index) => (
                      <Card key={index}>
                        <CardContent>
                          <TextField
                            label="Addon Name"
                            value={addon.name}
                            onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                          />&nbsp; &nbsp;
                          <TextField
                            label="Description"
                            value={addon.description}
                            onChange={(e) => handleAddonChange(index, 'description', e.target.value)}
                          />&nbsp; &nbsp;
                          <TextField
                            label="Price"
                            value={addon.price}
                            type="number"
                            onChange={(e) => handleAddonChange(index, 'price', e.target.value)}
                          />&nbsp; &nbsp;
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


                  <li><Typography variant="h6">Images</Typography>
                    {poojaData.images.map((image, index) => (
                      <Box key={index} display="inline-block" marginRight={2}>
                        {image.preview && <img src={image.preview} alt="Pooja" width={100} />}
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
                    <Button onClick={handleCreatePooja} style={{width: "130px", height: "50px", backgroundColor: "#ff1100", fontWeight: "600" , color: "white"}}>Create Pooja</Button>
                  </li>
              </ul>
            </div>
          </Box>
        )}

{activeTab === 1 && Array.isArray(poojaDetails) && poojaDetails.length > 0 && (
  <Box>
    <Typography variant="h5" sx={{ mb: 2 }}>Manage Pooja</Typography>

    {poojaDetails.map((pooja) => (
      <Card 
        key={pooja._id} 
        sx={{ mb: 2, p: 2, cursor: "pointer" }}
        onClick={() => {
          if (selectedPoojaId === pooja._id) {
            setSelectedPoojaId(null);
          } else {
            setSelectedPoojaId(pooja._id);
          }
        }}
      >
        {/* Show Name Only Initially */}
        <Typography variant="h6">{pooja.name}</Typography>

        {/* Show Details If Selected */}
        {selectedPoojaId === pooja._id && (
          <Box sx={{ mt: 2 }} onClick={(e) => e.stopPropagation()}>
            {editMode ? (
              
              <>
                <TextField fullWidth label="Name" onChange={(e) => handleFieldChange("name", e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth label="Description" onChange={(e) => handleFieldChange("description", e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth label="Location" onChange={(e) => handleFieldChange("location", e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth type="date" onChange={(e) => handleFieldChange("date", e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth label="Starting Price" onChange={(e) => handleFieldChange("starting_price", e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth label="GST Percentage" onChange={(e) => handleFieldChange("gst_percentage", e.target.value)} sx={{ mb: 1 }} />
                <TextField fullWidth type="date" label="Valid Till" onChange={(e) => handleFieldChange("valid_till", e.target.value)} sx={{ mb: 1 }} />
                
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
{pooja.addons.map((addon,index) => (
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
{pooja.packages.map((pkg) => (
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
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button variant="contained" color="primary" onClick={() => { handleUpdatePooja(pooja._id); setEditMode(false); }}>
                    Update
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              
              <>
                <Typography><strong>Description:</strong> {pooja.description}</Typography>
                <Typography><strong>Location:</strong> {pooja.location}</Typography>
                <Typography><strong>Date:</strong> {pooja.date}</Typography>
                <Typography><strong>Starting Price:</strong> {pooja.starting_price}</Typography>
                <Typography><strong>GST Percentage:</strong> {pooja.gst_percentage}</Typography>
                <Typography><strong>Valid Till:</strong> {pooja.valid_till}</Typography>
                <Typography><strong>Availability:</strong> {pooja.availability === "true" ? "Available" : "Not Available"}</Typography>
                <Typography><strong>Pooja Type:</strong> {pooja.poojaType}</Typography>

                {/* Actions */}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button variant="contained" color="warning" onClick={() => { setEditMode(true); setEditedPooja({}); }}>
                    Edit
                  </Button>
                  <IconButton color="error" onClick={() => handleDeletePooja(pooja._id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        )}
      </Card>
    ))}
  </Box>
)}




        {activeTab === 2 && (

          <Box>
      <Grid container spacing={2}>
        {poojaDetails.map((pooja) => (
          <Grid item xs={12} sm={6} md={4} key={pooja._id}>
            <Card onClick={() => handleOpen(pooja)} style={{ cursor: "pointer" }}>
              <CardContent>
                <Typography variant="h6">
                  <b>{pooja.name}</b>
                </Typography>
                <Typography variant="body2" style={{ overflow: "hidden" }}>
                  {pooja.description.substring(0, 100)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
    </Box>
        )}


      </Box>
    </Container >
  );
};

export default Pooja;
