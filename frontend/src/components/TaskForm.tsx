import { useState } from 'react';
import {
  Box, Button, Card, CardContent,
  FormControl, InputLabel, MenuItem,
  Select, TextField, Typography
} from '@mui/material';
import { useSetAtom } from 'jotai';
import { tasksAtom } from '../store/atoms';
import { createTask } from '../services/api';
import type { CreateTaskPayload } from '../services/api';

export default function TaskForm() {
  // useSetAtom: we only need to write to tasksAtom, not read it here
  const setTasks = useSetAtom(tasksAtom);

  // Local form state — TypeScript infers the types automatically
  const [form, setForm] = useState<CreateTaskPayload>({
    type: 'picking',
    robotId: '',
    location: '',
    priority: 'medium',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.robotId || !form.location) return;
    setSubmitting(true);
    try {
      const newTask = await createTask(form);
      // Add the new task to the global atom
      setTasks((prev) => [newTask, ...prev]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 3, backgroundColor: '#1a2035', border: '1px solid #2a3550' }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: '#90caf9', mb: 2 }}>
          ➕ Add New Task
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Task Type */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#90caf9' }}>Type</InputLabel>
            <Select
              value={form.type}
              label="Type"
              onChange={(e) => setForm({ ...form, type: e.target.value as CreateTaskPayload['type'] })}
              sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: '#2a3550' } }}
            >
              <MenuItem value="picking">Picking</MenuItem>
              <MenuItem value="packing">Packing</MenuItem>
              <MenuItem value="shipping">Shipping</MenuItem>
            </Select>
          </FormControl>

          {/* Robot ID */}
          <TextField
            size="small"
            label="Robot ID"
            value={form.robotId}
            onChange={(e) => setForm({ ...form, robotId: e.target.value })}
            sx={{ minWidth: 120, input: { color: 'white' }, label: { color: '#90caf9' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3550' } }}
          />

          {/* Location */}
          <TextField
            size="small"
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            sx={{ minWidth: 120, input: { color: 'white' }, label: { color: '#90caf9' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a3550' } }}
          />

          {/* Priority */}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel sx={{ color: '#90caf9' }}>Priority</InputLabel>
            <Select
              value={form.priority}
              label="Priority"
              onChange={(e) => setForm({ ...form, priority: e.target.value as CreateTaskPayload['priority'] })}
              sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: '#2a3550' } }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          {/* Submit */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !form.robotId || !form.location}
            sx={{ backgroundColor: '#1565c0', '&:hover': { backgroundColor: '#1976d2' } }}
          >
            {submitting ? 'Adding...' : 'Add Task'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}