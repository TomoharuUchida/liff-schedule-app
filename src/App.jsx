import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
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
import { collection, query, onSnapshot, addDoc,where,serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, signOut,getAuth } from "firebase/auth";

// 自作のコンポーネント
import TaskItem from "./Taskitem";
// import useLiff from './hooks/useLiff';
// LIFF IDを設定(後述)
const liffId = process.env.REACT_APP_LIFF_ID || "0";// Use own liffId. undifined回避のためdefault値を設定


const useStyles = makeStyles((theme) =>
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


const App = (props) => {
  const { register, handleSubmit } = useForm();
  const [formData, setFormData] = useState(null);

  // const [memorials, setMemorials] = useState([{ userid: "", title: "", date:"",created_at:"", updated_at:"",}]);
  const [input, setInput] = useState("");

  const classes = useStyles();
  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("Login");
      } else {
        //Firebase ver9 compliant (modular)
        const q = query(collection(db, "tasks"),where('uid', '==', `${user.uid}`));
        const unsub = onSnapshot(q, (querySnapshot) => {
          setFormData(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title,
              title: doc.data().date,
            }))
          );
        });
      }
    })
  });
  
  // callender
    const [date, setDate] = useState(new Date())
    const changeDateHandler = (newDate) => {
      setDate(newDate)
    }
      
  const newTask = async (e) => {
      console.log(e)
      //Firebase ver9 compliant (modular)
    await addDoc(collection(db, "memorialDays"),{ title: formData.title },{ date: formData.date },{created_at:serverTimestamp},{updated_at:serverTimestamp});
      setFormData("");
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
            } catch (error) {
              alert(error.message);
            }
          }}
        ><ExitToAppIcon />
        </button>

        <br />
        <Box m={1} p={1} color="palette.primary">
          <form onClick={newTask}>
          <FormControl>
            <TextField
              className={classes.field}
              InputLabelProps={{
                shrink: true,
              }}
              label="何の記念日?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })
              }
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker value={formData.date} format="P" onChange={changeDateHandler} />
            </MuiPickersUtilsProvider>
          </FormControl>
          <button className={styles.app_icon} disabled={!formData.title}>
            <AddToPhotosIcon />
          </button>
          </form>
        </Box>
      
        <List className={classes.list}>
          {formData.map((memorials) => (
            <TaskItem key={memorials.id} id={memorials.id} title={memorials.title} />
          ))}
        </List>
      </div>
    );
    // } else {
    //   return (
    //     <p>LINEアプリからアクセスしてね</p>
    //   )
    // }
  


  };
export default App;
