import { Box, Stack, Typography } from "@mui/material";

const UserMessage = ({ message }) => {
  return (
    <Stack
      alignItems="flex-end"
      sx={{
        px: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: "75%",
          px: 2,
          py: 1.4,
          borderRadius: "18px 18px 5px 18px",
          background:
            "linear-gradient(135deg, #635bff, #756dfc)",
          color: "#fff",
          boxShadow:
            "0 7px 20px rgba(99, 91, 255, 0.16)",
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Stack>
  );
};

export default UserMessage;
