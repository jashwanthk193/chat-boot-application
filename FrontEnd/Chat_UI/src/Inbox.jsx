// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Paper,
// } from "@mui/material";
// import AddCommentIcon from "@mui/icons-material/AddComment";
// import { useNavigate } from "react-router-dom";

// const Inbox = () => {
//   const navigate = useNavigate();

//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [persons] = useState([
//     { person_id: 1, person_name: "Alice Johnson" },
//     { person_id: 2, person_name: "Bob Smith" },
//     { person_id: 3, person_name: "Charlie Davis" },
//     { person_id: 4, person_name: "Diana Prince" },
//     { person_id: 5, person_name: "Ethan Wilson" },
//   ]);

//   const handleChange = (event) => {
//     const selected = persons.find(
//       (p) => p.person_name === event.target.value
//     );
//     setSelectedPerson(selected);
//   };

//   const handleStartChat = () => {
//     if (selectedPerson) {
//       navigate("/Drawer/Chat", { state: selectedPerson });
//     }
//   };

//   return (
//     <Box
//       sx={{
//         p: 3,
//         maxWidth: 500,
//         mx: "auto",
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//       }}
//     >
//       <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
//         Inbox
//       </Typography>

//       <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
//         <FormControl fullWidth>
//           <InputLabel id="person-select-label">Select Person</InputLabel>
//           <Select
//             labelId="person-select-label"
//             id="person-select"
//             value={selectedPerson ? selectedPerson.person_name : ""}
//             label="Select Person"
//             onChange={handleChange}
//           >
//             {persons.map((person) => (
//               <MenuItem key={person.person_id} value={person.person_name}>
//                 {person.person_name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {selectedPerson && (
//           <Typography sx={{ mt: 2, textAlign: "center" }}>
//             📨 Chatting with <b>{selectedPerson.person_name}</b>
//           </Typography>
//         )}

//         <Box sx={{ textAlign: "center", mt: 3 }}>
//           <Button
//             variant="contained"
//             startIcon={<AddCommentIcon />}
//             onClick={handleStartChat}
//             disabled={!selectedPerson}
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               textTransform: "none",
//             }}
//           >
//             Start New Chat
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default Inbox;
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { useNavigate } from "react-router-dom";
import { getusers } from "./api"; // adjust the import path if needed

const Inbox = () => {
  const navigate = useNavigate();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getusers();
        console.log("API response:", data);
        setPersons(data.items || []); // ✅ FIXED
      } catch (error) {
        console.error("Error fetching users:", error);
        setPersons([]); // fallback to avoid crash
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (event) => {
    const selected = persons.find((p) => p.NAME === event.target.value);
    setSelectedPerson(selected);
  };

  const handleStartChat = () => {
    if (selectedPerson) {
      navigate("/Drawer/Chat", { state: selectedPerson });
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 500,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
        Inbox
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <FormControl fullWidth>
            <InputLabel id="person-select-label">Select Person</InputLabel>
            <Select
              labelId="person-select-label"
              id="person-select"
              value={selectedPerson ? selectedPerson.NAME : ""}
              label="Select Person"
              onChange={handleChange}
            >
              {persons.map((person) => (
                <MenuItem key={person.USER_ID} value={person.NAME}>
                  {person.NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {selectedPerson && (
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            📨 Chatting with <b>{selectedPerson.NAME}</b>
          </Typography>
        )}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddCommentIcon />}
            onClick={handleStartChat}
            disabled={!selectedPerson}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Start New Chat
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Inbox;
