import { useState } from "react";

import { ArrowUpwardRounded, AutoAwesomeRounded, StopRounded } from "@mui/icons-material";

import { Box, IconButton, InputBase, Paper, Stack, Tooltip } from "@mui/material";

const AssistantInput = ({ onSend, loading, onStop }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    onSend(message);
    setInput("");
  };

  const handleKeyDown = (event) => {
    // Enter = send
    // Shift + Enter = new line
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 0.8,
        pl: 2,

        borderRadius: "20px",

        border: "1px solid rgba(99, 91, 255, 0.13)",

        background: "rgba(255,255,255,0.94)",

        boxShadow: "0 10px 32px rgba(70, 60, 150, 0.09)",

        transition: "all 0.2s ease",

        "&:focus-within": {
          borderColor: "rgba(99, 91, 255, 0.35)",

          boxShadow: "0 10px 35px rgba(99, 91, 255, 0.13)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-end" spacing={1}>
        {/* ================================= */}
        {/* AI ICON */}
        {/* ================================= */}

        <Box
          sx={{
            width: 34,
            height: 34,
            mb: 0.4,
            flexShrink: 0,

            borderRadius: "11px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background: "linear-gradient(135deg, #f0edff, #e8e3ff)",

            color: "#635bff",
          }}
        >
          <AutoAwesomeRounded
            sx={{
              fontSize: 18,
            }}
          />
        </Box>

        {/* ================================= */}
        {/* INPUT */}
        {/* ================================= */}

        <InputBase
          fullWidth
          multiline
          maxRows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={loading ? "AI is working..." : "Ask your assistant..."}
          sx={{
            flex: 1,

            fontSize: 14,
            lineHeight: 1.6,

            color: "#36334a",

            py: 0.65,

            "& .MuiInputBase-input": {
              "&::placeholder": {
                color: "#9995a9",
                opacity: 1,
              },
            },
          }}
        />

        {/* ================================= */}
        {/* SEND / STOP BUTTON */}
        {/* ================================= */}

        {loading ? (
          <Tooltip title="Stop assistant" placement="top" arrow>
            <IconButton
              onClick={onStop}
              sx={{
                width: 42,
                height: 42,
                mb: 0.05,

                flexShrink: 0,

                borderRadius: "13px",

                color: "#635bff",

                backgroundColor: "#f0edff",

                border: "1px solid rgba(99,91,255,0.12)",

                "&:hover": {
                  backgroundColor: "#e8e3ff",
                },
              }}
            >
              <StopRounded
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={hasText ? "Send message" : "Type a message"} placement="top" arrow>
            <span>
              <IconButton
                onClick={handleSubmit}
                disabled={!hasText}
                sx={{
                  width: 42,
                  height: 42,
                  mb: 0.05,

                  flexShrink: 0,

                  borderRadius: "13px",

                  color: "#fff",

                  background: hasText ? "linear-gradient(135deg, #635bff, #8b5cf6)" : "#e5e2f3",

                  boxShadow: hasText ? "0 7px 18px rgba(99,91,255,0.22)" : "none",

                  transition: "all 0.2s ease",

                  "&:hover": {
                    background: hasText ? "linear-gradient(135deg, #574fff, #7c4df0)" : "#e5e2f3",

                    transform: hasText ? "translateY(-1px)" : "none",

                    boxShadow: hasText ? "0 10px 22px rgba(99,91,255,0.28)" : "none",
                  },

                  "&.Mui-disabled": {
                    color: "#aaa6bb",
                    backgroundColor: "#e5e2f3",
                  },
                }}
              >
                <ArrowUpwardRounded
                  sx={{
                    fontSize: 21,
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
    </Paper>
  );
};

export default AssistantInput;
