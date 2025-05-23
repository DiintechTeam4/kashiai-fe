import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

const OrdersList = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orderHistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [poojaTypes, setPoojaTypes] = useState([]);
  const [selectedPoojaType, setSelectedPoojaType] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/orderhistory/pooja/order-history/done")
      .then((response) => {
        const orders = response.data;

        console.log("order"+orders)
        const uniquePoojaTypes = [...new Set(orders.map((order) => order.poojaType))];
        console.log("unique pooja types"+uniquePoojaTypes)
        setOrderHistory(orders);
        setPoojaTypes(uniquePoojaTypes);
        setSelectedPoojaType(uniquePoojaTypes[0] || ""); // Default to first type
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handlePoojaTypeChange = (event, newIndex) => {
    setSelectedPoojaType(poojaTypes[newIndex]);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Puja Orders
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error fetching data</Typography>
      ) : (
        <>
          {/* Puja Type Filter Tabs */}
          {poojaTypes.length > 0 && (
            <Paper sx={{ marginBottom: 2 }}>
              <Tabs
                value={poojaTypes.indexOf(selectedPoojaType)}
                onChange={handlePoojaTypeChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {poojaTypes.map((type, index) => (
                  <Tab key={index} label={type.toUpperCase()} />
                ))}
              </Tabs>
            </Paper>
          )}

          {/* Display Orders Based on Selected Pooja Type */}
          {orderHistory &&
            orderHistory
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
  );
};

export default OrdersList;
