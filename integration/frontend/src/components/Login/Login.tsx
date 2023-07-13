import { Visibility, VisibilityOff } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
} from "@mui/material";
import React from "react";
import { Link as LinkRoute, useNavigate } from "react-router-dom";
import { signIn } from "../../controllers/SignController";
import styles from "./Login.module.sass";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [login, setLogin] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState(null);

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword((show) => !show);
  }, []);

  const handleMouseDownPassword = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    []
  );
  const handlePassword = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const target = event.target as HTMLInputElement;
      setPassword(target.value || "");
    },
    []
  );

  const handleLogin = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      setLogin(target.value || "");
    },
    []
  );

  const handleSingIn = React.useCallback(async () => {
    const data = await signIn(login, password);
    if (typeof data === "object") {
      localStorage.setItem("login", login);
      localStorage.setItem("password", password);
      localStorage.setItem("role", data.role);
      localStorage.setItem("id", data.id);
      localStorage.setItem("fio", data.fio);
      navigate("/booking");
      return;
    }
    setError(data);
  }, [login, navigate, password]);

  return (
    <form className={styles.login_form}>
      <h2 className={styles["login_form-title"]}>SIGN IN</h2>
      <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Login</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type="text"
          label="Login"
          autoComplete="off"
          onChange={handleLogin}
          value={login}
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          autoComplete="new-password"
          label="Password"
          onChange={handlePassword}
          value={password}
        />
      </FormControl>
      <div className={styles["login_form-btn"]}>
        <Button
          variant="contained"
          size="large"
          sx={{ width: "25ch" }}
          onClick={handleSingIn}
          disabled={!password || !login}>
          SIGN IN
        </Button>
        <LinkRoute to="/registr">
          <Link underline="hover">{"SIGN UP"}</Link>
        </LinkRoute>
      </div>
      {error && (
        <div className={styles["login_form-error"]}>
          <ErrorIcon />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
export default Login;
