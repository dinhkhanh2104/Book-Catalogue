import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { Navigate } from "react-router-dom";
import { message } from "antd";

const defaultTheme = createTheme();

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      message.error("Passwords do not match");
      return;
    }
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        setIsSigningUp(false);
        message.success("Create account successfully");
      } catch (error) {
        message.error(error.message);
        setIsSigningUp(false);
      }
    }
  };

  return (
    <>
      {isAuthenticated && <Navigate to={"/user"} replace={true} />}

      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    disabled={isSigningUp}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    disabled={isSigningUp}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                disabled={isSigningUp}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {isSigningUp ? "Signing Up..." : "Sign Up"}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    to="/signin"
                    className="text-[#1976d2] text-sm leading-3 "
                    variant="body2"
                  >
                    Have acount? Sign In
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
