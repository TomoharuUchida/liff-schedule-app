// rafce
import React, { useState, useEffect } from 'react';
import styles from "./Taskitem.module.css";
import { ListItem, TextField, Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { db } from "./firebase";
//Firebase ver9 compliant (modular)
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";

interface PROPS{
    id: string;
    title: string;
    date:string
}

function convertTimestampToDatetime(timestamp:any) {
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear()-1969;
  const m = (_d.getMonth() + 1).toString().padStart(2, "0");
  const d = _d.getDate().toString().padStart(2, "0");
  const H = _d.getHours().toString().padStart(2, "0");
  const i = _d.getMinutes().toString().padStart(2, "0");
  const s = _d.getSeconds().toString().padStart(2, "0");
    return `${Y}/${m}/${d}`;
    // return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

const Taskitem: React.FC<PROPS> = (props) => {
    const [title, setTitle] = useState(props.title);
    const [date, setDate] = useState(props.date);

    const tasksRef = collection(db, "tasks");
    const editTask = async () => {
        //Firebase ver9 compliant (modular)
        await setDoc(
        doc(tasksRef, props.id),
        {
            title: title,
        },
        { merge: true }
        );
    };

    const deleteTask = async () => {
        //Firebase ver9 compliant (modular)
        await deleteDoc(doc(tasksRef, props.id));
    };

  return (
    
    <ListItem>
          <p>{props.title}</p>
          <p>{convertTimestampToDatetime(props.date)}</p>
          <Grid container justifyContent="flex-end">
              <TextField
                  InputLabelProps={{
                      shrink:true,
                  }}
              
                  label="編集"
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
          </Grid>
          <button className={styles.taskitem_icon} onClick={editTask}>
                  <EditOutlinedIcon />
          </button>
          <button onClick={deleteTask}>
                  <DeleteOutlineOutlinedIcon />
          </button>
    </ListItem>
    
  )
}

export default Taskitem
