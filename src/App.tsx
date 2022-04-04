import { FormControl,TextField,List } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './App.module.css';
import { db } from "./firebase";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import TaskItem from "./Taskitem";
import { makeStyles } from '@material-ui/styles';
import { auth } from "./firebase";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

import liff from '@line/liff';

liff.init({
    liffId:process.env.REACT_APP_LIFF_ID ||"0", // Use own liffId. undifined回避のためdefault値を設定
});

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  }
});

const App: React.FC = (props:any) => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const classes = useStyles();
  const navigate = useNavigate()

  useEffect(() => {
    //Firebase ver9 compliant (modular)
    const unSub = onAuthStateChanged(auth, (user) => {
      // !user && props.history.push("login");
      !user && navigate("login");
    });
    return () => unSub();
  })

  useEffect(() => {
    //Firebase ver9 compliant (modular)
    const q = query(collection(db, "tasks"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      );
    });
    return () => unsub();
  }, []);
  
  const newTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //Firebase ver9 compliant (modular)
    await addDoc(collection(db, "tasks"), { title: input });
    setInput("");
  };
  return (
    <div className={styles.app_root}>
      <h1>あなたの記念日</h1>
      <button
        className={styles.app_logout}
        onClick={async () => {
          try {
            await signOut(auth);
            navigate("login");
          } catch (error: any) {
            alert(error.message);
          }
        }}
      ><ExitToAppIcon />
      </button>

      <br/>
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="New Task?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app_icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon/>
      </button>
      
      
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title }/>
      ))}
      </List>
    </div>
  );
}

export default App;
