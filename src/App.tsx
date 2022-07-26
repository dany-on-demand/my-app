import React from "react";
import logo from "./logo.svg";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useForm } from "./Validator";
import { i18n } from "./i18n";

import "./App.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface User {
  login: string;
  pw: number;
}

const lang = "cz";
// https://www.regular-expressions.info/email.html
const EMAIL_REGEXP =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

function App() {
  const { handleSubmit, handleChange, data, errors } = useForm<User>({
    validations: {
      login: {
        custom: {
          isValid: (value) =>
            value.length > 5 && // 5+ znaků
            RegExp(EMAIL_REGEXP).test(value) && // zavináč :)
            RegExp("^[a-z0-9.-]*@.*$").test(value), // zbytek
          message: i18n[lang]["validation.login"],
        },
      },
      pw: {
        custom: {
          isValid: (value) => value.length > 6,
          message: i18n[lang]["validation.pwshort"],
        },
      },
    },
    onSubmit: async () => {
      const url = "http://[::1]:5000";
      const response = await fetch(url + "/login", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify({ login: data.login, pw: data.pw }),
      });
      if (response.ok) {
        const parsed = await response.json();
        if (parsed.status === "ok") alert("Login successful");
        else alert("Error: " + parsed.message);
      } else {
        console.log(response);
      }
    },
    initialValues: {
      login: "",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <CssBaseline />
        <form className="App-header" onSubmit={handleSubmit} id="loginForm">
          <TextField
            variant="standard"
            // type="email" // lze využít nativní validace
            type="text"
            placeholder="Login"
            value={data.login || ""}
            onChange={handleChange("login")}
            required
          />
          {errors.login && <p className="error">{errors.login}</p>}

          <TextField
            variant="standard"
            type="password"
            value={data.pw || ""}
            onChange={handleChange("pw")}
            required
          />
          {errors.pw && <p className="error">{errors.pw}</p>}

          <Button type="submit" variant="contained" form="loginForm">
            Login
          </Button>
        </form>
      </div>
    </ThemeProvider>
  );
}

export default App;
