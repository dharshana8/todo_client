import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';  
import Button from '@mui/material/Button';

import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import "./css/ToDoList.css"
import axios from 'axios';
import { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// const TodoList=()=>{
//   const[todo,setTodo]=useState("");
// }
const TodoList = () => {
  const[todo,setTodo]=useState(' ');
  const [status,setStatus] =useState(false);


  const[todoArray,setTodoArray]=useState([]);
  console.log(todoArray)
  // create post

  
  const postTodo=async()=>{
    try {
      await axios.post("https://todo-server-ec2-1-19ms.onrender.com/csbs/addtodo",{todo})
      .then((response)=>{
        console.log(response.data);
      })
      .catch(()=>{

      })
      setTodo(' ')
      setStatus(true)
      getTodo()
      setTimeout(()=>setStatus(false),3000);
    } catch (error) {
      console.error(err);
    }
  }
  // read get
  const getTodo =async()=>{
    await axios.get('https://todo-server-ec2-1-19ms.onrender.com/csbs/gettodo')
    .then((response)=>{
      setTodoArray(response.data)
    })
    .catch((err)=>{
      console.error(err);
    })
  }
  useEffect(()=>{
    getTodo()
  },[])

  const deleteTodo =async(id) =>{
    try{
      await axios.delete(`https://todo-server-ec2-1-19ms.onrender.com/csbs/deletetodo/${id}`);
      getTodo()
    }
    catch(err){
      console.error(err)
    }
  }

  const updateTodo = async(id,data)=>{
    try{
      await axios.put(`https://todo-server-ec2-1-19ms.onrender.com/csbs/updatetodo/${id}`,{todo:data})
      getTodo()
    }
    catch(err){
      console.error(err)
    }
  }

  const newTodo = async(id,data) =>{
    const newData =prompt("enter new Todo",data)
    if(newData.trim()== ""){
      newTodo(id)
    }
    updateTodo(id,newData)
  }

  return (
    <div className='todolist'>
        <Typography variant="h1" gutterBottom>Todo List</Typography>
        <Box sx={{ width: 500, maxWidth: '100%' }} className='box'>
          <TextField fullWidth label="fullWidth" id="fullWidth" value={todo} onChange={(e)=>setTodo(e.target.value)} />
          <Button variant="contained" color="button" className='button' onClick={postTodo}>
            Add Todo
          </Button>
       </Box>
       {
        status && (
            <div style={{
                position:"fixed",
                top:"20px",
                right:"20px",
                zIndex:"9999",
                }}>

                      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Todo has been  Posted
                      </Alert>
            </div>
        )

       }
       {todo}
       <div>
        <ul>
          {
            todoArray.map((res)=>(
              <li className='list-item' key={res._id}>
                <h3>{res.todo}</h3>
                <IconButton aria-label="delete" size="small" onClick={()=>deleteTodo(res._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="edit" size="small" onClick={(e)=>newTodo(res._id,res.data)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </li>
            ))
          }
        </ul>
       </div>
    </div>
  )
}

export default TodoList