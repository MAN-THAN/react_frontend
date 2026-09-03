import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  EmailOutlined,
  CalendarMonthOutlined
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getUserInfo } from "../services/userService";

const Profile = () => {
  const [user, setUser] = useState();
  const initials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`.toUpperCase();
  useEffect(() => {
    getUserInfo().then(res => setUser(res)).catch(err => console.error(err))
  }, [])

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        background:
          "linear-gradient(135deg, #f7f9fc 0%, #eef2ff 50%, #f8f7ff 100%)",
        py: 5,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3.5}>

          {/* Page heading */}
          <Stack spacing={0.6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.6px",
              }}
            >
              My Profile
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              View your account information and profile details.
            </Typography>
          </Stack>

          {/* Profile Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: "24px",
              border: "1px solid rgba(0,0,0,0.07)",
              backgroundColor: "rgba(255,255,255,0.92)",
              boxShadow:
                "0 18px 55px rgba(31, 38, 135, 0.07)",
              overflow: "hidden",
            }}
          >
            {/* Top Profile Section */}
            <Box
              sx={{
                px: { xs: 3, sm: 5 },
                py: { xs: 4, sm: 5 },
                background:
                  "linear-gradient(135deg, rgba(99,91,255,0.08), rgba(139,92,246,0.04))",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Stack
                alignItems="center"
                spacing={1.5}
              >
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    fontSize: "2rem",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                    boxShadow:
                      "0 14px 30px rgba(99,91,255,0.24)",
                  }}
                >
                  {initials}
                </Avatar>

                <Stack
                  spacing={0.4}
                  alignItems="center"
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {user?.first_name} {user?.last_name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {user?.email}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Divider />

            {/* Profile Information */}
            <CardContent
              sx={{
                p: { xs: 3, sm: 4 },
              }}
            >
              <Stack spacing={3}>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Profile Information
                </Typography>

                {/* First Name */}
                <ProfileRow
                //   icon={<PersonOutline />}
                  label="First name"
                  value={user?.first_name}
                />

                {/* Last Name */}
                <ProfileRow
                //   icon={<PersonOutline />}
                  label="Last name"
                  value={user?.last_name}
                />

                {/* Email */}
                <ProfileRow
                  icon={<EmailOutlined />}
                  label="Email address"
                  value={user?.email}
                />

                {/* Created At */}
                <ProfileRow
                  icon={<CalendarMonthOutlined />}
                  label="Member since"
                  value={user?.created_at}
                />

              </Stack>
            </CardContent>
          </Card>

        </Stack>
      </Container>
    </Box>
  );
};

const ProfileRow = ({ icon, label, value }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0edff",
          color: "#635bff",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Stack
        spacing={0.3}
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
