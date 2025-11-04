// // import React, { useState } from "react";
// // import {
// //   Avatar,
// //   Box,
// //   Button,
// //   Checkbox,
// //   Container,
// //   FormControlLabel,
// //   Grid,
// //   IconButton,
// //   InputAdornment,
// //   Paper,
// //   TextField,
// //   Typography,
// // } from "@mui/material";
// // import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// // import Visibility from "@mui/icons-material/Visibility";
// // import VisibilityOff from "@mui/icons-material/VisibilityOff";
// // import Swal from "sweetalert2"; // ✅ Import SweetAlert2
// // import { useNavigate } from "react-router-dom";
// // import Drawer from './Drawer'
// // export default function LoginPage() {
// //   const [values, setValues] = useState({
// //     username: "",
// //     password: "",
// //     showPassword: false,
// //     remember: false,
// //   });

// // let navigate = useNavigate()

// //   const handleChange = (prop) => (event) => {
// //     const value =
// //       prop === "remember" ? event.target.checked : event.target.value;
// //     setValues({ ...values, [prop]: value });
// //   };

// //   const handleTogglePassword = () => {
// //     setValues((prev) => ({ ...prev, showPassword: !prev.showPassword }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     // ✅ Check credentials
// //     if (values.username === "prajwal" && values.password === "1234") {
// //       Swal.fire({
// //         icon: "success",
// //         title: "Login Successful!",
// //         text: `Welcome, ${values.username}!`,
// //         confirmButtonColor: "#1976d2",
// //       });
// //       navigate('/Drawer')
// //     } else {
// //       Swal.fire({
// //         icon: "error",
// //         title: "Invalid Credentials",
// //         text: "Please check your username or password and try again.",
// //         confirmButtonColor: "#d32f2f",
// //       });
// //     }
// //   };

// //   return (
// //     <Container maxWidth="sm" sx={{ mt: 8 }}>
// //       <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
// //         <Box display="flex" flexDirection="column" alignItems="center">
// //           <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
// //             <LockOutlinedIcon />
// //           </Avatar>
// //           <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
// //             Sign in
// //           </Typography>
// //           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
// //             Enter your username and password to continue
// //           </Typography>

// //           <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
// //             <TextField
// //               label="Username"
// //               value={values.username}
// //               onChange={handleChange("username")}
// //               margin="normal"
// //               required
// //               fullWidth
// //               autoFocus
// //               autoComplete="username"
// //             />

// //             <TextField
// //               label="Password"
// //               value={values.password}
// //               onChange={handleChange("password")}
// //               margin="normal"
// //               required
// //               fullWidth
// //               type={values.showPassword ? "text" : "password"}
// //               autoComplete="current-password"
// //               InputProps={{
// //                 endAdornment: (
// //                   <InputAdornment position="end">
// //                     <IconButton
// //                       onClick={handleTogglePassword}
// //                       edge="end"
// //                       aria-label="toggle password visibility"
// //                     >
// //                       {values.showPassword ? <VisibilityOff /> : <Visibility />}
// //                     </IconButton>
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />

// //             <FormControlLabel
// //               control={
// //                 <Checkbox
// //                   checked={values.remember}
// //                   onChange={handleChange("remember")}
// //                 />
// //               }
// //               label="Remember me"
// //               sx={{ mt: 1 }}
// //             />

// //             <Button
// //               type="submit"
// //               fullWidth
// //               variant="contained"
// //               size="large"
// //               sx={{ mt: 2, mb: 1 }}
// //             >
// //               Sign In
// //             </Button>

// //             <Grid container justifyContent="space-between">
// //               <Grid item>
// //                 <Button size="small">Forgot password?</Button>
// //               </Grid>
// //               <Grid item>
// //                 <Button size="small">Don't have an account? Sign Up</Button>
// //               </Grid>
// //             </Grid>
// //           </Box>
// //         </Box>
// //       </Paper>
// //     </Container>
// //   );
// // }
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API_BASE_URL = "http://localhost:4000/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Sending login data:", { email, password });
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

//       const token = response.data.items.token;
//       localStorage.setItem("token", token);

//       navigate("/Drawer");
//     } catch (err) {
//       console.error(err);
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundImage: "url('https://www.shutterstock.com/image-vector/landing-page-tech-background-abstract-260nw-1654345876.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div
//         style={{
//           width: "350px",
//           padding: "30px",
//           borderRadius: "10px",
//           backgroundColor: "rgba(255, 255, 255, 0.9)",
//           boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
//         }}
//       >
//         <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

//         <form onSubmit={handleSubmit}>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{
//               width: "100%",
//               padding: "10px",
//               marginBottom: "15px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//           />

//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{
//               width: "100%",
//               padding: "10px",
//               marginBottom: "15px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//           />

//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               padding: "10px",
//               backgroundColor: "#007bff",
//               border: "none",
//               borderRadius: "5px",
//               color: "#fff",
//               fontSize: "16px",
//               cursor: "pointer",
//             }}
//           >
//             Login
//           </button>
//         </form>

//         {error && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    try {
      console.log("🔐 Sending login data:", { email, password });

      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      console.log("✅ Login success:", response.data);

      const token = response.data.items.token;
      const userId = response.data.items.user?.user_id; // assuming backend returns { user: { id, name, email }, token }

      // ✅ Save to localStorage for later API calls
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // redirect to main drawer page
      navigate("/Drawer");
    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://www.shutterstock.com/image-vector/landing-page-tech-background-abstract-260nw-1654345876.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "5px",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "10px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
