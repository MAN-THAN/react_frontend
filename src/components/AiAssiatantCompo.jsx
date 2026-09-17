import { Box, Container } from "@mui/material";
import AssistantHeader from "./AssistantHeader";
import ChatContainer from "./ChatContainer";
import AssistantInput from "./AssistantInput";

const AiAssistantCompo = () => {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "linear-gradient(180deg, #faf9ff 0%, #f5f3ff 100%)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 3,
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AssistantHeader />

        <ChatContainer />

        <AssistantInput />
      </Container>
    </Box>
  );
};

export default AiAssistantCompo;