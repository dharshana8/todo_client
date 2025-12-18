import React from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import "./css/TodoList.css"
import axios from 'axios';
import { useState, useEffect } from 'react';

const TodoList = () => {
  const [todo, setTodo] = useState('');
  const [status, setStatus] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [todoArray, setTodoArray] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTodo, setEditTodo] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // create post
  const postTodo = async () => {
    if (!todo.trim()) {
      setError('Please enter a todo');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:5000/csbs/addtodo", { todo: todo.trim() });
      setTodo('');
      setStatus(true);
      getTodo();
      setTimeout(() => setStatus(false), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add todo. Server may be down.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  }
  // read get
  const getTodo = async () => {
    setFetchLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/csbs/gettodo');
      setTodoArray(response.data || []);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError('Server is not running. Start your backend server on port 5000.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch todos.');
      }
      setTodoArray([]);
    } finally {
      setFetchLoading(false);
    }
  }

  // start editing a todo
  const handleEdit = (id, currentTodo) => {
    setEditId(id);
    setEditTodo(currentTodo);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTodo('');
  };

  // update todo
  const handleUpdate = async () => {
    if (!editTodo.trim()) {
      setError('Todo cannot be empty');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setUpdateLoading(true);
    setError('');
    try {
      await axios.put(`http://localhost:5000/csbs/updatetodo/${editId}`, { todo: editTodo.trim() });
      setStatus(true);
      cancelEdit();
      getTodo();
      setTimeout(() => setStatus(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdateLoading(false);
    }
  };

  // delete todo
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmed) return;
    setDeleteLoadingId(id);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/csbs/deletetodo/${id}`);
      setStatus(true);
      getTodo();
      setTimeout(() => setStatus(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleteLoadingId(null);
    }
  };

 
  useEffect(() => {
    getTodo();
  }, []);
  return (
    <div className='todolist'>
      <Typography variant="h1" gutterBottom>Todo List</Typography>
      <Box sx={{ width: 500, maxWidth: '100%' }} className='box'>
        <TextField fullWidth label="Add Todo" id="fullWidth" value={todo} onChange={(e) => setTodo(e.target.value)} />
        <Button
          variant="contained"
          color="button"
          className='button'
          onClick={postTodo}
          disabled={loading || !todo.trim()}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Add'}
        </Button>
      </Box>
      {/* Success Alert */}
      {
        status && (
          <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "9999",
          }}>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
              Todo has been Posted
            </Alert>
          </div>
        )
      }

      {/* Error Alert */}
      {
        error && (
          <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "9999",
          }}>
            <Alert
              icon={<ErrorIcon fontSize="inherit" />}
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={getTodo}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </div>
        )
      }
      <div>
        {fetchLoading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <CircularProgress />
            <Typography>Loading todos...</Typography>
          </div>
        ) : todoArray.length === 0 && !error ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h6" color="textSecondary">
              No todos found. Add your first todo above!
            </Typography>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Typography variant="h6" color="error">
              Unable to load todos
            </Typography>
            <Button variant="outlined" onClick={getTodo} style={{ marginTop: '10px' }}>
              Try Again
            </Button>
          </div>
        ) : (
          <ul>
            {todoArray.map((res) => (
              <li key={res._id} className="todo-item">
                {editId === res._id ? (
                  <div className="edit-row">
                    <TextField value={editTodo} onChange={(e) => setEditTodo(e.target.value)} size="small" />
                    <Button onClick={handleUpdate} disabled={updateLoading} style={{ marginLeft: '8px' }} variant="contained" color="button">
                      {updateLoading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    </Button>
                    <Button onClick={cancelEdit} style={{ marginLeft: '8px' }} variant="outlined" color="inherit"><CloseIcon /></Button>
                  </div>
                ) : (
                  <div className="view-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>{res.todo}</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button onClick={() => handleEdit(res._id, res.todo)} variant="outlined" size="small" title="Edit">
                        <EditIcon />
                      </Button>
                      <Button onClick={() => handleDelete(res._id)} variant="outlined" size="small" color="error" title="Delete">
                        {deleteLoadingId === res._id ? <CircularProgress size={18} /> : <DeleteIcon />}
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TodoList