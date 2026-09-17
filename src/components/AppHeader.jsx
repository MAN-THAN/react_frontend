import { useContext, useState } from "react";
import { AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from "@mui/material";

import { AutoAwesomeRounded, DashboardOutlined, LogoutOutlined, SmartToyRounded, TaskAltOutlined } from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { logout as user_logout } from "../services/authService";

const AppHeader = () => {
  const { logout, userName } = useContext(AuthContext);

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
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(250,249,255,0.92) 100%)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(99,91,255,0.08)",
        color: "#202035",
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
            columnGap: {
              xs: 1,
              sm: 4,
            },
          }}
        >
          {/* ================= BRAND ================= */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => navigate("/ai-dashboard")}
          >
            <Box
              sx={{
                position: "relative",
                width: 40,
                height: 40,
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(99,91,255,0.22)",
                overflow: "hidden",

                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: 55,
                  height: 55,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.14)",
                  top: -28,
                  right: -20,
                },
              }}
            >
              <TaskAltOutlined
                sx={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: 22,
                }}
              />
            </Box>

            <Box><Typography
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.45px",
                fontSize: 18,
                display: {
                  xs: "none",
                  sm: "block",
                },
                paddingTop: "6px",
                background: "linear-gradient(135deg, #28243e, #635bff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Task Manager
            </Typography></Box>
          </Stack>

          {/* ================= NAVIGATION ================= */}

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
                    px: 1.7,
                    py: 1,
                    borderRadius: "11px",
                    color: isActive ? "#635bff" : "#6c6a7a",
                    backgroundColor: isActive ? "#f0edff" : "transparent",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 700 : 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f5f3ff",
                      color: "#635bff",
                    },
                  }}
                >
                  <DashboardOutlined sx={{ fontSize: 18 }} />
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
                    px: 1.7,
                    py: 1,
                    borderRadius: "11px",
                    color: isActive ? "#635bff" : "#6c6a7a",
                    backgroundColor: isActive ? "#f0edff" : "transparent",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 700 : 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f5f3ff",
                      color: "#635bff",
                    },
                  }}
                >
                  <TaskAltOutlined sx={{ fontSize: 18 }} />
                  My Tasks
                </Box>
              )}
            </NavLink>
          </Stack>

          {/* ================= RIGHT ACTIONS ================= */}

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
            {/* AI ASSISTANT */}

            <Tooltip title="Open AI Assistant" placement="bottom" arrow>
              <IconButton
                onClick={() => navigate("/ai-task-assistant")}
                sx={{
                  position: "relative",
                  top : '6px',
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  color: "#635bff",
                  background: "linear-gradient(135deg, #f1efff, #e9e5ff)",
                  border: "1px solid rgba(99,91,255,0.12)",
                  boxShadow: "0 5px 15px rgba(99,91,255,0.08)",
                  transition: "all 0.2s ease",

                  "&:hover": {
                    background: "linear-gradient(135deg, #e9e5ff, #ddd7ff)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 9px 22px rgba(99,91,255,0.18)",
                  },

                  "&:active": {
                    transform: "translateY(0)",
                  },

                  // Small notification-like glow
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#8b5cf6",
                    boxShadow: "0 0 0 3px rgba(139,92,246,0.10)",
                  },
                }}
              >
                <AutoAwesomeRounded
                  sx={{
                    fontSize: 25,
                  }}
                />
              </IconButton>
            </Tooltip>

            {/* PROFILE */}

            <IconButton
              onClick={handleProfileClick}
              sx={{
                p: 0.45,
                borderRadius: "50%",
                transition: "all 0.2s ease",

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
                  fontWeight: 750,
                  background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                  boxShadow: "0 7px 18px rgba(99,91,255,0.22)",
                  border: "2px solid rgba(255,255,255,0.9)",
                }}
              >
                {userName ? userName.split(" ")[0].charAt(0).toUpperCase() + userName.split(" ")[1].charAt(0).toUpperCase() : "U"}
              </Avatar>
            </IconButton>

            {/* PROFILE MENU */}

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
                  elevation: 0,
                  sx: {
                    mt: 1.2,
                    minWidth: 195,
                    borderRadius: "16px",
                    border: "1px solid rgba(99,91,255,0.09)",
                    backgroundColor: "#fff",
                    boxShadow: "0 18px 45px rgba(38,33,90,0.13)",
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
                  py: 1.35,
                  px: 2,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#454158",
                  "&:hover": {
                    backgroundColor: "#f5f3ff",
                    color: "#635bff",
                  },
                }}
              >
                <SmartToyRounded
                  sx={{
                    fontSize: 18,
                    color: "#635bff",
                  }}
                />
                My Profile
              </MenuItem>

              <MenuItem
                onClick={handleLogout}
                sx={{
                  gap: 1.5,
                  py: 1.35,
                  px: 2,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#fff4f3",
                  },
                }}
              >
                <LogoutOutlined sx={{ fontSize: 18 }} />
                Log out
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppHeader;
