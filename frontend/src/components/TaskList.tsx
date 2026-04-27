import {
  Box, Card, CardContent, Chip,
  Table, TableBody, TableCell,
  TableHead, TableRow, Typography
} from '@mui/material';
import { useAtomValue } from 'jotai';
import { tasksAtom } from '../store/atoms';
import type { Task } from '../store/atoms';

// Color mapping for status chips
const statusColor = (status: Task['status']) => {
  switch (status) {
    case 'queued':     return 'default';
    case 'processing': return 'warning';
    case 'completed':  return 'success';
    case 'failed':     return 'error';
  }
};

// Color mapping for priority chips
const priorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':   return '#ef5350';
    case 'medium': return '#ffa726';
    case 'low':    return '#66bb6a';
  }
};

// Status emoji for a bit of personality
const statusEmoji = (status: Task['status']) => {
  switch (status) {
    case 'queued':     return '⏳';
    case 'processing': return '🤖';
    case 'completed':  return '✅';
    case 'failed':     return '❌';
  }
};

export default function TaskList() {
  // useAtomValue: we only need to READ tasksAtom here, not write to it
  const tasks = useAtomValue(tasksAtom);

  if (tasks.length === 0) {
    return (
      <Card sx={{ backgroundColor: '#1a2035', border: '1px solid #2a3550' }}>
        <CardContent>
          <Typography sx={{ color: '#546e7a', textAlign: 'center', py: 4 }}>
            No tasks yet. Add one above to get started!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ backgroundColor: '#1a2035', border: '1px solid #2a3550' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>
          📋 Task Queue
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              {['Type', 'Robot', 'Location', 'Priority', 'Status', 'Created'].map((col) => (
                <TableCell key={col} sx={{ color: '#546e7a', borderColor: '#2a3550' }}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} sx={{ '&:hover': { backgroundColor: '#1e2d45' } }}>
                <TableCell sx={{ color: 'white', borderColor: '#2a3550', textTransform: 'capitalize' }}>
                  {task.type}
                </TableCell>
                <TableCell sx={{ color: '#90caf9', borderColor: '#2a3550' }}>
                  {task.robotId}
                </TableCell>
                <TableCell sx={{ color: 'white', borderColor: '#2a3550' }}>
                  {task.location}
                </TableCell>
                <TableCell sx={{ borderColor: '#2a3550' }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1, py: 0.25,
                      borderRadius: 1,
                      backgroundColor: priorityColor(task.priority),
                      color: 'white',
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {task.priority}
                  </Box>
                </TableCell>
                <TableCell sx={{ borderColor: '#2a3550' }}>
                  <Chip
                    label={`${statusEmoji(task.status)} ${task.status}`}
                    color={statusColor(task.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell sx={{ color: '#546e7a', borderColor: '#2a3550', fontSize: '0.75rem' }}>
                  {new Date(task.createdAt).toLocaleTimeString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}