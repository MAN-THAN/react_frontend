import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

// import { DeleteOutline } from "@mui/icons-material";

const DeleteTaskDialog = ({
  open,
  task,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 24px 70px rgba(31, 38, 135, 0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          fontWeight: 700,
        }}
      >
        Delete task?
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this task?
          </Typography>

          {task?.title && (
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                wordBreak: "break-word",
              }}
            >
              "{task.title}"
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: "10px",
            px: 2.5,
            textTransform: "none",
            color: "text.secondary",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        //   startIcon={<DeleteOutline />}
          sx={{
            borderRadius: "10px",
            px: 2.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;
