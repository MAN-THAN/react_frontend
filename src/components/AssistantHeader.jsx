import {
  AutoAwesomeRounded,
  Circle,
  SmartToyRounded,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";

const AssistantHeader = () => {
  return (
    <Box
      sx={{
        mb: 3,
        pb: 2,
        borderBottom: "1px solid rgba(99, 91, 255, 0.10)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #635bff, #8b5cf6)",
              boxShadow:
                "0 8px 22px rgba(99, 91, 255, 0.22)",
            }}
          >
            <SmartToyRounded
              sx={{
                color: "#fff",
                fontSize: 25,
              }}
            />
          </Box>

          <Box>
            <Stack direction="row" spacing={0.6} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 750,
                  fontSize: 18,
                  color: "#25233a",
                }}
              >
                AI Task Assistant
              </Typography>

              <AutoAwesomeRounded
                sx={{
                  fontSize: 17,
                  color: "#635bff",
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontSize: 12.5,
                color: "#858198",
                mt: 0.2,
              }}
            >
              Your intelligent task companion
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.7} alignItems="center">
          <Circle
            sx={{
              fontSize: 9,
              color: "#22c55e",
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              color: "#6f6b82",
              fontWeight: 600,
            }}
          >
            Online
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AssistantHeader;
