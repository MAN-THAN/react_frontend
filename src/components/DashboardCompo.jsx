import { useState, useContext, useRef } from "react";

import {
  AutoAwesome,
  LightbulbOutlined,
  PriorityHighOutlined,
  PsychologyOutlined,
  SummarizeOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { AuthContext } from "../context/authContext";
import { sleep } from "../utils/utils";
import AiAssistantCard from "./AiAssistantCard";
import { axiosInstance }from "../axios/axiosInstance";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);

  const [analysisStarted, setAnalysisStarted] = useState(false);

  const [error, setError] = useState("");

  const analysisRef = useRef(null);

  const { token } = useContext(AuthContext);

  const API_BASE_URL = axiosInstance.defaults.baseURL;
  

  // =====================================================
  // SUMMARIZE TASKS
  // =====================================================

  const handleSummarize = async () => {
    try {
      setLoading(true);
      setError("");

      setSummary({
        summary: "",
        priorities: [],
        overdue_tasks: [],
        recommendations: [],
      });

      setAnalysisStarted(false);

      const response = await fetch(
        `${API_BASE_URL}/ai/dashboard_summary`,
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
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error(
          "Streaming is not supported by this browser."
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const events = buffer.split("\n\n");

        buffer = events.pop() || "";

        for (const eventBlock of events) {
          if (!eventBlock.trim()) {
            continue;
          }

          let eventName = "message";
          let eventData = "";

          const lines = eventBlock.split("\n");

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventName = line
                .slice(6)
                .trim();
            }

            if (line.startsWith("data:")) {
              eventData += line
                .slice(5)
                .trim();
            }
          }

          if (!eventData) {
            continue;
          }

          const data = JSON.parse(eventData);

          switch (eventName) {
            // ============================================
            // ANALYSIS STARTED
            // ============================================

            case "start":
              setAnalysisStarted(true);
              setLoading(true);

              // Smoothly move the user to the
              // live analysis section.
              setTimeout(() => {
                analysisRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);

              break;

            // ============================================
            // STRUCTURED AI DATA
            // ============================================

            case "chunk":
              await sleep(500);

              setSummary((prev) => ({
                ...prev,
                ...data,
              }));

              break;

            // ============================================
            // DONE
            // ============================================

            case "done":
              setLoading(false);
              break;

            // ============================================
            // ERROR
            // ============================================

            case "error":
              throw new Error(
                data?.message ||
                  "Unable to generate your task summary."
              );

            default:
              break;
          }
        }
      }

      // Flush decoder
      buffer += decoder.decode();

      if (buffer.trim()) {
        const lines = buffer
          .split("\n")
          .filter(Boolean);

        let eventName = "message";
        let eventData = "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventName = line
              .slice(6)
              .trim();
          }

          if (line.startsWith("data:")) {
            eventData += line
              .slice(5)
              .trim();
          }
        }

        if (eventData) {
          const data = JSON.parse(eventData);

          if (eventName === "chunk") {
            setSummary((prev) => ({
              ...prev,
              ...data,
            }));
          }
        }
      }
    } catch (err) {
      console.error(
        "Dashboard AI error:",
        err
      );

      setError(
        err?.message ||
          "Unable to generate your task summary."
      );

      setSummary(null);
      setAnalysisStarted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        width: "100%",
        background:
          "linear-gradient(135deg, #f7f9fc 0%, #eef2ff 48%, #f8f7ff 100%)",
        py: {
          xs: 3,
          sm: 5,
        },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3.5}>

          {/* =================================================
              HEADER
          ================================================= */}

          <Stack spacing={0.8}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
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
                }}
              >
                <AutoAwesome />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 750,
                  letterSpacing: "-0.7px",
                  fontSize: {
                    xs: "2rem",
                    sm: "2.35rem",
                  },
                }}
              >
                AI Dashboard
              </Typography>
            </Stack>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
              }}
            >
              Let AI turn your tasks into a clear,
              actionable overview.
            </Typography>
          </Stack>

          {/* =================================================
              HERO
          ================================================= */}

          <Card
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: {
                xs: "22px",
                sm: "28px",
              },
              background:
                "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
              boxShadow:
                "0 22px 60px rgba(99,91,255,0.22)",
              color: "#fff",
              border:
                "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.07)",
                top: -135,
                right: -80,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 170,
                height: 170,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.05)",
                bottom: -110,
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

                {/* AI Icon */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "17px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      "rgba(255,255,255,0.13)",
                    border:
                      "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <PsychologyOutlined
                    sx={{ fontSize: 32 }}
                  />
                </Box>

                <Stack spacing={1}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 750,
                      letterSpacing: "-0.7px",
                      fontSize: {
                        xs: "1.9rem",
                        sm: "2.4rem",
                      },
                    }}
                  >
                    Understand your work
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: 650,
                      lineHeight: 1.75,
                      color:
                        "rgba(255,255,255,0.82)",
                    }}
                  >
                    AI will analyze your tasks and
                    summarize your workload, priorities,
                    overdue work, and useful next steps.
                  </Typography>
                </Stack>

                {/* Summarize Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSummarize}
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={18}
                        sx={{
                          color: "#635bff",
                        }}
                      />
                    ) : (
                      <SummarizeOutlined />
                    )
                  }
                  sx={{
                    alignSelf: "flex-start",
                    px: 3,
                    py: 1.35,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 650,
                    color: "#635bff",
                    backgroundColor: "#fff",
                    boxShadow:
                      "0 10px 28px rgba(0,0,0,0.14)",
                    "&:hover": {
                      backgroundColor: "#f8f7ff",
                    },
                  }}
                >
                  {loading
                    ? "Analyzing your tasks..."
                    : "Summarize my tasks"}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* =================================================
              ANALYSIS STARTED
          ================================================= */}

          {analysisStarted && (
            <Card
              ref={analysisRef}
              elevation={0}
              sx={{
                scrollMarginTop: "90px",
                borderRadius: "22px",
                border:
                  "1px solid rgba(99,91,255,0.12)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,247,255,0.95))",
                boxShadow:
                  "0 14px 45px rgba(31,38,135,0.07)",
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
                <Stack
                  direction="row"
                  spacing={1.7}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 46,
                      height: 46,
                      borderRadius: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f0edff",
                      color: "#635bff",
                    }}
                  >
                    <AutoAwesome />

                    {loading && (
                      <CircularProgress
                        size={54}
                        thickness={2}
                        sx={{
                          position: "absolute",
                          color:
                            "rgba(99,91,255,0.25)",
                        }}
                      />
                    )}
                  </Box>

                  <Stack spacing={0.3}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                      >
                        Analysis started
                      </Typography>

                      {loading && (
                        <Chip
                          label="AI working"
                          size="small"
                          sx={{
                            height: 24,
                            borderRadius: "8px",
                            color: "#635bff",
                            backgroundColor:
                              "#f0edff",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {loading
                        ? "Analyzing your tasks and preparing your insights..."
                        : "Your AI analysis is ready."}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: "14px",
              }}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              AI RESULTS
          ================================================= */}

          {summary && analysisStarted && (
            <Stack spacing={2.5}>

              {/* SUMMARY */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: "22px",
                  border:
                    "1px solid rgba(99,91,255,0.10)",
                  backgroundColor:
                    "rgba(255,255,255,0.97)",
                  boxShadow:
                    "0 14px 45px rgba(31,38,135,0.07)",
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
                  <Stack spacing={2.5}>

                    <SectionHeader
                      icon={<AutoAwesome />}
                      title="Task Summary"
                      subtitle="AI-generated overview of your current workload"
                    />

                    <Divider />

                    {summary.summary ? (
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.9,
                          fontSize: {
                            xs: "0.95rem",
                            sm: "1rem",
                          },
                        }}
                      >
                        {summary.summary}
                      </Typography>
                    ) : (
                      <LoadingText />
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* PRIORITIES */}
              <InsightCard
                icon={<PriorityHighOutlined />}
                title="Priorities"
                subtitle="Areas that deserve your attention"
                items={summary.priorities}
                type="priority"
              />

              {/* OVERDUE */}
              <InsightCard
                icon={<WarningAmberOutlined />}
                title="Overdue Tasks"
                subtitle="Tasks that may need immediate attention"
                items={summary.overdue_tasks}
                type="overdue"
              />

              {/* RECOMMENDATIONS */}
              <InsightCard
                icon={<LightbulbOutlined />}
                title="Recommendations"
                subtitle="Suggestions based on your current workload"
                items={summary.recommendations}
                type="recommendation"
              />

            </Stack>
          )}

          {/* =================================================
              INITIAL EMPTY STATE
          ================================================= */}

          {!summary &&
            !loading &&
            !analysisStarted &&
            !error && (
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border:
                    "1px solid rgba(99,91,255,0.08)",
                  backgroundColor:
                    "rgba(255,255,255,0.72)",
                  boxShadow:
                    "0 10px 30px rgba(31,38,135,0.04)",
                }}
              >
                <CardContent
                  sx={{
                    py: {
                      xs: 4,
                      sm: 5,
                    },
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={1.2}
                    textAlign="center"
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          "#f0edff",
                        color: "#635bff",
                      }}
                    >
                      <AutoAwesome />
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      Your AI insights are waiting
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Summarize your tasks to see a
                      personalized AI overview.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            )}

        </Stack>
        {(!loading) && <AiAssistantCard />}
      </Container>
    </Box>
  );
};

// =====================================================
// SECTION HEADER
// =====================================================

const SectionHeader = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
    >
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
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.2}>
        <Typography
          variant="h6"
          fontWeight={700}
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      </Stack>
    </Stack>
  );
};

// =====================================================
// INSIGHT CARD
// =====================================================

const InsightCard = ({
  icon,
  title,
  subtitle,
  items = [],
  type,
}) => {
  const hasItems = items.length > 0;

  const isOverdue = type === "overdue";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "22px",
        border: isOverdue
          ? "1px solid rgba(217,74,61,0.10)"
          : "1px solid rgba(99,91,255,0.10)",
        backgroundColor:
          "rgba(255,255,255,0.97)",
        boxShadow:
          "0 12px 40px rgba(31,38,135,0.06)",
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
        <Stack spacing={2.5}>

          <SectionHeader
            icon={icon}
            title={title}
            subtitle={subtitle}
          />

          <Divider />

          {!hasItems ? (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                py: 1,
              }}
            >
              {/* <CheckCircleOutline
                sx={{
                  color: "#238b55",
                  fontSize: 21,
                }}
              /> */}

              <Typography
                variant="body2"
                color="text.secondary"
              >
                No items here right now.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1.2}>
              {items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems:
                      "flex-start",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: "13px",

                    backgroundColor:
                      isOverdue
                        ? "#fff9f8"
                        : "#faf9ff",

                    border:
                      "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      backgroundColor:
                        isOverdue
                          ? "#fff0ee"
                          : "#f0edff",

                      color:
                        isOverdue
                          ? "#d94a3d"
                          : "#635bff",

                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.65,
                      pt: 0.35,
                      color: "text.primary",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// =====================================================
// LOADING PLACEHOLDER
// =====================================================

const LoadingText = () => {
  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="center"
      sx={{
        py: 1,
      }}
    >
      <CircularProgress
        size={20}
        thickness={4}
        sx={{
          color: "#635bff",
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
      >
        AI is preparing your summary...
      </Typography>
    </Stack>
   
  );
};

export default Dashboard;
