import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { logout } from '../../shared/utils/logout';
import {useNavigate} from "react-router-dom"
import {useUserAndChats} from "../../Context/userAndChatsProvider.jsx"

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {user} = useUserAndChats();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleProfileClick = () => {
    // Handle profile click logic
    // You can redirect to the user profile page or perform other actions
    handleDrawerClose();
  };

  const handleSignOutClick = async() => {
    const userId = user._id;
    await logout(userId)
    handleDrawerClose();
    navigate("/")
  };

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none'}}>
        <Toolbar>

          <div style={{ flex: 1 }} /> {/* Pushes the logo to the rightmost side */}

          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <img  alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          </IconButton>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerClose}
            PaperProps={{
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                boxShadow: 'none',
                borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <List style={{ width: '200px' }}>
              <ListItem button onClick={handleProfileClick} >
                <ListItemText primary="User Profile" style={{ color: 'white' }} />
              </ListItem>
              <ListItem button onClick={handleSignOutClick}>
                <ListItemText primary="Sign Out" style={{ color: 'white' }} />
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;