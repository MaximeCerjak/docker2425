// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const mongoUser = fs.readFileSync('/run/secrets/mongo_user', 'utf8').trim();
// const mongoPassword = fs.readFileSync('/run/secrets/mongo_password', 'utf8').trim();
// const mongoURL = fs.readFileSync('/run/secrets/mongo_url', 'utf8').trim();

// const app = express();

// console.log('MongoDB User:', mongoUser);
// console.log('MongoDB Password:', mongoPassword);
// console.log('MongoDB URL:', mongoURL);

// mongoURL = mongoURL.replace('mongodb://', `mongodb://${mongoUser}:${mongoPassword}@`);

// app.use(express.json());
// app.use(cors());

// mongoose.connect(mongoURL)
//   .then(() => console.log('Connecté à MongoDB'))
//   .catch(err => console.error('Erreur de connexion à MongoDB :', err));


// app.listen(5000, () => {
//     console.log('Backend en cours d\'exécution sur le port 5000');
// });

// const taskSchema = new mongoose.Schema({
//     title: String,
//     day: String,     
//     completed: {
//       type: Boolean,
//       default: false   
//     }
//   });

// const Task = mongoose.model('Task', taskSchema);

// app.get('/tasks', async (req, res) => {
//   const tasks = await Task.find();
//   res.json(tasks);
// });

// app.post('/tasks', async (req, res) => {
//     const { title, day } = req.body;
//     const newTask = new Task({ title, day });
//     const savedTask = await newTask.save();
//     res.json(savedTask);
// });

// app.put('/tasks/:id', async (req, res) => {
//     const { completed } = req.body;
//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       { completed },
//       { new: true }
//     );
//     res.json(updatedTask);
// });  

// app.delete('/tasks/:id', async (req, res) => {
//   await Task.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Tâche supprimée' });
// });

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const fs = require('fs');

const mysqlUser = fs.readFileSync('/run/secrets/mysql_user', 'utf8').trim();
const mysqlPassword = fs.readFileSync('/run/secrets/mysql_password', 'utf8').trim();
const mysqlHost = process.env.MYSQL_HOST || 'db';
const mysqlDatabase = process.env.MYSQL_DATABASE || 'todos';

const sequelize = new Sequelize(mysqlDatabase, mysqlUser, mysqlPassword, {
  host: mysqlHost,
  dialect: 'mysql',
});

const app = express();

app.use(express.json());
app.use(cors());

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'tasks',
  timestamps: false,
});

sequelize.sync()
  .then(() => console.log('Connecté à MySQL et synchronisé'))
  .catch(err => console.error('Erreur de connexion à MySQL :', err));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { title, day } = req.body;
  const newTask = await Task.create({ title, day });
  res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const { completed } = req.body;
  const updatedTask = await Task.update({ completed }, { where: { id: req.params.id }, returning: true });
  res.json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Tâche supprimée' });
});

app.listen(5000, () => {
  console.log('Backend en cours d\'exécution sur le port 5000');
});
