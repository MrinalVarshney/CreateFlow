import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from '@mui/icons-material/Clear';
import { useUserAndChats } from '../../Context/userAndChatsProvider';

import './Notification.css';

const useStyles = makeStyles((theme) => ({
  popover: {
    maxWidth: '300px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {

  },
}));


const NotificationBell = ({notifications}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const {user,Socket} = useUserAndChats();

  const socket = Socket.current

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAccept = (roomCode)=>{
    // Handle accept all action
    const userId = user?._id;
    const userName = user?.username;
    const data = {userId:userId,userName:userName,roomCode:roomCode}
    socket?.emit("collab-room-join", (data));
    handleClose();
  }

  const open = Boolean(anchorEl);



  const handleReject = () => {
    // Handle reject all action
    handleClose();
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        className="notification-bell"
        sx={{color:"#CBAA03"}}
      >
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        
      >
        <List className={classes.popover} style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', color:"white",padding:"3px"}}>
          {notifications.map((notification) => (
            <ListItem key={notification._id} className={classes.listItem}>
              <div>
                <Avatar className={classes.avatar}>
                  {notification.username}
                </Avatar>
                <ListItemText
                  primary={notification.sender.username}
                  secondary={notification.sender.email}
                />
              </div>
              <div>
                {notification.message}
                <Button
                  color="primary"
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={handleAccept}
                >
                  Accept
                </Button>
                <Button
                  color="secondary"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </div>
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <Typography>No pending notifications</Typography>
          )}
          {notifications.length > 1 && (
            <div className={classes.listItem}>
              <Button
                color="secondary"
                size="small"
                onClick={handleReject}
                startIcon={<ClearIcon />}
              >
                Reject All
              </Button>
            </div>
          )}
        </List>
      </Popover>
    </div>
  );
};

export default NotificationBell;
