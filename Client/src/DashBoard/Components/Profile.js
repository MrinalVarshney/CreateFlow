import { Modal, Paper, Box } from "@mui/material";
import React, { useState } from "react";
import "./profileModal.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import EditIcon from "@mui/icons-material/Edit";
import EditModal from "./EditModal";
import axios from "axios";
import { useUserAndChats } from "../../Context/userAndChatsProvider";

const Profile = ({ showProfile, setShowProfile }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const { user } = useUserAndChats();
  const [isOpen, setIsOpen] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  // data for pie chart
  const data = {
    labels: ["first", "second", "third"],
    datasets: [
      {
        data: [4, 7, 9],
        backgroundColor: ["red", "green", "blue"],
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      legend: {
        display: true, // Set to true to display legend
        position: "top", // You can change the position if needed
      },
      tooltip: {
        enabled: true,
      },
    },
    width: 20, // Set the minimum width to 20px
    height: 20, // Set the minimum height to 20px
  };

  // for editing profile data

  const handleEditClick = (Content) => {
    console.log("edit clicked ");
    setIsOpen(true);
    setModalContent(Content);
  };
  const onRequestClose = () => {
    setIsOpen(false);
  };
  const onSave = (data, modalContent) => {
    setIsOpen(false);
    try {
      axios.post("http://localhost:8000/profileUpdate", {
        user: user,
        data: data,
        modalContent: modalContent,
      });
      if (modalContent === "username") user.username = data;
      else if (modalContent === "bio") user.bio = data;
      else if (modalContent === "email") user.email = data;
      else user.pic = data;
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log("updates", modalContent, user);
  return (
    <div className="modal">
      <Modal open={showProfile} onClose={() => setShowProfile(false)}>
        <div className="profileModal">
          <div style={{ width: "42%" }}>
            <Paper
              style={{
                position: "relative",
                height: "76vh",
                width: "95%",
                zIndex: 2,
                borderRadius: "20px",
                top: "2%",
                left: "2%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box p={2}>
                <div
                  className="profile-image"
                  onClick={() => handleEditClick("pic")}
                >
                  <img className="image" src={user?.pic} alt="profile pic" />
                  <div className="edit-text">edit</div>
                </div>
                <Box
                  p={3}
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    height: "25vh",
                  }}
                >
                  {isOpen && (
                    <EditModal
                      isOpen={isOpen}
                      onRequestClose={onRequestClose}
                      onSave={onSave}
                      modalContent={modalContent}
                    />
                  )}
                  <h1>My Profile</h1>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ margin: "0", flexGrow: 1 }}>{user?.username}</p>
                    <div
                      onClick={() => handleEditClick("username")}
                      style={{ cursor: "pointer" }}
                    >
                      <EditIcon style={{ order: 1 }} />
                    </div>
                  </div>
                  <hr />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ margin: "0", flexGrow: 1 }}>{user?.bio}</p>
                    <div
                      onClick={() => handleEditClick("bio")}
                      style={{ cursor: "pointer" }}
                    >
                      <EditIcon style={{ order: 1 }} />
                    </div>
                  </div>
                  <hr />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p style={{ margin: "0", flexGrow: 1 }}>{user?.email}</p>
                    <div
                      onClick={() => handleEditClick("email")}
                      style={{ cursor: "pointer" }}
                    >
                      <EditIcon style={{ order: 1 }} />
                    </div>
                  </div>
                  <hr />
                </Box>
              </Box>
            </Paper>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "57%",
              gap: "2%",
              justifyContent: "center",
            }}
          >
            <Paper
              style={{
                position: "relative",
                height: "37vh",
                width: "95%",
                zIndex: 2,
                borderRadius: "20px",
                top: "2%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Box p={1}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <h2>Game Insights</h2>
                </div>
                <div style={{ display: "flex" }}>
                  <h4>total games played: 20</h4>
                  <Pie data={data} options={options} />
                </div>
              </Box>
            </Paper>
            <Paper
              style={{
                position: "relative",
                height: "37vh",
                width: "95%",
                zIndex: 2,
                borderRadius: "20px",
                // top: "1%",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            ></Paper>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
