import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
// import { MyContext } from '../src/context';
// import { AuthContext } from '../src/Context/AuthContext';
import { useUserContext } from '../src/Context/UserContext';

export default function LoginPage() {

  const { login, user, isLoggedIn } = useUserContext();
  // const auth = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isLoggedIn) {
      console.log("User already logged in, redirecting to chat.", user, isLoggedIn);
      navigate("/chat"); // ✅ safe to call here
    }
  }, [user, isLoggedIn, navigate]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await login(username);
    navigate("/chat");
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5" component="h1" gutterBottom>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="username"
            required
          />
          {/* <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}