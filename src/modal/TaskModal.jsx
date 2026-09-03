import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddTaskOutlined,
  Close,
  EditOutlined,
} from "@mui/icons-material";

const TaskModal = ({
  open,
  onClose,
  mode = "create",
  task = null,
  onSubmit,
}) => {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
      });
    }

    setError("");
  }, [open, isEditMode, task]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleClose = () => {
    if (loading) return;

    setFormData({
      title: "",
      description: "",
    });

    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Task description is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSubmit(formData, task);

      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(31, 38, 135, 0.18)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
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
                width: 44,
                height: 44,
                borderRadius: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                color: "#fff",
                boxShadow:
                  "0 8px 20px rgba(99, 91, 255, 0.22)",
              }}
            >
              {isEditMode ? (
                <EditOutlined />
              ) : (
                <AddTaskOutlined />
              )}
            </Box>

            <Stack spacing={0.3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                {isEditMode ? "Edit task" : "Create a task"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {isEditMode
                  ? "Update the task details below."
                  : "Add a new task to your list."}
              </Typography>
            </Stack>
          </Stack>

          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "#f5f3ff",
                color: "#635bff",
              },
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2.5}>
            {error && (
              <Box
                sx={{
                  px: 2,
                  py: 1.3,
                  borderRadius: "10px",
                  backgroundColor: "#fff1f0",
                  border: "1px solid #ffc9c5",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#d32f2f" }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              label="Task title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete authentication flow"
              disabled={loading}
              inputProps={{ maxLength: 150 }}
            />

            <TextField
              fullWidth
              multiline
              rows={5}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what needs to be done..."
              disabled={loading}
              inputProps={{ maxLength: 1000 }}
            />
          </Stack>
        </DialogContent>

        {/* Footer */}
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 0,
            gap: 1,
          }}
        >
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            sx={{
              px: 2.5,
              py: 1.1,
              borderRadius: "11px",
              textTransform: "none",
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={
              isEditMode ? <EditOutlined /> : <AddTaskOutlined />
            }
            sx={{
              px: 2.8,
              py: 1.1,
              borderRadius: "11px",
              textTransform: "none",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
              boxShadow:
                "0 8px 20px rgba(99, 91, 255, 0.2)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #554cf0 0%, #7c4de8 100%)",
              },
            }}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Save changes"
              : "Create task"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TaskModal;

