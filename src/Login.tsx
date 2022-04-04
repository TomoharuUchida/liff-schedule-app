import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import { auth } from "./firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login: React.FC = (props: any) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
        user && navigate("/");
        });
        return()=> unSub();
    }, []);
    
  return (
      <div className={styles.login_root}>
          <h1>{isLogin ? "Login" : "Rigister"}</h1>
          <br />
          <FormControl>
              <TextField
                  InputLabelProps={{
                      shrink:true,
                  }}
                  name="email"
                  label="Email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value);
                  }}
              />
          </FormControl>
          <br />
          <FormControl>
              <TextField
                  InputLabelProps={{
                      shrink:true,
                  }}
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                  }}
              />
          </FormControl>
          <br />
          <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={
                isLogin
                ? async () => {
                    try {
                        //Firebase ver9 compliant (modular)
                        await signInWithEmailAndPassword(auth, email, password);
                        navigate("/");
                    } catch (error: any) {
                        alert(error.message);
                    }
                }
                : async () => {
                    try {
                        //Firebase ver9 compliant (modular)
                        await createUserWithEmailAndPassword(auth, email, password);
                        navigate("/");
                    } catch (error: any) {
                        alert(error.message);
                    }
                }
        }
          >
              {isLogin ? "Login" : "register"}

          </Button>
          <br />
          <Typography align="center">
              <span onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Create new account ?" : "Back to login"}
              </span>
          </Typography>
      </div>
  )
}

export default Login
