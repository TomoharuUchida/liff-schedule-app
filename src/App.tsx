import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './App.module.css';

// material-ui
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import { FormControl,TextField,List,Box } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

// firebase
import { db } from "./firebase";
import { auth } from "./firebase";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

// 自作のコンポーネント
import TaskItem from "./Taskitem";
// import useLiff from './hooks/useLiff';
// LIFF IDを設定(後述)
const liffId = process.env.REACT_APP_LIFF_ID || "0";// Use own liffId. undifined回避のためdefault値を設定


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    field: {
    marginTop: 30,
    marginBottom: 20,
    },
    list: {
      margin: "auto",
      // width: "40%",
    },
  }),
);


const App: React.FC = (props:any) => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  // const { loading, error, profile, fetchProfile } = useLiff({ liffId });

  const classes = useStyles();
  const navigate = useNavigate()
  // if (loading) return <p>...loading</p>;
  // if (error) return <p>{error.message}</p>;
  // if (liffId) {
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
  
  // callender
  const [date, setDate] = useState<Date | null>(new Date())
  const changeDateHandler = (newDate: Date | null) => {
    setDate(newDate)
  }
      
  const newTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    //Firebase ver9 compliant (modular)
    await addDoc(collection(db, "tasks"), { title: input });
    setInput("");
    // const monthData =date.toString().split(" ")[1];
    // const dayData =date.toString().split(" ")[2];
  };
  return (
    <div className={styles.app_root}>
      
      <h2>記念日を登録する</h2>
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
      <Box m={1} p={1} color="palette.primary">
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{
            shrink: true,
          }}
          label="何の記念日?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
          }
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker value={date} format="P" onChange={changeDateHandler} />
        </MuiPickersUtilsProvider>
      </FormControl>
      <button className={styles.app_icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcon/>
      </button>
      </Box>
      
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title }/>
      ))}
      </List>
    </div>
  );
  // } else {
  //   return (
  //     <p>LINEアプリからアクセスしてね</p>
  //   )
  // }
  


}

export default App;
