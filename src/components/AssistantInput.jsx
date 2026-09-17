import {
  ArrowUpwardRounded,
  AutoAwesomeRounded,
} from "@mui/icons-material";

import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Stack,
} from "@mui/material";

const AssistantInput = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        p: 0.8,
        pl: 2,
        borderRadius: 4,
        border: "1px solid rgba(99, 91, 255, 0.14)",
        backgroundColor: "#fff",
        boxShadow:
          "0 8px 30px rgba(70, 60, 150, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center">
        <AutoAwesomeRounded
          sx={{
            fontSize: 19,
            color: "#635bff",
            mr: 1,
          }}
        />

        <InputBase
          fullWidth
          placeholder="Ask your assistant..."
          sx={{
            fontSize: 14,
            color: "#36334a",
          }}
        />

        <IconButton
          sx={{
            width: 42,
            height: 42,
            borderRadius: 3,
            color: "#fff",
            background:
              "linear-gradient(135deg, #635bff, #8b5cf6)",

            "&:hover": {
              background:
                "linear-gradient(135deg, #574fff, #7c4df0)",
            },
          }}
        >
          <ArrowUpwardRounded />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default AssistantInput;