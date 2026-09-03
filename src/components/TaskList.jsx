import { Box, Button, Card, CardContent, Container, Divider, FormControl, IconButton, InputAdornment, InputLabel, Menu, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

import { Add, AssignmentOutlined, CalendarTodayOutlined, EditOutlined, FilterListOutlined, MoreVert, Search, SortOutlined } from "@mui/icons-material";

import { useCallback, useEffect, useRef, useState } from "react";

import { createTask, getTasksList, updateTask, deleteTask as delTask, updateTaskStatus } from "../services/taskService";

import TaskModal from "../modal/TaskModal";
import DeleteTaskDialog from "../modal/DeleteTaskDialog";

const TaskList = () => {

  const [taskList, setTaskList] = useState([]);
  // =====================================================
  // SEARCH / FILTER / SORT
  // =====================================================

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // =====================================================
  // PAGINATION
  // =====================================================

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const observerRef = useRef(null);

  // =====================================================
  // ADD / EDIT MODAL
  // =====================================================

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);

  // =====================================================
  // THREE DOT MENU
  // =====================================================

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuTask, setMenuTask] = useState(null);

  // =====================================================
  // DELETE DIALOG
  // =====================================================

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const menuOpen = Boolean(menuAnchor);

  // =====================================================
  // LOAD TASKS
  // =====================================================

  const loadTasks = useCallback(
    async ({ pageNumber = 1, reset = false } = {}) => {
      if (loadingRef.current) {
        return;
      }

      if (!hasMore && !reset) {
        return;
      }

      try {
        loadingRef.current = true;
        setLoading(true);

        const res = await getTasksList({
          page: pageNumber,
          limit: 10,
          search,
          status: statusFilter,
          sort: sortOrder,
        });

        const incomingTasks = res.task_list || [];

        setTaskList((prev) => {
          if (reset) {
            return incomingTasks;
          }

          return [...prev, ...incomingTasks];
        });

        setPage(pageNumber);
        // Fallback: if exactly 10 came back,
        // assume another page may exist.
        setHasMore(res.has_more ?? incomingTasks.length === 10);
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [search, statusFilter, sortOrder, hasMore]
  );

  // =====================================================
  // DEBOUNCE SEARCH
  // =====================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  // =====================================================
  // INITIAL LOAD / SEARCH / FILTER / SORT
  // =====================================================

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    loadTasks({
      pageNumber: 1,
      reset: true,
    });
  }, [search, statusFilter, sortOrder]);

  // =====================================================
  // INTERSECTION OBSERVER
  // =====================================================

  const lastTaskRef = useCallback(
    (node) => {
      if (loadingRef.current) {
        return;
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];

          if (firstEntry.isIntersecting && hasMore && !loadingRef.current) {
            loadTasks({
              pageNumber: page + 1,
              reset: false,
            });
          }
        },
        {
          root: null,

          // Start loading before user reaches
          // the actual bottom of the page.
          rootMargin: "300px",

          threshold: 0,
        }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [page, hasMore, loadTasks]
  );

  // =====================================================
  // CLEANUP OBSERVER
  // =====================================================

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // =====================================================
  // ADD TASK
  // =====================================================

  const handleAddTask = () => {
    setSelectedTask(null);
    setTaskModalMode("create");
    setTaskModalOpen(true);
  };

  // =====================================================
  // THREE DOT MENU
  // =====================================================

  const handleMenuOpen = (event, task) => {
    setMenuAnchor(event.currentTarget);
    setMenuTask(task);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // =====================================================
  // EDIT TASK
  // =====================================================

  const handleEditClick = () => {
    setSelectedTask(menuTask);
    setTaskModalMode("edit");
    setTaskModalOpen(true);

    handleMenuClose();
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDeleteClick = () => {
    setDeleteTask(menuTask);
    setDeleteDialogOpen(true);

    handleMenuClose();
  };

  // =====================================================
  // CREATE / UPDATE TASK
  // =====================================================

  const handleTaskSubmit = async (formData, task) => {
    try {
      if (taskModalMode === "create") {
        await createTask(formData);
      } else {
        await updateTask(task.id, formData);
      }

      setTaskModalOpen(false);

      // Reload from page 1 because the dataset
      // may have changed.
      setPage(1);
      setHasMore(true);

      await loadTasks({
        pageNumber: 1,
        reset: true,
      });
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  // =====================================================
  // DELETE TASK
  // =====================================================

  const handleDeleteConfirm = async () => {
    if (!deleteTask) {
      return;
    }

    try {
      setDeleteLoading(true);

      await delTask(deleteTask.id);

      setDeleteDialogOpen(false);
      setDeleteTask(null);

      setPage(1);
      setHasMore(true);

      await loadTasks({
        pageNumber: 1,
        reset: true,
      });
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.detail || "Unable to delete task.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================================
  // UPDATE TASK STATUS
  // =====================================================

  const handleTaskStatus = async (taskId) => {
    try {
      const res = await updateTaskStatus(taskId);

      const updatedTaskList = taskList.map((task) => (task.id !== taskId ? task : res.task));

      setTaskList(updatedTaskList);
    } catch (err) {
      console.error(err);

      alert("Something went wrong.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f9fc 0%, #eef2ff 50%, #f8f7ff 100%)",
        py: 5,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          {/* ==================================================
              HEADER
          ================================================== */}

          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "minmax(0, 1fr) auto",
              },
              columnGap: 3,
              rowGap: 2,
              alignItems: "center",
            }}
          >
            {/* LEFT */}
            <Stack spacing={0.7} sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(99, 91, 255, 0.22)",
                    flexShrink: 0,
                  }}
                >
                  <AssignmentOutlined />
                </Box>

                {/* <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.6px",
                  }}
                >
                  My Tasks
                </Typography> */}
              </Stack>

              {/* <Typography variant="body2" color="text.secondary">
                Keep track of everything you need to get done.
              </Typography> */}
            </Stack>

            {/* RIGHT CONTROLS */}
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.2}
              alignItems={{
                xs: "stretch",
                sm: "center",
              }}
              justifyContent="flex-end"
            >
              {/* SEARCH */}
              <TextField
                size="small"
                placeholder="Search tasks..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                  width: {
                    xs: "100%",
                    sm: 210,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "11px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search
                          sx={{
                            color: "#635bff",
                            fontSize: 20,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* STATUS FILTER */}
              <FormControl
                size="small"
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: 135,
                  },
                }}
              >
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                  startAdornment={
                    <FilterListOutlined
                      sx={{
                        mr: 0.5,
                        color: "#635bff",
                        fontSize: 19,
                      }}
                    />
                  }
                  sx={{
                    borderRadius: "11px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                  }}
                >
                  <MenuItem value="all">All tasks</MenuItem>

                  <MenuItem value="active">Active</MenuItem>

                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

              {/* SORT */}
              <FormControl
                size="small"
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: 150,
                  },
                }}
              >
                <InputLabel>Sort by</InputLabel>

                <Select
                  value={sortOrder}
                  label="Sort by"
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                  }}
                  startAdornment={
                    <SortOutlined
                      sx={{
                        mr: 0.5,
                        color: "#635bff",
                        fontSize: 19,
                      }}
                    />
                  }
                  sx={{
                    borderRadius: "11px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                  }}
                >
                  <MenuItem value="newest">Newest first</MenuItem>

                  <MenuItem value="oldest">Oldest first</MenuItem>
                </Select>
              </FormControl>

              {/* ADD TASK */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddTask}
                sx={{
                  minWidth: 125,
                  px: 2.4,
                  py: 1.05,
                  borderRadius: "11px",
                  textTransform: "none",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                  boxShadow: "0 10px 24px rgba(99, 91, 255, 0.22)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #554cf0 0%, #7c4de8 100%)",
                  },
                }}
              >
                Add task
              </Button>
            </Stack>
          </Box>

          {/* ==================================================
              STATS
          ================================================== */}

          <Card
            elevation={0}
            sx={{
              borderRadius: "18px",
              border: "1px solid rgba(0,0,0,0.07)",
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 12px 40px rgba(31, 38, 135, 0.06)",
            }}
          >
            <CardContent
              sx={{
                px: 3,
                py: 2.5,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks 
                  </Typography>

                  <Typography variant="h5" fontWeight={700}>
                    {taskList.length}
                  </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {hasMore ? " (Scroll to load more)" : " (All tasks loaded)"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* ==================================================
              SECTION HEADER
          ================================================== */}

          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              Your tasks
            </Typography>
{/* 
            <Typography variant="body2" color="text.secondary">
              Search, filter, and manage your tasks.
            </Typography> */}
          </Stack>

          {/* ==================================================
              TASK LIST
          ================================================== */}

          <Stack spacing={2}>
            {taskList.length === 0 && !loading ? (
              <Card
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.07)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                }}
              >
                <CardContent sx={{ py: 6 }}>
                  <Stack spacing={1.5} alignItems="center" textAlign="center">
                    <Search
                      sx={{
                        fontSize: 44,
                        color: "#a5a5b5",
                      }}
                    />

                    <Typography variant="h6" fontWeight={600}>
                      No matching tasks
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Try changing your search or filters.
                    </Typography>

                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchInput("");
                        setStatusFilter("all");
                      }}
                      sx={{
                        mt: 1,
                        borderRadius: "10px",
                        textTransform: "none",
                        borderColor: "#635bff",
                        color: "#635bff",
                      }}
                    >
                      Reset filters
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              taskList.map((task, index) => {
                const isLastTask = index === taskList.length - 1;

                return (
                  <Card
                    key={task.id}
                    ref={isLastTask ? lastTaskRef : null}
                    elevation={0}
                    sx={{
                      borderRadius: "20px",
                      border: "1px solid rgba(0,0,0,0.07)",
                      backgroundColor: "rgba(255,255,255,0.92)",
                      boxShadow: "0 10px 35px rgba(31, 38, 135, 0.05)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 40px rgba(31, 38, 135, 0.09)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        {/* TASK HEADER */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                            sx={{
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "11px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0edff",
                                color: "#635bff",
                                flexShrink: 0,
                              }}
                            >
                              <AssignmentOutlined fontSize="small" />
                            </Box>

                            <Stack
                              spacing={0.5}
                              sx={{
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight={650}
                                sx={{
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {task.title}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  lineHeight: 1.6,
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {task.description}
                              </Typography>
                            </Stack>
                          </Stack>

                          {/* THREE DOTS */}
                          <IconButton
                            size="small"
                            onClick={(event) => handleMenuOpen(event, task)}
                            sx={{
                              width: 40,
                              height: 40,
                              flexShrink: 0,
                              borderRadius: "10px",
                              color: "text.secondary",
                              "&:hover": {
                                backgroundColor: "#f0edff",
                                color: "#635bff",
                              },
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Stack>

                        <Divider />

                        {/* FOOTER */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            width: "100%",
                            gap: 2,
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.8}
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <CalendarTodayOutlined
                              sx={{
                                fontSize: 16,
                                color: "text.secondary",
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              {new Date(task.created_at).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </Typography>
                          </Stack>

                          {task?.is_completed ? (
                            <Button
                              size="small"
                              onClick={() => handleTaskStatus(task.id)}
                              sx={{
                                px: 1.8,
                                py: 0.75,
                                minWidth: 105,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                color: "#238b55",
                                backgroundColor: "#eefbf3",
                                border: "1px solid #d5f1df",
                                "&:hover": {
                                  backgroundColor: "#e4f8ed",
                                },
                              }}
                            >
                              Completed
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleTaskStatus(task.id)}
                              sx={{
                                px: 1.8,
                                py: 0.75,
                                minWidth: 135,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #635bff 0%, #8b5cf6 100%)",
                                boxShadow: "0 6px 16px rgba(99, 91, 255, 0.20)",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #554cf0 0%, #7c4de8 100%)",
                                },
                              }}
                            >
                              Mark as completed
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })
            )}

            {/* ==================================================
                LOADING INDICATOR
            ================================================== */}

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Loading more tasks...
                </Typography>
              </Box>
            )}

            {/* ==================================================
                END OF LIST
            ================================================== */}

            {!hasMore && taskList.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  You've reached the end.
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </Container>

      {/* ======================================================
          TASK ACTION MENU
      ====================================================== */}

      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 0.8,
              minWidth: 150,
              borderRadius: "13px",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 12px 35px rgba(31, 38, 135, 0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{
            gap: 1.5,
            py: 1.2,
            fontSize: "0.9rem",
            "&:hover": {
              backgroundColor: "#f3f1ff",
            },
          }}
        >
          <EditOutlined
            sx={{
              fontSize: 19,
              color: "#635bff",
            }}
          />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            gap: 1.5,
            py: 1.2,
            fontSize: "0.9rem",
            color: "#d32f2f",
            "&:hover": {
              backgroundColor: "#fff4f3",
            },
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      <TaskModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setSelectedTask(null);
        }}
        mode={taskModalMode}
        task={selectedTask}
        onSubmit={handleTaskSubmit}
      />

      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <DeleteTaskDialog
        open={deleteDialogOpen}
        task={deleteTask}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTask(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default TaskList;
