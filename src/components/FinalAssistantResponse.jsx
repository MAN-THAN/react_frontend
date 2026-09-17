import { Box, Typography } from "@mui/material";

const FinalResponse = () => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.8,
        borderRadius: 3,
        backgroundColor: "#fff",
        border: "1px solid rgba(99, 91, 255, 0.08)",
        boxShadow:
          "0 6px 20px rgba(50, 40, 120, 0.05)",
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          lineHeight: 1.75,
          color: "#403d52",
        }}
      >
        You should focus on these 3 tasks today:
      </Typography>

      <Box
        component="ol"
        sx={{
          mt: 1,
          mb: 0,
          pl: 2.5,
          color: "#403d52",

          "& li": {
            mb: 0.6,
            fontSize: 13.5,
          },

          "& li:last-child": {
            mb: 0,
          },
        }}
      >
        <li>Prepare for your React interview</li>
        <li>Finish the AI agent implementation</li>
        <li>Deploy the FastAPI backend</li>
      </Box>
    </Box>
  );
};

export default FinalResponse;