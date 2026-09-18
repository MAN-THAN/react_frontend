import { AutoAwesomeRounded } from "@mui/icons-material";

import { Box, Stack, Typography } from "@mui/material";

import AgentActivity from "./AgentActivity";
import FinalResponse from "./FinalAssistantResponse";

const AssistantMessage = ({ message }) => {
  const isRunning = message.status === "starting" || message.status === "running";

  const hasActivities = message.activities?.length > 0;

  const hasContent = Boolean(message.content?.trim());

  const hasError = Boolean(message.error);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        width: "100%",
      }}
    >
      {/* ================================= */}
      {/* AI AVATAR */}
      {/* ================================= */}

      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "13px",
          flexShrink: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",

          boxShadow: "0 7px 18px rgba(99, 91, 255, 0.20)",
        }}
      >
        <AutoAwesomeRounded
          sx={{
            color: "#fff",
            fontSize: 19,
          }}
        />
      </Box>

      {/* ================================= */}
      {/* MESSAGE CONTENT */}
      {/* ================================= */}

      <Stack
        spacing={1.5}
        sx={{
          maxWidth: 760,
          width: "100%",
          minWidth: 0,
        }}
      >
        {/* AI NAME */}

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#817c96",
            letterSpacing: "0.1px",
          }}
        >
          AI Assistant
        </Typography>

        {/* ================================= */}
        {/* AGENT ACTIVITY */}
        {/* ================================= */}

        {(isRunning || hasActivities) && <AgentActivity activities={message.activities || []} status={message.status} />}

        {/* ================================= */}
        {/* INITIAL THINKING STATE */}
        {/* ================================= */}

        {isRunning && !hasActivities && !hasContent && (
          <Box
            sx={{
              px: 2,
              py: 1.4,
              borderRadius: 3,

              backgroundColor: "#faf9ff",
              border: "1px solid rgba(99, 91, 255, 0.08)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  display: "flex",
                  gap: "4px",
                }}
              >
                <TypingDot delay="0s" />
                <TypingDot delay="0.15s" />
                <TypingDot delay="0.3s" />
              </Box>

              <Typography
                sx={{
                  fontSize: 12.5,
                  color: "#77738a",
                }}
              >
                Thinking...
              </Typography>
            </Stack>
          </Box>
        )}

        {/* ================================= */}
        {/* FINAL RESPONSE */}
        {/* ================================= */}

        {message.content && <FinalResponse content={message.content} streaming={message.status === "running"} />}

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {hasError && (
          <Box
            sx={{
              px: 2,
              py: 1.4,
              borderRadius: 3,

              backgroundColor: "#fff5f4",

              border: "1px solid rgba(211, 47, 47, 0.10)",

              color: "#c62828",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {message.error}
            </Typography>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

/* ================================= */
/* TYPING DOT */
/* ================================= */

const TypingDot = ({ delay }) => {
  return (
    <Box
      sx={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        backgroundColor: "#635bff",

        animation: "assistantTyping 1.2s infinite ease-in-out",

        animationDelay: delay,

        "@keyframes assistantTyping": {
          "0%, 60%, 100%": {
            opacity: 0.25,
            transform: "translateY(0)",
          },

          "30%": {
            opacity: 1,
            transform: "translateY(-2px)",
          },
        },
      }}
    />
  );
};

export default AssistantMessage;
