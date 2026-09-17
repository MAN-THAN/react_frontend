import { ArrowForwardRounded, AutoAwesomeRounded, ChatBubbleOutlineRounded, CheckCircleRounded, PsychologyRounded, SmartToyRounded } from "@mui/icons-material";
import { Box, Button, Card, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AiAssistantCard = () => {
  const navigate = useNavigate();

  const handleOpenAssistant = () => {
    navigate("/ai-task-assistant");
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 4 }}>
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "28px",
          border: "1px solid rgba(99, 91, 255, 0.16)",
          background: "linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 45%, #ffffff 100%)",
          boxShadow: "0 18px 50px rgba(69, 55, 160, 0.10)",
        }}
      >
        {/* ───────────────── Decorative Glow ───────────────── */}

        <Box
          sx={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            top: -160,
            right: -70,
            background: "radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            bottom: -150,
            left: -90,
            background: "radial-gradient(circle, rgba(99,91,255,0.14) 0%, rgba(99,91,255,0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ───────────────── Content ───────────────── */}

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: {
              xs: 2.5,
              sm: 3.5,
              md: 4,
              lg: 4.5,
            },
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={{
              xs: 3,
              md: 4,
            }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* ───────────── Left ───────────── */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={3}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* AI Orb */}

              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: {
                    xs: 70,
                    sm: 82,
                  },
                  height: {
                    xs: 70,
                    sm: 82,
                  },
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                  boxShadow: "0 14px 30px rgba(99,91,255,0.28)",
                }}
              >
                {/* Inner glow */}

                <Box
                  sx={{
                    position: "absolute",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.16)",
                    filter: "blur(1px)",
                  }}
                />

                <SmartToyRounded
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: "#fff",
                    fontSize: {
                      xs: 34,
                      sm: 40,
                    },
                  }}
                />

                {/* Sparkle */}

                <Box
                  sx={{
                    position: "absolute",
                    top: -7,
                    right: -7,
                    width: 25,
                    height: 25,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    boxShadow: "0 5px 15px rgba(99,91,255,0.20)",
                  }}
                >
                  <AutoAwesomeRounded
                    sx={{
                      fontSize: 14,
                      color: "#635bff",
                    }}
                  />
                </Box>
              </Box>

              {/* Text */}

              <Stack spacing={1.5}>
                {/* Small label */}

                <Stack direction="row" spacing={0.8} alignItems="center">
                  {/* <SparklesRounded
                    sx={{
                      fontSize: 16,
                      color: "#635bff",
                    }}
                />
                */}

                  <Typography
                    sx={{
                      color: "#635bff",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.9px",
                      textTransform: "uppercase",
                    }}
                  >
                    AI Task Assistant
                  </Typography>
                </Stack>

                {/* Heading */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: 23,
                      sm: 26,
                      md: 28,
                    },
                    lineHeight: 1.2,
                    fontWeight: 750,
                    letterSpacing: "-0.5px",
                    color: "#202035",
                  }}
                >
                  Your tasks, smarter.
                </Typography>

                {/* Description */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: 13.5,
                      sm: 14,
                    },
                    lineHeight: 1.7,
                    color: "#6f6b82",
                    maxWidth: 610,
                  }}
                >
                  Talk to your AI assistant to understand your workload, create and update tasks, find what needs attention, and stay organized without leaving your workflow.
                </Typography>

                {/* Capabilities */}

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ pt: 0.5 }}>
                  <Capability icon={<ChatBubbleOutlineRounded />} label="Ask" />

                  <Capability icon={<PsychologyRounded />} label="Analyze" />

                  <Capability icon={<CheckCircleRounded />} label="Manage" />
                </Stack>
              </Stack>
            </Stack>

            {/* ───────────── Right CTA ───────────── */}

            <Stack
              alignItems={{
                xs: "stretch",
                sm: "center",
              }}
              spacing={1.2}
              sx={{
                width: {
                  xs: "100%",
                  md: 210,
                },
                flexShrink: 0,
              }}
            >
              <Button
                fullWidth
                onClick={handleOpenAssistant}
                endIcon={<ArrowForwardRounded sx={{ fontSize: 19 }} />}
                sx={{
                  minHeight: 52,
                  px: 2.5,
                  borderRadius: "16px",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                  boxShadow: "0 10px 24px rgba(99,91,255,0.24)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",

                  "&:hover": {
                    background: "linear-gradient(135deg, #584fff 0%, #7c4df0 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 14px 30px rgba(99,91,255,0.30)",
                  },

                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                Open AI Assistant
              </Button>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#8b879c",
                  textAlign: "center",
                }}
              >
                Your intelligent task companion
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
};

/* ───────────────── Capability Pill ───────────────── */

const Capability = ({ icon, label }) => {
  return (
    <Stack
      direction="row"
      spacing={0.7}
      alignItems="center"
      sx={{
        px: 1.2,
        py: 0.6,
        borderRadius: "10px",
        backgroundColor: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(99,91,255,0.10)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          color: "#635bff",
          "& svg": {
            fontSize: 15,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontSize: 11.5,
          fontWeight: 600,
          color: "#625e75",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};

export default AiAssistantCard;
