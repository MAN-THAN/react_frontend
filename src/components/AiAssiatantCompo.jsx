import { useContext, useEffect, useRef, useState } from "react";

import { Box, Container, Stack } from "@mui/material";

import { AuthContext } from "../context/authContext";

import AssistantHeader from "./AssistantHeader";
import UserMessage from "./UserMessageCompo";
import AssistantMessage from "./AssistantMessage";
import AssistantInput from "./AssistantInput";

import { streamAgent } from "../services/agentService";

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
};

const AiAssistantCompo = () => {
  const { token } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);
  const bottomRef = useRef(null);

  // -----------------------------------------
  // Scroll to latest activity / response
  // -----------------------------------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // -----------------------------------------
  // Update assistant message
  // -----------------------------------------

  const updateAssistantMessage = (messageId, updater) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        return updater(message);
      }),
    );
  };

  // -----------------------------------------
  // Handle backend SSE events
  // -----------------------------------------

  const handleAgentEvent = (assistantMessageId, event) => {
    const { type, data } = event;

    switch (type) {
      // ======================================
      // 1. AI ASSISTANT STARTED
      // ======================================

      case "start": {
        updateAssistantMessage(assistantMessageId, (message) => ({
          ...message,
          status: "running",

          activities: [
            ...message.activities,

            {
              id: createId(),
              type: "agent",
              status: "completed",
              title: data?.message || "AI assistant started",
              subtitle: "Getting ready...",
            },
          ],
        }));

        break;
      }

      // ======================================
      // 2. AGENT STARTED
      // ======================================

      case "agent_started": {
        updateAssistantMessage(assistantMessageId, (message) => ({
          ...message,
          status: "running",

          activities: [
            ...message.activities,

            {
              id: createId(),
              type: "agent",
              status: "completed",
              title: "Task agent started",
              subtitle: data?.message || "Processing your request...",
            },
          ],
        }));

        break;
      }

      // ======================================
      // 3. TOOL CALL
      // ======================================
      //
      // Example backend:
      //
      // event: tool_call
      // data: {
      //   "name":"get_tasks_tool",
      //   "args":{
      //      "status":"active",
      //      "sort":"due_soon"
      //   }
      // }
      //
      // We don't need to create another UI
      // activity here because tool_activity
      // will tell us when the tool actually starts.
      //
      // We keep it available for debugging / metadata.
      // ======================================

      case "tool_call": {
        console.log("Agent tool call:", data?.name, data?.args);

        break;
      }

      // ======================================
      // 4. TOOL ACTIVITY
      // ======================================
      //
      // This event is used to render:
      //
      // ◌ Fetching your tasks...
      //
      // and then:
      //
      // ✓ Fetching your tasks
      //   Found 4 tasks.
      //
      // ======================================

      case "tool_activity": {
        const activityEvent = data?.event;
        const toolName = data?.tool;

        // -----------------------------
        // TOOL STARTED
        // -----------------------------

        if (activityEvent === "tool_started") {
          updateAssistantMessage(assistantMessageId, (message) => ({
            ...message,

            activities: [
              ...message.activities,

              {
                id: createId(),
                type: "tool",
                tool: toolName,
                status: "running",

                title: getToolLabel(toolName),

                subtitle: data?.message || "Working...",
              },
            ],
          }));
        }

        // -----------------------------
        // TOOL COMPLETED
        // -----------------------------

        if (activityEvent === "tool_completed") {
          updateAssistantMessage(assistantMessageId, (message) => {
            const activities = [...message.activities];

            // Find latest running activity
            // for this specific tool.
            for (let i = activities.length - 1; i >= 0; i--) {
              const activity = activities[i];

              if (activity.type === "tool" && activity.tool === toolName && activity.status === "running") {
                activities[i] = {
                  ...activity,
                  status: "completed",

                  subtitle: data?.message || "Completed",
                };

                break;
              }
            }

            return {
              ...message,
              activities,
            };
          });
        }

        break;
      }

      // ======================================
      // 5. TOOL RESULT
      // ======================================
      //
      // Example:
      //
      // event: tool_result
      // data: {
      //   "name":"get_tasks_tool",
      //   "content":"..."
      // }
      //
      // We intentionally DON'T render raw
      // tool_result to the user.
      //
      // The agent uses it internally to generate
      // the final response.
      // ======================================

      case "tool_result": {
        console.log("Tool result:", data);

        break;
      }

      // ======================================
      // 6. STREAMING TOKENS
      // ======================================
      //
      // Backend:
      //
      // event: token
      // data: {"content":"You have"}
      //
      // event: token
      // data: {"content":" 2 overdue"}
      //
      // event: token
      // data: {"content":" tasks."}
      //
      // We append each token to the response.
      // ======================================

      case "token": {
        updateAssistantMessage(assistantMessageId, (message) => ({
          ...message,

          content: message.content + (data?.content || ""),
        }));

        break;
      }

      // ======================================
      // 7. AGENT DONE
      // ======================================
      //
      // Backend:
      //
      // event: done
      // data: {
      //   "message":"AI assistant finished."
      // }
      // ======================================

      case "done": {
        updateAssistantMessage(assistantMessageId, (message) => ({
          ...message,

          status: "completed",

          activities: [
            ...message.activities,

            {
              id: createId(),
              type: "agent",
              status: "completed",
              title: "Agent completed",
              subtitle: data?.message || "Response ready",
            },
          ],
        }));

        break;
      }

      // ======================================
      // 8. ERROR
      // ======================================

      case "error": {
        const errorMessage = data?.message || "Something went wrong.";

        updateAssistantMessage(assistantMessageId, (message) => ({
          ...message,

          status: "error",

          error: errorMessage,
        }));

        setError(errorMessage);

        break;
      }

      // ======================================
      // UNKNOWN EVENT
      // ======================================

      default: {
        console.log("Unknown agent event:", event);
      }
    }
  };

  // -----------------------------------------
  // Send message
  // -----------------------------------------

  const handleSendMessage = async (input) => {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setError("");

    // User message
    const userMessage = {
      id: createId(),
      role: "user",
      content: message,
    };

    // Placeholder assistant message
    const assistantMessage = {
      id: createId(),
      role: "assistant",

      status: "starting",

      activities: [],

      content: "",

      error: null,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    setLoading(true);

    // Create AbortController
    abortControllerRef.current = new AbortController();

    try {
      await streamAgent(
        message,
        token,

        // SSE callback
        (event) => {
          handleAgentEvent(assistantMessage.id, event);
        },

        // Abort signal
        abortControllerRef.current.signal,
      );
    } catch (err) {
      // User stopped generation
      if (err?.name === "AbortError") {
        return;
      }

      console.error("AI Agent error:", err);

      const errorMessage = err?.message || "Unable to process your request.";

      updateAssistantMessage(assistantMessage.id, (message) => ({
        ...message,

        status: "error",

        error: errorMessage,
      }));

      setError(errorMessage);
    } finally {
      setLoading(false);

      abortControllerRef.current = null;
    }
  };

  // -----------------------------------------
  // Stop agent
  // -----------------------------------------

  const handleStop = () => {
    abortControllerRef.current?.abort();

    setLoading(false);
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 72px)",

        background: "linear-gradient(180deg, #faf9ff 0%, #f5f3ff 100%)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: "calc(100dvh - 72px)",

          py: 3,

          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}

        <AssistantHeader />

        {/* -------------------------------- */}
        {/* CHAT */}
        {/* -------------------------------- */}

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",

            px: {
              xs: 0,
              sm: 1,
            },

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
            {messages.map((message) => {
              if (message.role === "user") {
                return <UserMessage key={message.id} message={message.content} />;
              }

              return <AssistantMessage key={message.id} message={message} />;
            })}

            <Box ref={bottomRef} />
          </Stack>
        </Box>

        {/* -------------------------------- */}
        {/* ERROR */}
        {/* -------------------------------- */}

        {error && (
          <Box
            sx={{
              mb: 1,
              px: 2,
              py: 1.2,

              borderRadius: 2,

              backgroundColor: "#fff4f3",

              color: "#c62828",

              fontSize: 13,
            }}
          >
            {error}
          </Box>
        )}

        {/* -------------------------------- */}
        {/* INPUT */}
        {/* -------------------------------- */}

        <AssistantInput onSend={handleSendMessage} loading={loading} onStop={handleStop} />
      </Container>
    </Box>
  );
};

// -----------------------------------------
// Human-friendly tool names
// -----------------------------------------

const getToolLabel = (tool) => {
  switch (tool) {
    case "get_tasks":
      return "Fetching your tasks";

    case "get_tasks_tool":
      return "Fetching your tasks";

    case "create_task":
      return "Creating your task";

    case "create_task_tool":
      return "Creating your task";

    case "update_task":
      return "Updating your task";

    case "update_task_tool":
      return "Updating your task";

    case "delete_task":
      return "Deleting your task";

    case "delete_task_tool":
      return "Deleting your task";

    case "get_task":
      return "Looking up your task";

    case "get_task_tool":
      return "Looking up your task";

    default:
      return "Working on your request";
  }
};

export default AiAssistantCompo;
