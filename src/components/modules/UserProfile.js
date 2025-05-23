import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import ScrollToTop from "../SceollToTop";

const UserProfile = () => {
  const backendUrl = "http://localhost:5000";

  const [totalUsers, setTotalUsers] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  const getCreatedAtFromObjectId = (objectId) => {
    const timestamp = parseInt(objectId.substring(0, 8), 16);
    const time = new Date(timestamp * 1000);
    return time;
  };
  const gettotalUsers = async () => {
    const response = await fetch(
      `${backendUrl}/api/admin/usersection/totalusers`
    );
    const data = await response.json();
    console.log(data);
    setTotalUsers(data.totalUsers);
  };
  const handleRowClick = (userid) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      navigate(`/dashboard/user/${userid}`);
    }, 200); // small delay to let scroll happen first
  };
  
  useEffect(() => {
    gettotalUsers();
  
    setLoading(true);
    axios
      .get(`${backendUrl}/api/admin/usersection/users`)
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);
  
  return (
    <div>
      <h1 className="font-bold text-2xl text-red-900 ml-5 justify-start hover:font-sans outlined-text">
        USERS
      </h1>

      <Box mt={3}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Error fetching data</Typography>
        ) : (
          <>
            {tabIndex === 0 && (
              <TableContainer>
                <Table className="shadow-lg table-auto">
                  <TableHead>
                    <TableRow className="bg-red-300">
                      <TableCell>
                        <strong>S.No</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Mobile Number</strong>
                      </TableCell>
                      <TableCell>
                        <strong>City</strong>
                      </TableCell>
                      {/* <TableCell>
                        <strong>Gender</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Occupation</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Gotra</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Available Credits</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Role</strong>
                      </TableCell> */}
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Time</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...users]
                      .sort((a, b) => {
                        const dateA = getCreatedAtFromObjectId(a._id);
                        const dateB = getCreatedAtFromObjectId(b._id);
                        return dateB - dateA; // Descending (newest first). Use dateA - dateB for ascending.
                      })
                      .map((user, index) => {
                        const time = getCreatedAtFromObjectId(user._id);
                        return (
                          <TableRow
                            key={user._id}
                            className={`${user.role=="admin"?"bg-green-300":""} hover:shadow-inner cursor-pointer`}
                            onClick={() => handleRowClick(user._id)}
                          >
                            <TableCell>{totalUsers - index}</TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.mobileNumber}</TableCell>
                            <TableCell>{user.city}</TableCell>
                            {/* <TableCell>{user.gender}</TableCell>
                            <TableCell>{user.occupation}</TableCell>
                            <TableCell>{user.gotra}</TableCell>
                            <TableCell>{user.available_credits}</TableCell>
                            <TableCell>{user.role}</TableCell> */}
                            <TableCell>{time.toLocaleDateString()}</TableCell>
                            <TableCell>{time.toLocaleTimeString()}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default UserProfile;
