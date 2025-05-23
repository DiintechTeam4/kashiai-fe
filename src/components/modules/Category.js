import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions, Switch, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default function Category() {
  const backendUrl = 'http://localhost:5000';

  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState({ name: "", description: "", image: null });

  const handleEdit = (category) => {
    setEditingCategory(category._id);
    setUpdatedCategory({ name: category.name, description: category.description,gst_percentage: category.gst_percentage, image: category.image });
  };

  const handleImageChange = (e) => {
    setUpdatedCategory({ ...updatedCategory, image: e.target.files[0] });
  };
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: null });
  const [newProduct, setNewProduct] = useState({
    name: '', 
    price: '', 
    offer_price: '', 
    description: '', 
    availability: true, 
    images: [], 
    category_id: '', 
    gst_percentage:'',
    faqs: []
  });
  const [editProduct, setEditProduct] = useState(null);

  const handleTabChange = (_, newValue) => setValue(newValue);

  const handleUpdate = async (id) => {
    try {
      console.log("before update "+id)
      const formData = new FormData();
      formData.append("name", updatedCategory.name);
      formData.append("description", updatedCategory.description);
      formData.append("gst_percentage", updatedCategory.gst_percentage);
      if (updatedCategory.image) {
        formData.append("image", updatedCategory.image);
      }
  
      const response = await fetch(`${backendUrl}/api/categories/${id}`, {
        method: "PUT",
        body: formData,
      });

      console.log("response from api "+response)
      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("Failed to update category:", errorText);
        return;
      }
      if (response.ok) {
        console.log("response success")
        
        alert("Category updated successfully!");
  
        
        setEditingCategory(null);
        setUpdatedCategory({ name: "", description: "", gst_percentage: "", image: null });
        fetchCategories();
      } else {
        console.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  
  
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
      console.error('Error fetching categories', err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/categories/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  const handleCategorySubmit = async () => {
    if (!newCategory.image) {
    alert("Image is mandatory. Please upload an image before submitting.");
    return;
  }
    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('description', newCategory.description);
    formData.append('gst_percentage', newCategory.gst_percentage);
    if (newCategory.image) formData.append('image', newCategory.image);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setNewCategory({ name: '', description: '', image: null, gst_percentage:''});
        fetchCategories();
      }
    } catch (err) {
      console.error('Error creating category', err);
    }
  };

  const handleProductSubmit = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('offer_price', newProduct.offer_price);
    formData.append('description', newProduct.description);
    formData.append('availability', newProduct.availability);
    formData.append('category_id', newProduct.category_id);
    formData.append('faqs', JSON.stringify(newProduct.faqs));
    newProduct.images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`${backendUrl}/api/categories/${newProduct.category_id}/products`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setNewProduct({
          name: '', price: '', offer_price: '', description: '', availability: true, images: [], category_id: '', faqs: []
        });
        fetchAllProducts();
      }
    } catch (err) {
      console.error('Error creating product', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`${backendUrl}/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
      fetchAllProducts();
    } catch (err) {
      console.error('Error deleting category', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${backendUrl}/api/products/${id}`, { method: 'DELETE' });
      fetchAllProducts();
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  const handleProductUpdate = async () => {
    try {
      await fetch(`${backendUrl}/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProduct),
      });
      setEditProduct(null);
      fetchAllProducts();
    } catch (err) {
      console.error('Error updating product', err);
    }
  };

  const handleAddFAQ = () => {
    const newFaq = { question: '', answer: '' };
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
    <Box>
      <Tabs value={value} onChange={handleTabChange} centered>
        <Tab label="Create" />
        <Tab label="Manage" />
        <Tab label="Display" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Typography variant="h6">Create Category</Typography>
        <TextField
          label="Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="GST Percentage"
          value={newCategory.gst_percentage}
          onChange={(e) => setNewCategory({ ...newCategory, gst_percentage: e.target.value })}
          fullWidth
          margin="normal"
        />
        <br />
        <br />
        <Button variant="contained" style={{backgroundColor: "black", color: "white"}} component="label" margin="normal">
          Upload Image
          <input
            type="file"
            hidden
            onChange={handleCategoryImageChange}
          />
        </Button>
        <br />
        {newCategory.image && <Typography>{newCategory.image.name}</Typography>}
        <Button
          variant="contained"
          color="black"
          backgroundColor= "white"
          onClick={handleCategorySubmit}
          sx={{ mt: 2 }}
        >
          Submit Category
        </Button>
      </TabPanel>

      <TabPanel value={value} index={1}>
      <Typography variant="h6">Manage Categories</Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item key={category._id} xs={12} sm={6} md={4}>
            <Card>
            {category.images?.length > 0 && (
            <CardMedia
              component="img"
              height="140"
              image={category.images[0].image_url}
              alt={category.name}
            />
          )}

              <CardContent>
                {editingCategory === category._id ? (
                  <>
                    <TextField
                      label="Category Name"
                      fullWidth
                      value={updatedCategory.name}
                      onChange={(e) =>
                        setUpdatedCategory({ ...updatedCategory, name: e.target.value })
                      }
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      value={updatedCategory.description}
                      onChange={(e) =>
                        setUpdatedCategory({ ...updatedCategory, description: e.target.value })
                      }
                    />
                    <TextField
                      label="GST Percentage"
                      fullWidth
                      value={updatedCategory.gst_percentage}
                      onChange={(e) =>
                        setUpdatedCategory({ ...updatedCategory, gst_percentage: e.target.value })
                      }
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{category.name}</Typography>
                    <Typography variant="body2">{category.description}</Typography>
                    <Typography variant="body2">{category.gst_percentage}</Typography>
                  </>
                )}
              </CardContent>
              <CardActions>
                {editingCategory === category._id ? (
                  <Button color="primary" onClick={() => handleUpdate(category._id)}>
                    Update
                  </Button>
                ) : (
                  <Button color="primary" onClick={() => handleEdit(category)}>
                    Edit
                  </Button>
                )}
                <Button color="error" onClick={() => handleDeleteCategory(category._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography variant="h6">Display Categories</Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item key={category._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia component="img" height="140" image={category.images[0].image_url || ''} alt={category.name} />
                
                <CardContent>
                <Typography variant="h6">{category.name}</Typography>
                <Typography variant="body2">{category.description}</Typography>
                {category.gst_percentage !== undefined && (
                  <Typography variant="body2">GST: {category.gst_percentage}%</Typography>
                )}
              </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
}
