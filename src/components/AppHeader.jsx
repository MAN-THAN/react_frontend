import { useContext, useState } from "react";
import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";

import { DashboardOutlined, LogoutOutlined, TaskAltOutlined } from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { logout as user_logout } from "../services/authService";

const AppHeader = () => {
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [profileAnchor, setProfileAnchor] = useState(null);

  const profileOpen = Boolean(profileAnchor);

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = async () => {
    handleProfileClose();
    try {
      await user_logout();
      logout();
    //   navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      alert("something went wrong");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        color: "#1f1f2e",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 72,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr auto",
              sm: "auto 1fr auto",
            },
            columnGap: 4,
          }}
        >
          {/* BRAND */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/ai-dashboard")}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                color: "#fff",
                boxShadow: "0 7px 18px rgba(99,91,255,0.2)",
              }}
            >
              <TaskAltOutlined fontSize="small" />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 750,
                letterSpacing: "-0.3px",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              TaskFlow
            </Typography>
          </Stack>

          {/* NAVIGATION */}
          <Stack
            direction="row"
            spacing={0.5}
            justifyContent="center"
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
            }}
          >
            <NavLink
              to="/ai-dashboard"
              style={{
                textDecoration: "none",
              }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.8,
                    py: 1,
                    borderRadius: "10px",
                    color: isActive ? "#635bff" : "#686878",
                    backgroundColor: isActive ? "#f0edff" : "transparent",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f5f3ff",
                      color: "#635bff",
                    },
                  }}
                >
                  <DashboardOutlined fontSize="small" />
                 AI Dashboard
                </Box>
              )}
            </NavLink>

            <NavLink
              to="/my-tasks"
              style={{
                textDecoration: "none",
              }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.8,
                    py: 1,
                    borderRadius: "10px",
                    color: isActive ? "#635bff" : "#686878",
                    backgroundColor: isActive ? "#f0edff" : "transparent",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f5f3ff",
                      color: "#635bff",
                    },
                  }}
                >
                  <TaskAltOutlined fontSize="small" />
                  My Tasks
                </Box>
              )}
            </NavLink>
          </Stack>

          {/* PROFILE */}
          <Box sx={{ justifySelf: "end" }}>
            <IconButton
              onClick={handleProfileClick}
              sx={{
                p: 0.5,
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "#f0edff",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                  boxShadow: "0 6px 18px rgba(99,91,255,0.22)",
                }}
              >
                M
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={profileAnchor}
              open={profileOpen}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 190,
                    borderRadius: "14px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 16px 40px rgba(31,38,135,0.12)",
                    overflow: "hidden",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleProfileClose();
                  navigate("/profile");
                }}
                sx={{
                  gap: 1.5,
                  py: 1.3,
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: "#f3f1ff",
                  },
                }}
              >
                {/* <PersonOutline
                  fontSize="small"
                  sx={{
                    color: "#635bff",
                  }}
                /> */}
                My Profile
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  gap: 1.5,
                  py: 1.3,
                  fontSize: "0.9rem",
                  color: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#fff4f3",
                  },
                }}
              >
                <LogoutOutlined fontSize="small" />
                Log out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
