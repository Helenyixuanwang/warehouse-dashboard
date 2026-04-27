import { useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { tasksAtom, loadingAtom } from '../store/atoms';
import { fetchTasks } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useAtomValue } from 'jotai';
import type { Task } from '../store/atoms';

export default function Dashboard() {
  const setTasks = useSetAtom(tasksAtom);
  const [loading, setLoading] = useAtom(loadingAtom);

  // Poll the backend every 3 seconds for live status updates
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks);
      } finally {
        setLoading(false);
      }
    };

    // Load immediately on mount
    setLoading(true);
    loadTasks();

    // Then keep polling every 3 seconds
    // This is how the status updates from 'queued' → 'processing' → 'completed'
    // appear on screen without needing WebSockets
    const interval = setInterval(loadTasks, 3000);

    // TypeScript concept: cleanup function
    // useEffect can return a function that runs when the component unmounts
    // This clears the interval so it doesn't keep running in the background
    return () => clearInterval(interval);
  }, []); // empty array = run once on mount

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0e1a', py: 4 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}
          >
            🏭 Warehouse Task Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#546e7a', mt: 0.5 }}>
            Real-time task queue powered by BullMQ + Redis
          </Typography>
        </Box>

        {/* Stats Bar */}
        <StatsBar />

        {/* Task Form */}
        <TaskForm />

        {/* Task List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#90caf9' }} />
          </Box>
        ) : (
          <TaskList />
        )}

      </Container>
    </Box>
  );
}

// Small inline component — shows task counts by status
function StatsBar() {
  const tasks = useAtomValue(tasksAtom);

  // TypeScript concept: reduce() builds an object that counts tasks per status
  const counts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<Task['status'], number>,
  );

  const stats = [
    { label: 'Queued',     value: counts.queued     ?? 0, color: '#546e7a' },
    { label: 'Processing', value: counts.processing ?? 0, color: '#ffa726' },
    { label: 'Completed',  value: counts.completed  ?? 0, color: '#66bb6a' },
    { label: 'Failed',     value: counts.failed     ?? 0, color: '#ef5350' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            flex: 1, minWidth: 120,
            backgroundColor: '#1a2035',
            border: `1px solid ${stat.color}44`,
            borderRadius: 2, p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: stat.color, fontWeight: 700 }}>
            {stat.value}
          </Typography>
          <Typography variant="body2" sx={{ color: '#546e7a' }}>
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}