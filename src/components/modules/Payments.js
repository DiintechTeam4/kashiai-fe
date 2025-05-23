import React, { useState, useEffect } from "react";
import {
  InputLabel, Select,
  MenuItem,Container,FormControl, Typography, Paper, Tabs, Tab, Box, CircularProgress, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import FilterListIcon from "@mui/icons-material/FilterList";


const Payments = () => {
  const backendUrl = 'http://localhost:5000';

  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [poojaTypes, setPoojaTypes] = useState([]);
  const [selectedPoojaType, setSelectedPoojaType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [poojaOrderHistory, setPoojaOrderHistory] = useState([]);
  useEffect(() => {
    setLoading(true);
    let url;
    if (tabIndex === 0) {
      url = `${backendUrl}/api/admin/usersection/pooja-payments`;
    } else if (tabIndex === 1) {
      url = `${backendUrl}/api/admin/usersection/order-history`;
    }else if (tabIndex === 2) {
      url = `${backendUrl}/api/orderhistory/pooja/order-history/done`;
    }

    if (url) {
      axios.get(url)
        .then(response => {
          if (tabIndex === 0){
            setPayments(response.data);
            console.log("hello")
          }
          if (tabIndex === 1) setOrderHistory(response.data);
          if (tabIndex === 2) {
            console.log("API Response for Orders List:", response.data);
            setPoojaOrderHistory(response.data);
            const orders = response.data;
            const uniquePoojaTypes = [...new Set(orders.map((order) => order.poojaType))];
            console.log("unique pooja types"+uniquePoojaTypes)
            setPoojaTypes(uniquePoojaTypes);
          }
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, [tabIndex]); 
  const handlePoojaTypeChange = (event) => {
    setSelectedPoojaType(event.target.value);
};


  const handleChange = (event, newIndex) => {
    console.log("Switching to tab:", newIndex);
    setTabIndex(newIndex);
  };

  return (
  

    <div>
      
      <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start mb-5 outlined-text">
          Payments
        </h1>        <Paper>
        <Tabs value={tabIndex} className="bg-yellow-200" onChange={(event, newIndex) => {
    console.log("Tabs clicked, new index:", newIndex);
    setTabIndex(newIndex);
  }}  indicatorColor="primary" textColor="primary">
          <Tab label="Pooja Payments" />
          <Tab label="Order History" />
          <Tab label="Completed Pooja Orders" />  
        </Tabs>
      </Paper>

      <Box mt={3}>
        {loading ? <CircularProgress /> : error ? (
          <Typography color="error">Error fetching data</Typography>
        ) : (
          <>
{tabIndex === 0 && payments && (
  Object.entries(payments).map(([userId, poojas]) => (
    <Card key={userId} sx={{ marginBottom: 3, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" color="primary">
          {poojas.length > 0 ? poojas[0].fullname : "Unknown"}
        </Typography>
        {poojas.map((pooja, index) => {
          // Format Date (dd-mm-yy) or show "N/A" if date is missing
          let formattedDate = "N/A";
          if (pooja.payment_date) {
            const dateObj = new Date(pooja.payment_date);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });
            }
          }

          // Style Payment Status
          let statusColor = "gray";
          if (pooja.payment_status === "SUCCESS") statusColor = "green";
          if (pooja.payment_status === "PENDING") statusColor = "orange";
          if (pooja.payment_status === "FAILED") statusColor = "red"; 

          return (
            <Grid container spacing={2} key={index} sx={{ marginTop: 1, padding: 1, borderBottom: "1px solid #ddd" }}>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Pooja Name:</strong> {pooja.pooja_name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Amount:</strong> {pooja.payment_amount}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Payment Status:</strong> 
                  <span style={{ color: statusColor, fontWeight: "bold" }}> {pooja.payment_status}</span>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1"><strong>Payment Date:</strong> {formattedDate}</Typography>
              </Grid>
            </Grid>
          );
        })}
      </CardContent>
    </Card>
  ))
)}


{tabIndex === 1 && orderHistory && (
              Object.entries(orderHistory).map(([userId, orders]) => (
                <Card key={userId} sx={{ marginBottom: 3, padding: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {orders[0]?.fullname || "Unknown User"}
                    </Typography>
                    {orders.map((order, index) => (
                      <Grid container spacing={2} key={index} sx={{ marginTop: 1, padding: 1, borderBottom: "1px solid #ddd" }}>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Pooja Name:</strong> {order.pooja_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Order Date:</strong> {new Date(order.payment_date).toLocaleDateString("en-GB")}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Order Amount:</strong> ₹{order.payment_amount}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Order Status:</strong>{" "}
                            <span style={{ color: order.pooja_status === "DONE" ? "green" : "orange", fontWeight: "bold" }}>
                              {order.pooja_status}
                            </span>
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <strong>Payment Status:</strong>{" "}
                            <span style={{ color: order.payment_status === "SUCCESS" ? "green" : "red", fontWeight: "bold" }}>
                              {order.payment_status}
                            </span>
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
            {tabIndex === 2 &&
             (
              <Container>
                  
            
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography color="error">Error fetching data</Typography>
                  ) : (
                    <>


{/* {poojaTypes.length > 0 && (
                <Paper sx={{ marginBottom: 2, padding: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <FilterListIcon color="primary" />
                  <FormControl fullWidth>
                    <InputLabel>Pooja Type</InputLabel>
                    <Select value={selectedPoojaType} onChange={handlePoojaTypeChange}>
                      {poojaTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              )} */}
              {poojaTypes.length > 0 && (
  <Paper
    sx={{
      marginBottom: 2,
      padding: 2,
      display: "flex",
      alignItems: "center",
      gap: 1,
      width: "fit-content", 
    }}
  >
    <FilterListIcon color="primary" />
    <FormControl sx={{ minWidth: 200 }}> 
      <InputLabel>Pooja Type</InputLabel>
      <Select value={selectedPoojaType} onChange={handlePoojaTypeChange}>
        {poojaTypes.map((type, index) => (
          <MenuItem key={index} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Paper>
)}


                     
                      {poojaOrderHistory &&
                        poojaOrderHistory
                          .filter((order) => order.poojaType === selectedPoojaType)
                          .map((order, index) => (
                            <Card key={index} sx={{ marginBottom: 2, padding: 2 }}>
                              <CardContent>
                                <Typography variant="h6" color="primary">
                                  {order.fullName}
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Pooja Name:</strong> {order.pooja_name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Package:</strong> {order.package_name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Date:</strong>{" "}
                                      {new Date(order.date).toLocaleDateString("en-GB")}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Place:</strong> {order.place}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Amount:</strong> ₹{order.total_amount_after_gst}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Payment Status:</strong>{" "}
                                      <span
                                        style={{
                                          color:
                                            order.payment_status === "SUCCESS"
                                              ? "green"
                                              : "red",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {order.payment_status}
                                      </span>
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Perform Date:</strong>{" "}
                                      {new Date(order.perform_pooja_date).toLocaleDateString(
                                        "en-GB"
                                      )}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Perform Time:</strong> {order.perform_pooja_time}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Typography>
                                      <strong>Live URL:</strong>{" "}
                                      <a
                                        href={order.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "underline", color: "#007bff", fontWeight: "bold" }}
                                      >
                                        Watch Live
                                      </a>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                    </>
                  )}
                </Container>
            )
            
            } 
          </>
        )}
      </Box>
    </div>
  );
};

export default Payments;









