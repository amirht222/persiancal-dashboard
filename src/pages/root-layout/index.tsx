import { Box, Toolbar, useTheme } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/sidebar";

const RootLayout = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <Header
        open={open}
        toggleDrawer={() => {
          setOpen((prevState) => !prevState);
        }}
      />
      <Sidebar
        open={open}
        toggleDrawer={() => {
          setOpen((prevState) => !prevState);
        }}
      />
      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.grey[100],
          flexGrow: 1,
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Box sx={{ px: 5, py: 2 }}>
          {/* <Breadcrumb /> */}
          <Box sx={{ py: 2 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RootLayout;
