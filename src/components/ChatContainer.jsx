import { Box, Stack } from "@mui/material";

import UserMessage from "./UserMessageCompo";
import AssistantMessage from "./AssistantMessage";

const ChatContainer = () => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 0, sm: 1 },
        pb: 3,

        "&::-webkit-scrollbar": {
          width: 6,
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ddd9f5",
          borderRadius: 10,
        },
      }}
    >
      <Stack spacing={3}>
        <UserMessage
          message="Which tasks should I focus on today?"
        />

        <AssistantMessage />
      </Stack>
    </Box>
  );
};

export default ChatContainer;