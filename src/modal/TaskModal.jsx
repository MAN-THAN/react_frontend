import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
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
    priority: "medium",
    due_date: "",
    category: "",
    estimated_minutes: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // INITIALIZE FORM
  // =====================================================

  useEffect(() => {
    if (isEditMode && task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        due_date: task.due_date
          ? formatDateTimeForInput(task.due_date)
          : "",
        category: task.category || "",
        estimated_minutes:
          task.estimated_minutes ?? "",
        tags: task.tags || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        category: "",
        estimated_minutes: "",
        tags: [],
      });
    }

    setTagInput("");
    setError("");
  }, [open, isEditMode, task]);

  // =====================================================
  // FORMAT DATE FOR DATETIME-LOCAL INPUT
  // =====================================================

  const formatDateTimeForInput = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // HANDLE TAG
  // =====================================================

  const handleAddTag = () => {
    const tag = tagInput.trim();

    if (!tag) {
      return;
    }

    if (formData.tags.includes(tag)) {
      setTagInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (tag) => tag !== tagToDelete
      ),
    }));
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (loading) {
      return;
    }

    setFormData({
      title: "",
      description: "",
      priority: "medium",
      due_date: "",
      category: "",
      estimated_minutes: "",
      tags: [],
    });

    setTagInput("");
    setError("");

    onClose();
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (formData.estimated_minutes) {
      const estimatedMinutes = Number(
        formData.estimated_minutes
      );

      if (
        !Number.isInteger(estimatedMinutes) ||
        estimatedMinutes <= 0
      ) {
        setError(
          "Estimated time must be a positive number."
        );
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      // Convert frontend form data
      // into API payload.
      const payload = {
        title: formData.title.trim(),

        description:
          formData.description.trim() || null,

        priority: formData.priority,

        due_date: formData.due_date
          ? new Date(
              formData.due_date
            ).toISOString()
          : null,

        category:
          formData.category.trim() || null,

        estimated_minutes:
          formData.estimated_minutes
            ? Number(formData.estimated_minutes)
            : null,

        tags:
          formData.tags.length > 0
            ? formData.tags
            : null,
      };

      await onSubmit(payload, task);

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

  // =====================================================
  // UI
  // =====================================================

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
          boxShadow:
            "0 24px 70px rgba(31, 38, 135, 0.18)",
        },
      }}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

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
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
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
                {isEditMode
                  ? "Edit task"
                  : "Create a task"}
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

      {/* ==================================================
          FORM
      ================================================== */}

      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2.5}>

            {/* ERROR */}

            {error && (
              <Box
                sx={{
                  px: 2,
                  py: 1.3,
                  borderRadius: "10px",
                  backgroundColor: "#fff1f0",
                  border:
                    "1px solid #ffc9c5",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#d32f2f",
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            {/* TITLE */}

            <TextField
              fullWidth
              label="Task title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete authentication flow"
              disabled={loading}
              inputProps={{
                maxLength: 100,
              }}
              required
            />

            {/* DESCRIPTION */}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what needs to be done..."
              disabled={loading}
              inputProps={{
                maxLength: 500,
              }}
            />

            {/* PRIORITY + CATEGORY */}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <FormControl
                fullWidth
                disabled={loading}
              >
                <InputLabel>
                  Priority
                </InputLabel>

                <Select
                  name="priority"
                  value={formData.priority}
                  label="Priority"
                  onChange={handleChange}
                >
                  <MenuItem value="low">
                    Low
                  </MenuItem>

                  <MenuItem value="medium">
                    Medium
                  </MenuItem>

                  <MenuItem value="high">
                    High
                  </MenuItem>

                  <MenuItem value="urgent">
                    Urgent
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Work, Learning"
                disabled={loading}
                inputProps={{
                  maxLength: 50,
                }}
              />
            </Stack>

            {/* DUE DATE */}

            <TextField
              fullWidth
              type="datetime-local"
              label="Due date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              disabled={loading}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* ESTIMATED TIME */}

            <TextField
              fullWidth
              type="number"
              label="Estimated time (minutes)"
              name="estimated_minutes"
              value={formData.estimated_minutes}
              onChange={handleChange}
              placeholder="e.g. 60"
              disabled={loading}
              inputProps={{
                min: 1,
              }}
            />

            {/* TAGS */}

            <Box>
              <Stack
                direction="row"
                spacing={1}
              >
                <TextField
                  fullWidth
                  label="Add tag"
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(e.target.value)
                  }
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g. react"
                  disabled={loading}
                />

                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={
                    loading ||
                    !tagInput.trim()
                  }
                  sx={{
                    minWidth: 80,
                    borderRadius: "11px",
                    textTransform: "none",
                  }}
                >
                  Add
                </Button>
              </Stack>

              {formData.tags.length > 0 && (
                <Stack
                  direction="row"
                  spacing={0.7}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 1.2 }}
                >
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      onDelete={() =>
                        handleDeleteTag(tag)
                      }
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </DialogContent>

        {/* ==================================================
            FOOTER
        ================================================== */}

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
              isEditMode ? (
                <EditOutlined />
              ) : (
                <AddTaskOutlined />
              )
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