import { useState } from "react";
import { Box, Button, Card, CardContent, Container, IconButton, InputAdornment, Stack, Typography, Divider, Link, Alert, TextField } from "@mui/material";
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from "@mui/icons-material";
import { register } from "../services/authService";
import { useNavigator } from "../hooks/useNavigate";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };
  const navigate = useNavigator();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    register(formData)
      .then((res) => {
        alert(res.msg);
        navigate("/login");
      })
      .catch((err) => {
        const message = err.response?.data?.detail || "Something went wrong. Please try again.";
        setError(message);
      });
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f7f9fc 0%, #eef2ff 50%, #f8f7ff 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center">
          {/* Logo */}
          <Stack alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                color: "#fff",
                boxShadow: "0 10px 30px rgba(99, 91, 255, 0.25)",
              }}
            >
              {/* <PersonOutline /> */}
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              Create your account
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Join us and get started in just a few seconds.
            </Typography>
          </Stack>

          {/* Signup Card */}
          <Card
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: "24px",
              border: "1px solid",
              borderColor: "rgba(0,0,0,0.08)",
              boxShadow: "0 20px 60px rgba(31, 38, 135, 0.08)",
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* First + Last Name */}
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      autoComplete="given-name"
                      slotProps={{
                        input: {
                          startAdornment: <InputAdornment position="start">{/* <PersonOutline color="action" /> */}</InputAdornment>,
                        },
                      }}
                    />

                    <TextField fullWidth label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" autoComplete="family-name" />
                  </Stack>

                  {/* Email */}
                  <TextField
                    fullWidth
                    type="email"
                    label="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* Password */}
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* Signup Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                      boxShadow: "0 10px 24px rgba(99, 91, 255, 0.22)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #554cf0 0%, #7c4de8 100%)",
                      },
                    }}
                  >
                    Create account
                  </Button>

                  <Divider sx={{ my: 0.5 }}>or</Divider>

                  {/* Login */}
                  <Typography variant="body2" textAlign="center" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      underline="hover"
                      sx={{
                        fontWeight: 600,
                        color: "#635bff",
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            By creating an account, you agree to our Terms & Privacy Policy.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignUp;
