import { axiosInstance } from "../axios/axiosInstance"
const API_BASE_URL = axiosInstance.defaults.baseURL;

/**
 * Streams agent events from the backend.
 *
 * @param {string} message
 * @param {string} token
 * @param {(event: { type: string, data: any }) => void} onEvent
 * @param {AbortSignal} signal
 */
export const streamAgent = async (
  message,
  token,
  onEvent,
  signal
) => {
  const response = await fetch(
    `${API_BASE_URL}/ai/task_assistant`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },

      credentials: "include",

      body: JSON.stringify({
        message,
      }),

      signal,
    }
  );

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage =
        errorData?.detail || errorMessage;
    } catch {
      // Ignore JSON parsing failure
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this browser."
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  try {
    while (true) {
      const { value, done } =
        await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      // Support both \n\n and \r\n\r\n
      const normalizedBuffer =
        buffer.replace(/\r\n/g, "\n");

      const events =
        normalizedBuffer.split("\n\n");

      buffer = events.pop() || "";

      for (const eventBlock of events) {
        if (!eventBlock.trim()) continue;

        const parsedEvent =
          parseSSEEvent(eventBlock);

        if (parsedEvent) {
          onEvent(parsedEvent);
        }
      }
    }

    // Process remaining buffered event
    if (buffer.trim()) {
      const parsedEvent =
        parseSSEEvent(buffer);

      if (parsedEvent) {
        onEvent(parsedEvent);
      }
    }
  } finally {
    reader.releaseLock();
  }
};

const parseSSEEvent = (eventBlock) => {
  let eventType = "message";
  const dataLines = [];

  const lines = eventBlock.split("\n");

  for (const line of lines) {
    if (line.startsWith("event:")) {
      eventType =
        line.slice("event:".length).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(
        line.slice("data:".length).trim()
      );
    }
  }

  if (!dataLines.length) {
    return null;
  }

  const rawData = dataLines.join("\n");

  let data = rawData;

  try {
    data = JSON.parse(rawData);
  } catch {
    // Keep data as plain string
  }

  return {
    type: eventType,
    data,
  };
};
