import { useState, useContext, useRef } from "react";

import {
  AutoAwesome,
  //   CheckCircleOutline,
  PsychologyOutlined,
  SummarizeOutlined,
} from "@mui/icons-material";
import { AuthContext } from "../context/authContext";

import { Box, Button, Card, CardContent, CircularProgress, Container, Divider, Stack, Typography } from "@mui/material";
// import { getTasksSummary as summarizeTasks } from "../services/dashboardService";
import {sleep} from '../utils/utils'

const Dashboard = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const summaryRef = useRef(null);

  const { token } = useContext(AuthContext);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const streamDashboardSummary = async () => {
  setSummary("");
  setLoading(true);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("ReadableStream is not supported.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let accumulatedText = "";

    let isFirstChunk = true;

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {
        stream: true,
      });

      const events = buffer.split("\n\n");

      // Keep incomplete SSE event
      buffer = events.pop() || "";

      for (const event of events) {
        const lines = event.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) {
            continue;
          }

          const chunk = line.replace(/^data:\s?/, "");

          if (!chunk) continue;

          if (isFirstChunk) {
            isFirstChunk = false;

            setTimeout(() => {
              summaryRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 50);
          }

          // Reveal this chunk gradually
          for (const char of chunk) {
            accumulatedText += char;

            setSummary(accumulatedText);

            // Control typing speed
            await sleep(20);
          }
        }
      }
    }

    // Flush decoder
    buffer += decoder.decode();

    if (buffer.startsWith("data:")) {
      const chunk = buffer.replace(/^data:\s?/, "");

      for (const char of chunk) {
        accumulatedText += char;
        setSummary(accumulatedText);

        await sleep(20);
      }
    }

  } catch (error) {
    console.error("Streaming error:", error);
  } finally {
    setLoading(false);
  }
};
  const handleSummarize = async () => {
    await streamDashboardSummary();
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        width: "100%",
        background: "linear-gradient(135deg, #f7f9fc 0%, #eef2ff 50%, #f8f7ff 100%)",
        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          {/* =========================================
              PAGE HEADER
          ========================================= */}

          <Stack spacing={0.8}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AutoAwesome
                sx={{
                  color: "#635bff",
                  fontSize: 28,
                }}
              />

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 750,
                  letterSpacing: "-0.7px",
                }}
              >
                AI Dashboard
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary">
              Get a quick overview of everything you're working on.
            </Typography>
          </Stack>

          {/* =========================================
              MAIN AI CARD
          ========================================= */}

          <Card
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: {
                xs: "22px",
                sm: "28px",
              },
              border: "1px solid rgba(99,91,255,0.12)",
              background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
              boxShadow: "0 20px 55px rgba(99,91,255,0.20)",
              color: "#fff",
            }}
          >
            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                width: 240,
                height: 240,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                top: -120,
                right: -70,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                bottom: -100,
                left: -60,
              }}
            />

            <CardContent
              sx={{
                position: "relative",
                zIndex: 1,
                p: {
                  xs: 3,
                  sm: 4.5,
                },
              }}
            >
              <Stack spacing={3}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.13)",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <PsychologyOutlined sx={{ fontSize: 31 }} />
                </Box>

                {/* Text */}
                <Stack spacing={1}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 750,
                      letterSpacing: "-0.6px",
                      fontSize: {
                        xs: "1.9rem",
                        sm: "2.35rem",
                      },
                    }}
                  >
                    Understand your tasks
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: 620,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.82)",
                    }}
                  >
                    Let AI analyze your current tasks and give you a simple summary of what you're working on.
                  </Typography>
                </Stack>

                {/* Button */}
                <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={18} sx={{ color: "#635bff" }} /> : <SummarizeOutlined />}
                  onClick={handleSummarize}
                  disabled={loading}
                  sx={{
                    alignSelf: "flex-start",
                    px: 2.8,
                    py: 1.35,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 650,
                    color: "#635bff",
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.14)",
                    "&:hover": {
                      backgroundColor: "#f8f7ff",
                    },
                  }}
                >
                  {loading ? "Analyzing your tasks..." : "Summarize my tasks"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* =========================================
              SUMMARY
          ========================================= */}

          {summary && (
            <Card
              ref={summaryRef}
              elevation={0}
              sx={{
                borderRadius: "22px",
                border: "1px solid rgba(99,91,255,0.10)",
                backgroundColor: "rgba(255,255,255,0.94)",
                boxShadow: "0 14px 45px rgba(31,38,135,0.07)",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 3,
                    sm: 4,
                  },
                }}
              >
                <Stack spacing={3}>
                  {/* Summary Header */}
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0edff",
                        color: "#635bff",
                      }}
                    >
                      <AutoAwesome />
                    </Box>

                    <Stack spacing={0.2}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Your task summary
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Generated by AI
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  {/* Summary Body */}
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    {/* <CheckCircleOutline
                      sx={{
                        color: "#635bff",
                        mt: 0.3,
                        flexShrink: 0,
                      }}
                    /> */}

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.8,
                      }}
                    >
                      {summary}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* =========================================
              EMPTY STATE
          ========================================= */}

          {!summary && !loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
              }}
            >
              <Stack spacing={0.7} alignItems="center" textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Your AI-generated task summary will appear here.
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
