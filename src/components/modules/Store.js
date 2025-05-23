import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteWithConfirmation from "../DeleteWithConfirmation";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default function Store() {
  const backendUrl = "http://localhost:5000";
  const [value, setValue] = useState(0);
  const [activeForm, setActiveForm] = useState("product"); // default
  const [ShowForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    offer_price: "",
    description: "",
    availability: true,
    images: [],
    category_id: "",
    faqs: [],
  });
  const [current, setcurrent] = useState("Add Product");
  const [imageFile, setImageFile] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [editting, seteditting] = useState(false);
  const [item, setitem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const editmode = (item) => {
    seteditting(true);
    setitem(item);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setitem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };
  console.log(item);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleTabChange = (_, newValue) => setValue(newValue);

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleCategorySubmit = async () => {
    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    if (newCategory.image) formData.append("image", newCategory.image);
    try {
      const response = await fetch(`${backendUrl}/api/categories`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setNewCategory({ name: "", description: "", image: null });
        fetchCategories();
      }
    } catch (err) {
      console.error("Error creating category", err);
    }
  };

  const handleProductSubmit = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("offer_price", newProduct.offer_price);
    formData.append("description", newProduct.description);
    formData.append("availability", newProduct.availability);
    formData.append("category_id", newProduct.category_id);
    formData.append("faqs", JSON.stringify(newProduct.faqs));
    // Handle image upload
    newProduct.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch(
        `${backendUrl}/api/categories/${newProduct.category_id}/products`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        setNewProduct({
          name: "",
          price: "",
          offer_price: "",
          description: "",
          availability: true,
          images: [],
          category_id: "",
          faqs: [],
        });
        fetchAllProducts();
      }
    } catch (err) {
      console.error("Error creating product", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`${backendUrl}/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
      fetchAllProducts();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${backendUrl}/api/categories/:category_id/products/${id}`, { method: "DELETE" });
      fetchAllProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleProductUpdate = async (updatedItem) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/products/${updatedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      console.log("Product updated successfully");
      setEditProduct(null);
      fetchAllProducts();
    } catch (err) {
      console.error("Error updating product:", err.message);
    }
  };
  const handleCategoryUpdate = async (updatedItem) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/categories/${updatedItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      console.log("Category updated successfully");
      setEditCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err.message);
    }
  };

  const handleAddFAQ = () => {
    const newFaq = { question: "", answer: "" };
    setNewProduct({ ...newProduct, faqs: [...newProduct.faqs, newFaq] });
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFaqs = newProduct.faqs.map((faq, idx) =>
      idx === index ? { ...faq, [field]: value } : faq
    );
    setNewProduct({ ...newProduct, faqs: updatedFaqs });
  };

  const handleAvailabilityChange = (event) => {
    setNewProduct({ ...newProduct, availability: event.target.checked });
  };

  const handleCategoryImageChange = (e) => {
    setNewCategory({ ...newCategory, image: e.target.files[0] });
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct({ ...newProduct, images: files });
  };
  return (
    <div className="h-screen w-full">
      <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start outlined-text">
        Store
      </h1>
      <div className="flex w-full flex-row">
        <Tabs value={value} onChange={handleTabChange}>
          <Tab
            label="PRODUCTS"
            className="font-bold text-2xl text-red-900 ml-5 justify-start outlined-text tex-3xl"
            onClick={() => {
              setActiveForm("product");
              setcurrent("Add Product");
            }}
          ></Tab>
          <Tab
            label="CATEGORY"
            className="font-bold text-red-900 ml-5 justify-start outlined-text text-3xl"
            onClick={() => {
              setActiveForm("category");
              setcurrent("Add Category");
            }}
          ></Tab>
        </Tabs>

        <div className="flex flex-1 float-right justify-end">
          <button
            className="mr-5 rounded-xl px-4 py-2 border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all text-red-600 font-bold flex justify-center items-center float-right gap-2"
            onClick={() => {
              setShowForm(true);

              console.log("clicked");
            }}
          >
            <i className="fa-solid fa-plus"></i>
            {current}
          </button>
        </div>
      </div>

      {activeForm === "product" && (
        <div>
          {ShowForm ? (
            <div className="w-full flex justify-center">
              <div>
                <table className="w-full max-w-5xl bg-white shadow-xl rounded-xl border-2 border-spacing-y-6 border-spacing-x-4 border-separate  px-6 mt-5">
                  <tbody className="w-full">
                    <tr>
                      <td>
                        <Button
                          variant="contained"
                          component="label"
                          // margin="normal"
                        >
                          Upload Images
                          <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleProductImageChange}
                          />
                        </Button>
                        <br />
                        {newProduct.images.length > 0 && (
                          <Typography>
                            {newProduct.images
                              .map((img) => img.name)
                              .join(", ")}
                          </Typography>
                        )}
                      </td>
                      <td>
                        <TextField
                          label="Name"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              name: e.target.value,
                            })
                          }
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <TextField
                          label="Price"
                          value={newProduct.price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price: e.target.value,
                            })
                          }
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                      <td>
                        <TextField
                          label="Offer Price"
                          value={newProduct.offer_price}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              offer_price: e.target.value,
                            })
                          }
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TextField
                          select
                          // label="Category"
                          value={newProduct.category_id}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              category_id: e.target.value,
                            })
                          }
                          fullWidth
                          // margin="normal"
                          SelectProps={{ native: true }}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </TextField>
                      </td>
                      <td>
                        {" "}
                        {/* <Typography variant="h6" >
                        Availability
                      </Typography> */}
                        <FormControl fullWidth margin="normal">
                          <br />
                          <br />
                          <InputLabel>Available</InputLabel>
                          <Switch
                            checked={newProduct.availability}
                            onChange={handleAvailabilityChange}
                            inputProps={{ "aria-label": "Availability" }}
                          />
                        </FormControl>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TextField
                          label="Description"
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                      <td>
                        {/* <Typography variant="h6">FAQs</Typography> */}
                        {newProduct.faqs.map((faq, index) => (
                          <Box key={index}>
                            <TextField
                              label="Question"
                              value={faq.question}
                              onChange={(e) =>
                                handleFAQChange(
                                  index,
                                  "question",
                                  e.target.value
                                )
                              }
                              fullWidth
                              // margin="normal"
                            />
                            <TextField
                              label="Answer"
                              value={faq.answer}
                              onChange={(e) =>
                                handleFAQChange(index, "answer", e.target.value)
                              }
                              fullWidth
                              // margin="normal"
                            />
                          </Box>
                        ))}
                        <Button
                          variant="contained"
                          onClick={handleAddFAQ}
                          sx={{ mt: 2 }}
                        >
                          Add FAQ
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <Button
                          variant="contained"
                          style={{ backgroundColor: "#ff1100", width: "100%" }}
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                      </td>
                      <td>
                      <Button
                          variant="contained"
                          style={{
                            backgroundColor: "rgb(5, 189, 5)",
                            width: "100%",
                          }}
                          onClick={handleProductSubmit}
                        >
                          Add
                        </Button>
                       
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : 
          editting ? (
<div className="w-full flex justify-center">
              <div>
                <table className="w-full max-w-5xl bg-white shadow-xl rounded-xl border-2 border-spacing-y-6 border-spacing-x-4 border-separate  px-6 mt-5">
                  <tbody className="w-full">
                    <tr>
                      <td>
                        <Button
                          variant="contained"
                          component="label"
                          // margin="normal"
                        >
                          Upload Images
                          <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleProductImageChange}
                          />
                        </Button>
                        <br />
                        {item.images?.length > 0 && (
                          <Typography>
                            {item.images
                              .map((img) => img.name)
                              .join(" ")}
                          </Typography>
                        )}
                      </td>
                      <td>
                        <TextField
                          label="Name"
                          value={item.name}
                          onChange={handleInputChange}
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TextField
                          label="Price"
                          value={item.price}
                          onChange={handleInputChange}
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                      <td>
                        <TextField
                          label="Offer Price"
                          value={item.offer_price}
                          onChange={handleInputChange}
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TextField
                          select
                          // label="Category"
                          value={item.category_id}
                          onChange={handleInputChange}
                          fullWidth
                          // margin="normal"
                          SelectProps={{ native: true }}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </TextField>
                      </td>
                      <td>
                        
                        <FormControl fullWidth margin="normal">
                          <br />
                          <br />
                          <InputLabel>Available</InputLabel>
                          <Switch
                           checked={item.availability}
                           onChange={handleAvailabilityChange}
                            inputProps={{ "aria-label": "Availability" }}
                          />
                        </FormControl>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <TextField
                          label="Description"
                          value={item.description}
                          onChange={handleInputChange}
                          fullWidth
                          // margin="normal"
                        />
                      </td>
                      <td>
                        {/* <Typography variant="h6">FAQs</Typography> */}
                        {item.faqs.map((faq, index) => (
                          <Box key={index}>
                            <TextField
                              label="Question"
                              value={faq.question}
                              onChange={(e) =>
                                handleFAQChange(index, "question", e.target.value)
                              }
                              fullWidth
                              // margin="normal"
                            />
                            <TextField
                              label="Answer"
                              value={faq.answer}
                              onChange={(e) =>
                                handleFAQChange(index, "answer", e.target.value)
                              }
                              fullWidth
                              // margin="normal"
                            />
                          </Box>
                        ))}
                        <Button
                          variant="contained"
                          onClick={handleAddFAQ}
                          sx={{ mt: 2 }}
                        >
                          Add FAQ
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <Button
                          variant="contained"
                          style={{ backgroundColor: "#ff1100", width: "100%" }}
                         onClick={() => seteditting(false)}
            >
                          Cancel
                        </Button>
                      </td>
                      <td>
                      <Button
                          variant="contained"
                          style={{
                            backgroundColor: "rgb(5, 189, 5)",
                            width: "100%",
                          }}
                         onClick={() => handleProductUpdate(item)}
            >
                          Update
                        </Button>
                       
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>



          ) : (
            <section className="w-full h-screen hide-scollbar mt-3 mr-5">
              {products.map((products) => (
                <div
                  className="md:h-52 h-80 w-full flex flex-col md:flex-row m-2 shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-10 px-4 py-6 items-center"
                  key={products._id}
                >
                  <div className="img w-full md:h-46 md:w-80 h-40 flex items-center justify-center ">
                    <img
                      className="md:h-46 h-40 md:w-80 w-full object-contain items-center justify-center rounded-lg "
                      src={products.images[0].image_url}
                    ></img>
                  </div>
                  <div className="txt w-full md:h-52 h-20 flex-col items-center justify-center px-4 py-4 mt-5">
                    <h1 className="text-xl font-bold text-red-950 my-2">
                      {products.name}
                    </h1>
                    <h1 className="text-xl font-bold text-red-950 my-2">
                      Price :{products.price}
                    </h1>
                    <h1 className="text-xl font-bold text-red-950 my-2">
                      Offer Price :{products.offer_price}
                    </h1>
                  </div>

                  <div className="w-full md:w-80 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
                    <button
                      className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => editmode(products)}
                    >
                      EDIT
                      <i class="fa-solid fa-pen-to-square px-2"></i>
                    </button>
                    <DeleteWithConfirmation handleDeleteitem={() => handleDeleteProduct(products._id)}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}

      {/* </TabPanel> */}

      {/* <TabPanel value={value} index={1}> */}
      {activeForm === "category" && (
        <div>
          {ShowForm ? (
            <div className="w-full flex justify-center">
              <div>
                <Typography variant="h6">Create Category</Typography>
                <TextField
                  label="Name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="GST Percentage"
                  value={newCategory.gst_percentage}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      gst_percentage: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                />
                <br />
                <br />
                <Button
                  variant="contained"
                  style={{ backgroundColor: "black", color: "white" }}
                  component="label"
                  margin="normal"
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={handleCategoryImageChange}
                  />
                </Button>
                <br />
                {newCategory.image && (
                  <Typography>{newCategory.image.name}</Typography>
                )}
                <div className="flex justify-between gap-5 mt-5">
                  
                  <Button
                          variant="contained"
                          style={{ backgroundColor: "#ff1100", width: "100%" }}
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                 
                  <Button
                          variant="contained"
                          style={{
                            backgroundColor: "rgb(5, 189, 5)",
                            width: "100%",
                          }}
                          onClick={handleCategorySubmit}
                          >
                          Add
                        </Button>
                 
                </div>
              </div>
            </div>
          ) : editting ? (
            <>
              <Box className="w-full flex justify-center items-center p-7">
                <Box sx={{ maxWidth: 600, width: "100%" }}>
                  <Typography variant="h5" gutterBottom>
                    Edit Category
                  </Typography>
                  <TextField
                    label="Category Name"
                    name="name"
                    fullWidth
                    value={item.name}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Description"
                    name="description"
                    fullWidth
                    value={item.description}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="GST Percentage"
                    name="gst_percentage"
                    fullWidth
                    value={item.gst_percentage}
                    onChange={handleInputChange}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageChange}
                  />
                  <Grid container spacing={2} sx={{ mt: 4 }}>
                    <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: "#ff1100" }}
                        onClick={() => seteditting(false)}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ backgroundColor: "rgb(5, 189, 5)" }}
                        onClick={() => handleCategoryUpdate(item)}
                      >
                        Update
                      </Button>
                      
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </>
          ) : (
            <section className="w-full h-screen hide-scollbar mt-3 mr-5">
              {categories.map((category) => (
                <div
                  className="md:h-52 h-80 w-full flex flex-col md:flex-row m-2 shadow-md hover:shadow-xl transition border-2 border-gray-300 rounded-xl mb-10 px-4 py-6 items-center"
                  key={category._id}
                >
                  <div className="img w-full md:h-46 md:w-80 h-40 flex items-center justify-center ">
                    <img
                      className="md:h-46 h-40 md:w-80 w-full object-contain items-center justify-center rounded-lg "
                      src={category.images[0].image_url}
                    ></img>
                  </div>
                  <div className="txt w-full md:h-52 h-20 flex-col items-center justify-center px-4 py-4 mt-5">
                    <h1 className="text-xl font-bold text-red-950 my-2">
                      {category.name}
                    </h1>
                    <h1 className="text-xl font-bold text-red-950 my-2">
                      {category.description}
                    </h1>
                    <h1 className="text-xl font-bold text-red-950 my-2">
                      GST :{category.gst_percentage} %
                    </h1>
                  </div>

                  <div className="w-full md:w-80 md:h-46 h-20 my-5 flex flex-row justify-center items-center gap-4 mr-5">
                    <button
                      className="rounded-xl px-3 py-1 border-2 border-red-600 text-red-600 font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => editmode(category)}
                    >
                      EDIT
                      <i class="fa-solid fa-pen-to-square px-2"></i>
                    </button>
                    <DeleteWithConfirmation
                      handleDeleteitem={() => handleDeleteCategory(category._id)}
                    />
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
