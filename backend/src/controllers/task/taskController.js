import asyncHandler from 'express-async-handler';
import Task from '../../models/task/taskModel.js';

// create task
export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    if (!title || title.trim() === '') {
      res.status(400).json({ message: 'Title is required' });
    }
    if (!description || description.trim() === '') {
      res.status(400).json({ message: 'Description is required' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task, please try again' });
  }
});

// get tasks
export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      res.status(400).json({ message: 'User not found' });
    }
    const tasks = await Task.find({ user: userId });
    res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log('Error getting tasks', error.message);
    res.status(500).json({ message: 'Error getting tasks, please try again' });
  }
});

// get single task
export const getTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      res.status(400).json({ message: 'Please provide a task id' });
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log('Error getting task', error.message);
    res.status(500).json({ message: 'Error getting task, please try again' });
  }
});

// update task
export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!id) {
      res.status(400).json({ message: 'Please provide a task id' });
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    // update the task
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed || task.completed;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.log('Error updating task', error.message);
    res.status(500).json({ message: 'Error updating task, please try again' });
  }
});

// delete task
export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'Please provide a task id' });
    }

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log('Error deleting task', error.message);
    res.status(500).json({ message: 'Error deleting task, please try again' });
  }
});
