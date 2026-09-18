import { AutoAwesomeRounded } from "@mui/icons-material";

import { Box, Stack, Typography } from "@mui/material";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const FinalResponse = ({ content, streaming = false }) => {
  if (!content?.trim() && !streaming) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 2.2,
        py: 1.9,
        borderRadius: "18px",

        background: "linear-gradient(135deg, #ffffff 0%, #fcfbff 100%)",

        border: "1px solid rgba(99, 91, 255, 0.08)",

        boxShadow: "0 6px 20px rgba(50, 40, 120, 0.05)",
      }}
    >
      {/* Response header */}

      <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 1.4 }}>
        <AutoAwesomeRounded
          sx={{
            fontSize: 15,
            color: "#635bff",
          }}
        />

        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            color: "#817c96",
          }}
        >
          AI Response
        </Typography>
      </Stack>

      {/* Markdown response */}

      <Box
        sx={{
          color: "#403d52",
          fontSize: 14,
          lineHeight: 1.75,

          "& p": {
            margin: "0 0 12px",
          },

          "& p:last-child": {
            marginBottom: 0,
          },

          /* Headings */

          "& h1, & h2, & h3": {
            color: "#29263d",
            fontWeight: 750,
            marginTop: "18px",
            marginBottom: "8px",
            lineHeight: 1.35,
          },

          "& h1": {
            fontSize: "20px",
          },

          "& h2": {
            fontSize: "17px",
          },

          "& h3": {
            fontSize: "15px",
          },

          /* Bold */

          "& strong": {
            color: "#2f2b46",
            fontWeight: 700,
          },

          /* Lists */

          "& ul, & ol": {
            marginTop: "7px",
            marginBottom: "12px",
            paddingLeft: "24px",
          },

          "& li": {
            marginBottom: "7px",
            paddingLeft: "3px",
          },

          "& li::marker": {
            color: "#635bff",
            fontWeight: 700,
          },

          /* Links */

          "& a": {
            color: "#635bff",
            fontWeight: 600,
            textDecoration: "none",
          },

          "& a:hover": {
            textDecoration: "underline",
          },

          /* Inline code */

          "& code": {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "0.85em",
            backgroundColor: "#f1efff",
            color: "#5b50d6",
            padding: "2px 6px",
            borderRadius: "6px",
          },

          /* Code block */

          "& pre": {
            margin: "12px 0",
            padding: "14px 16px",
            borderRadius: "12px",
            backgroundColor: "#24213a",
            overflowX: "auto",
          },

          "& pre code": {
            padding: 0,
            backgroundColor: "transparent",
            color: "#f5f3ff",
            fontSize: "12.5px",
            lineHeight: 1.6,
          },

          /* Blockquote */

          "& blockquote": {
            margin: "12px 0",
            padding: "8px 14px",
            borderLeft: "3px solid #635bff",
            backgroundColor: "#f7f5ff",
            borderRadius: "0 8px 8px 0",
            color: "#6f6b82",
          },

          /* Horizontal line */

          "& hr": {
            border: 0,
            borderTop: "1px solid rgba(99, 91, 255, 0.10)",
            margin: "16px 0",
          },

          /* Tables */

          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            margin: "12px 0",
            fontSize: "13px",
          },

          "& th": {
            textAlign: "left",
            backgroundColor: "#f3f1ff",
            color: "#403d52",
            fontWeight: 700,
            padding: "9px 10px",
            borderBottom: "1px solid #e5e1fa",
          },

          "& td": {
            padding: "9px 10px",
            borderBottom: "1px solid #eeeaf8",
          },
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>

        {/* Streaming cursor */}

        {streaming && (
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: "2px",
              height: "16px",
              ml: "3px",
              verticalAlign: "middle",
              backgroundColor: "#635bff",

              animation: "blinkCursor 0.9s infinite",

              "@keyframes blinkCursor": {
                "0%, 45%": {
                  opacity: 1,
                },

                "46%, 100%": {
                  opacity: 0,
                },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default FinalResponse;
