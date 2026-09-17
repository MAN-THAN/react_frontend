import { AutoAwesomeRounded } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

import AgentActivity from "./AgentActivity";
import FinalResponse from "./FinalAssistantResponse";

const AssistantMessage = () => {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #635bff, #8b5cf6)",
          boxShadow:
            "0 6px 16px rgba(99, 91, 255, 0.18)",
        }}
      >
        <AutoAwesomeRounded
          sx={{
            color: "#fff",
            fontSize: 18,
          }}
        />
      </Box>

      <Stack spacing={1.5} sx={{ maxWidth: 720, width: "100%" }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#817c96",
          }}
        >
          AI Assistant
        </Typography>

        <AgentActivity />

        <FinalResponse />
      </Stack>
    </Stack>
  );
};

export default AssistantMessage;