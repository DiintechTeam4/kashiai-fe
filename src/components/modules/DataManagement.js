import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import { motion } from "framer-motion";

function DataManagement() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4,mt:5, borderRadius: 3 }}>
        {/* Animated Title */}
        <div className="ml-5 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Data Management
          </Typography>
        </motion.div>

        {/* Animated Subtext */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <Typography variant="subtitle1" color="textSecondary">
            Organize and control your data effectively.
          </Typography>
        </motion.div>

        {/* Animated Content Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <Box mt={3} p={2} sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="body1">
             Manage App data at ease.
            </Typography>
          </Box>
        </motion.div>
        </div>
      </Paper>
    </Container>
  );
}

export default DataManagement;
