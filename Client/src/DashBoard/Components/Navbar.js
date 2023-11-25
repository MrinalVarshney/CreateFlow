import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { logout } from '../../shared/utils/logout';
import {useNavigate} from "react-router-dom"
import {useUserAndChats} from "../../Context/userAndChatsProvider.jsx"
import Notification from './Notification.js';
import Profile from "./Profile.js";
import JoinButton from "./JoinButton.js"

const Navbar = ({notifications}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useUserAndChats();
  const navigate = useNavigate();
  console.log(notifications)

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleProfileClick = () => {
    // Handle profile click logic
    // You can redirect to the user profile page or perform other actions
    setShowProfile(true);
    handleDrawerClose();
  };

  const handleSignOutClick = async () => {
    const userId = user._id;
    await logout(userId);
    handleDrawerClose();
    navigate("/");
  };



  return (
    <div>
      <Profile showProfile={showProfile} setShowProfile={setShowProfile} />
      <AppBar
        position="static"
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
        
          <div style={{ flex: 1 }} /> {/* Pushes the logo to the rightmost side */}
          <Notification notifications={notifications}/>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <img
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerClose}
            PaperProps={{
              style: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                boxShadow: "none",
                borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            <List style={{ width: "200px" }}>
              <ListItem button onClick={handleProfileClick}>
                <ListItemText
                  primary="User Profile"
                  style={{ color: "white" }}
                />
              </ListItem>
              <ListItem button onClick={handleSignOutClick}>
                <ListItemText primary="Sign Out" style={{ color: "white" }} />
              </ListItem>
              <ListItem>
                <JoinButton />
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
