import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material";

const PaymentsList = ({ tabIndex }) => {
    const backendUrl = 'http://localhost:5000';

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${backendUrl}/api/admin/usersection/pooja-payments`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [tabIndex]);  // Re-fetch data when tabIndex changes

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error fetching data</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Pooja Payments</Typography>
            {data && Object.entries(data).map(([userId, poojas]) => (
                <Card key={userId} sx={{ marginBottom: 3, padding: 2 }}>
                    <CardContent>
                        <Typography variant="h6" color="primary">User ID: {userId}</Typography>
                        {poojas.map((pooja, index) => (
                            <Grid container spacing={2} key={index} sx={{ marginTop: 1, padding: 1, borderBottom: "1px solid #ddd" }}>
                                <Grid item xs={4}><Typography variant="body1"><strong>Full Name:</strong> {pooja.fullname}</Typography></Grid>
                                <Grid item xs={4}><Typography variant="body1"><strong>Pooja Name:</strong> {pooja.pooja_name}</Typography></Grid>
                                <Grid item xs={4}><Typography variant="body1"><strong>Payment Status:</strong> {pooja.payment_status}</Typography></Grid>
                            </Grid>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default PaymentsList;
