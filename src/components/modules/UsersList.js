import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const UsersList = () => {
  const backendUrl = 'http://localhost:5000';

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/api/admin/usersection/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <Container>
      {/* <Typography variant="h5" gutterBottom>
        Users List
      </Typography> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Mobile Number</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UsersList;
