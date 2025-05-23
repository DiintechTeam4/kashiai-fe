import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions, Switch, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default function Product() {
  const backendUrl = 'http://localhost:5000';

  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    faqs: []
  });
  const [editProduct, setEditProduct] = useState(null);

  const handleTabChange = (_, newValue) => setValue(newValue);

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  const handleUpdate = async() => {
    const response = await fetch(`${backendUrl}/categories/${editProduct.id}/products/${editProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProduct),
    })
    const data = await response.json();
      alert(data.message);
  };
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };
  const fetchProductsByCategory = async (categoryId) => {
    if (selectedCategory === categoryId) {
      // If the same category is clicked, toggle off the products
      setSelectedCategory(null);
      setProducts([]);
      return;
    }
  
    try {
      const res = await fetch(`${backendUrl}/api/categories/${categoryId}/products`);
      const data = await res.json();
      setProducts(data);
      setSelectedCategory(categoryId);
    } catch (err) {
      console.error('Error fetching products', err);
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
    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('description', newCategory.description);
    if (newCategory.image) formData.append('image', newCategory.image);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setNewCategory({ name: '', description: '', image: null });
        fetchCategories();
      }
    } catch (err) {
      console.error('Error creating category', err);
    }
  };
  const handleEdit = (product) => {
    setEditProduct(product);
    setEditMode(false);
  };
  const handleProductSubmit = async () => {
    if (newProduct.images.length === 0) {
      alert("Please upload at least one image for the product.");
      return;
    }
    console.log("newproduct id"+newProduct.category_id)
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('offer_price', newProduct.offer_price);
    formData.append('description', newProduct.description);
    formData.append('availability', newProduct.availability);
    formData.append('category_id', newProduct.category_id);
    formData.append('faqs', JSON.stringify(newProduct.faqs));
    // Handle image upload
    newProduct.images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories/${newProduct.category_id}/products`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert("Product successfully added!");
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
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
      fetchAllProducts();
    } catch (err) {
      console.error('Error deleting category', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`, { method: 'DELETE' });
      fetchAllProducts();
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  const handleProductUpdate = async (id) => {
    console.log("id"+id)
    console.lof("editeproduct"+editProduct)
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`, {
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
        <Typography variant="h6" sx={{ mt: 4 }}>
          Create Product
        </Typography>
        <TextField
          label="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Offer Price"
          value={newProduct.offer_price}
          onChange={(e) => setNewProduct({ ...newProduct, offer_price: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          fullWidth
          margin="normal"
        />
        
        <TextField
          select
          label="Category"
          value={newProduct.category_id}
          onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
          fullWidth
          margin="normal"
          SelectProps={{ native: true }}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </TextField>

        <Typography variant="h6" sx={{ mt: 4 }}>FAQs</Typography>
        {newProduct.faqs.map((faq, index) => (
          <Box key={index}>
            <TextField
              label="Question"
              value={faq.question}
              onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Answer"
              value={faq.answer}
              onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        ))}
        <Button variant="contained" style={{backgroundColor: "skyblue"}} onClick={handleAddFAQ} sx={{ mt: 2 }}>Add FAQ</Button>

        <Typography variant="h6" sx={{ mt: 4 }}>Availability</Typography>
        <FormControl fullWidth margin="normal">
          <br />
          <br />
          <InputLabel>Available</InputLabel>
          <Switch
            checked={newProduct.availability}
            onChange={handleAvailabilityChange}
            inputProps={{ 'aria-label': 'Availability' }}
          />
        </FormControl>

        <Typography variant="h6" sx={{ mt: 4 }}>Upload Product Images</Typography>
        <br />
        <Button variant="contained" component="label" margin="normal" style={{ backgroundColor: "black", color: "white"}}>
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
          <Typography>{newProduct.images.map(img => img.name).join(', ')}</Typography>
        )}
        <Button variant="contained"  color="black" onClick={handleProductSubmit} sx={{ mt: 2, backgroundColor: "white" }}>
          Submit Product
        </Button>
      </TabPanel>

      <TabPanel value={value} index={1}>

        <Typography variant="h6" sx={{ mt: 4 }}>Manage Products</Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia component="img" height="140" image={product.images[0] || ''} alt={product.name} />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2">Price: {product.price}</Typography>
                  <Typography variant="body2">Offer Price: {product.offer_price}</Typography>
                  <Typography variant="body2">Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => setEditProduct(product)}>Edit</Button>
                  <Button color="error" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={2}>
  <Typography variant="h6">Categories</Typography>
  <Grid container spacing={2}>
    {categories.map((category) => (
      <Grid item key={category._id} xs={12} sm={6} md={4}>
        <Card onClick={() => fetchProductsByCategory(category._id)} style={{ cursor: 'pointer' }}>
          <CardMedia
            component="img"
            height="140"
            image={category.images?.[0]?.image_url || 'default-image-url'}
            alt={category.name}
          />
          <CardContent>
            <Typography variant="h6">{category.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {category.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>

  {selectedCategory && (
    <>
      <Typography variant="h6" sx={{ mt: 4 }}>Products</Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Card>
              {/* Image Slider using Swiper */}
              <Swiper navigation modules={[Navigation]} className="mySwiper">
                {product.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={img.image_url}
                      alt={product.name}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">Price: ₹{product.price}</Typography>
                <Typography variant="body2">Offer Price: ₹{product.offer_price}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.description}
                </Typography>
                <Typography variant="body2" color={product.availability ? 'green' : 'red'}>
                  {product.availability ? 'In Stock' : 'Out of Stock'}
                </Typography>
                
                {/* FAQs */}
                <Typography variant="h6" sx={{ mt: 2 }}>FAQs</Typography>
                {product.faqs.map((faq, index) => (
                  <Typography key={index} variant="body2">
                    <strong>Q:</strong> {faq.question} <br />
                    <strong>A:</strong> {faq.answer}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )}
</TabPanel>

    </Box>
  );
}
