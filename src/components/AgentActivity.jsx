import {
  AutoAwesomeRounded,
  CheckCircleRounded,
  PsychologyRounded,
} from "@mui/icons-material";

import { Box, Stack, Typography } from "@mui/material";

const AgentActivity = () => {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(99, 91, 255, 0.10)",
        background:
          "linear-gradient(135deg, #faf9ff, #f5f3ff)",
        px: 2,
        py: 1.8,
      }}
    >
      <Stack spacing={1.5}>
        {/* Header */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <AutoAwesomeRounded
            sx={{
              fontSize: 17,
              color: "#635bff",
            }}
          />

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#37334f",
            }}
          >
            Agent activity
          </Typography>
        </Stack>

        {/* Agent started */}

        <ActivityStep
          type="completed"
          icon={<PsychologyRounded />}
          title="Agent started"
          subtitle="Understanding your request"
        />

        {/* Tool */}

        <ActivityStep
          type="completed"
          icon={<CheckCircleRounded />}
          title="Checking your tasks"
          subtitle="Found 8 tasks"
        />

        {/* Tool */}

        <ActivityStep
          type="completed"
          icon={<CheckCircleRounded />}
          title="Checking overdue tasks"
          subtitle="Found 2 overdue tasks"
        />

        {/* Current step */}

        <ActivityStep
          type="running"
          title="Analyzing priorities..."
        />

        {/* Finished */}

        <ActivityStep
          type="completed"
          icon={<CheckCircleRounded />}
          title="Agent completed"
          subtitle="Response ready"
        />
      </Stack>
    </Box>
  );
};

const ActivityStep = ({
  type,
  icon,
  title,
  subtitle,
}) => {
  const isRunning = type === "running";

  return (
    <Stack
      direction="row"
      spacing={1.2}
      alignItems="flex-start"
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          mt: 0.1,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isRunning
            ? "#ebe8ff"
            : "#e9f8ef",
        }}
      >
        {isRunning ? (
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#635bff",
              animation: "pulse 1.4s infinite",
              "@keyframes pulse": {
                "0%": {
                  opacity: 0.3,
                },
                "50%": {
                  opacity: 1,
                },
                "100%": {
                  opacity: 0.3,
                },
              },
            }}
          />
        ) : (
          icon && (
            <Box
              sx={{
                display: "flex",
                color: "#22a05a",
                "& svg": {
                  fontSize: 15,
                },
              }}
            >
              {icon}
            </Box>
          )
        )}
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            color: "#454158",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              fontSize: 11.5,
              color: "#8a8699",
              mt: 0.2,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default AgentActivity;
