import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Checkbox,
  Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [selectedDay, setSelectedDay] = useState('Lundi');

  // Récupérer les tâches depuis le back-end
  useEffect(() => {
    axios.get('http://backend:5000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ajouter une tâche
  const addTask = () => {
    if (input.trim() === '') return;
    axios.post('http://backend:5000/tasks', { title: input, day: selectedDay })
      .then(res => setTasks([...tasks, res.data]))
      .catch(err => console.error(err));
    setInput('');
  };

  // Mettre à jour le statut de la tâche
  const toggleTask = (id, completed) => {
    axios.put(`http://backend:5000/tasks/${id}`, { completed: !completed })
      .then(res => {
        setTasks(tasks.map(task => task._id === id ? res.data : task));
      })
      .catch(err => console.error(err));
  };

  // Jours de la semaine
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            To-do List
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              label="Nouvelle tâche"
              variant="outlined"
              value={input}
              onChange={e => setInput(e.target.value)}
              fullWidth
            />
            <FormControl variant="outlined" sx={{ ml: 2, minWidth: 120 }}>
              <InputLabel id="day-select-label">Jour</InputLabel>
              <Select
                labelId="day-select-label"
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
                label="Jour"
              >
                {daysOfWeek.map(day => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={addTask}
              sx={{ ml: 2 }}
            >
              Ajouter
            </Button>
          </Box>
        </Paper>
        <Grid container spacing={2}>
          {daysOfWeek.map(day => (
            <Grid item xs={12} sm={6} md={4} key={day}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {day}
                </Typography>
                <List>
                  {tasks
                    .filter(task => task.day === day)
                    .map(task => (
                      <ListItem key={task._id}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => toggleTask(task._id, task.completed)}
                        />
                        <ListItemText
                          primary={task.title}
                          style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default App;
