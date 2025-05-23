// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Darshan from './modules/Darshan';
// import Pooja from './modules/Pooja';
// import Store from './modules/Store';
// import Astro from './modules/Astro';
// import Catagory from './modules/Catagory';
// import Product from './modules/Product';
// import Keys from './modules/Keys'
// import Credit from './modules/Credit'
// function Dashboard() {
//   return (
//     <>
//     <Routes>
//       <Route path="/dashboard/darshan" element={<Darshan />} />
//       <Route path="/dashboard/pooja" element={<Pooja />} />
//       <Route path="/dashboard/store" element={<Store />} />
//       <Route path="/dashboard/astro" element={<Astro />} />
//       <Route path="/dashboard/Catagory" element={<Catagory />} />
//       <Route path="/dashboard/Product" element={<Product />} />
//       <Route path="/dashboard/Keys" element={<Keys />} />
//       <Route path="/dashboard/credit" element={<Credit/>} />
//     </Routes>
    
//     </>
//   );
// }

// export default Dashboard;


import React from "react";
import { Link } from "react-router-dom";
import { Container, Button, Box, Typography, Paper } from "@mui/material";

function Dashboard() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Manage data and monitor users efficiently
        </Typography>
        <Box display="flex" justifyContent="center" gap={3} mt={3}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/dashboard/data-management" 
            sx={{ minWidth: 200, py: 1.5, fontSize: "1rem", textTransform: "none" }}
          >
            Data Management
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            component={Link} 
            to="/dashboard/user-monitoring" 
            sx={{ minWidth: 200, py: 1.5, fontSize: "1rem", textTransform: "none" }}
          >
            User Monitoring
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Dashboard;
