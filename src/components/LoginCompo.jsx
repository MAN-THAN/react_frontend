import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Container, IconButton, InputAdornment, Link, Stack, TextField, Typography } from "@mui/material";

import { EmailOutlined, LockOutlined, LoginOutlined, Visibility, VisibilityOff } from "@mui/icons-material";

import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { useNavigator } from "../hooks/useNavigate";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const { login: saveToken, setUserName } = useAuth();
  const navigate = useNavigator();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setError("");

      const data = await login(formData);

      saveToken(data.access_token);
      setUserName(data.user_name);

      navigate("/my-tasks");
    } catch (err) {
      const message = err.response?.data?.detail || "Invalid email or password.";

      setError(message);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "linear-gradient(135deg, #f7f9fc 0%, #eef2ff 50%, #f8f7ff 100%)",

        boxSizing: "border-box",

        px: {
          xs: 0,
          sm: 2,
        },

        py: {
          xs: 0,
          sm: 4,
        },
      }}
    >
      <Container
        maxWidth="sm"
        disableGutters
        sx={{
          width: "100%",
          height: {
            xs: "100dvh",
            sm: "auto",
          },
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",

            minHeight: {
              xs: "100dvh",
              sm: "auto",
            },

            borderRadius: {
              xs: 0,
              sm: "24px",
            },

            border: {
              xs: "none",
              sm: "1px solid rgba(0,0,0,0.08)",
            },

            boxShadow: {
              xs: "none",
              sm: "0 20px 60px rgba(31, 38, 135, 0.08)",
            },

            backgroundColor: "rgba(255,255,255,0.94)",

            backdropFilter: "blur(10px)",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

            boxSizing: "border-box",

            px: {
              xs: 2,
              sm: 0,
            },
          }}
        >
          <CardContent
            sx={{
              width: "100%",
              maxWidth: {
                xs: "100%",
                sm: "520px",
              },

              mx: "auto",

              p: {
                xs: 3,
                sm: 4.5,
              },

              boxSizing: "border-box",
            }}
          >
            <Stack
              spacing={3}
              alignItems="center"
              sx={{
                width: "100%",
              }}
            >
              {/* Brand */}
              <Stack alignItems="center" spacing={1.2}>
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
                  <LoginOutlined />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    textAlign: "center",
                  }}
                >
                  Welcome back
                </Typography>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Sign in to continue to your account.
                </Typography>
              </Stack>

              {/* Error */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    boxSizing: "border-box",
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                }}
              >
                <Stack spacing={2.5}>
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
                    autoFocus
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? "Hide password" : "Show password"}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {/* Login Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                      boxShadow: "0 10px 24px rgba(99, 91, 255, 0.22)",

                      "&:hover": {
                        background: "linear-gradient(135deg, #554cf0 0%, #7c4de8 100%)",
                        boxShadow: "0 12px 28px rgba(99, 91, 255, 0.28)",
                      },
                    }}
                  >
                    Sign in
                  </Button>

                  {/* Signup */}
                  <Typography
                    variant="body2"
                    textAlign="center"
                    color="text.secondary"
                    sx={{
                      pt: 0.5,
                    }}
                  >
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      underline="hover"
                      sx={{
                        fontWeight: 600,
                        color: "#635bff",
                      }}
                    >
                      Create one
                    </Link>
                  </Typography>
                </Stack>
              </Box>

              {/* Footer */}
              <Typography variant="caption" color="text.secondary" textAlign="center">
                Secure authentication
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
