import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { useUserAndChats } from '../../Context/userAndChatsProvider';


const CanvasNameModal = ({ open, onClose }) => {
    const [canvasName, setCanvasName] = useState('');
    const {user} = useUserAndChats();

    const handleNameChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setCanvasName(event.target.value);
    };

    const handleSave = () => {
        if(canvasName === ""){
            alert("Please enter a name for the canvas")
        }
        else{
            console.log('Canvas Name:', canvasName);
            const snapShot = localStorage.getItem("snapShot");
            const data = {
              canvasName: canvasName,
              canvasData: snapShot,
              creatorId: user._id,
            };
            onClose(data);
        }
        setCanvasName('')
    };

    const handleCancel = (e) => {    
        e.stopPropagation();
        e.preventDefault();
        setCanvasName('')
        onClose(null)
    }
    return (
        <Dialog open={open} onClose={()=>onClose(null)} disableBackdropClick>
            <DialogTitle>Save Canvas </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Canvas Name"
                    type="text"
                    fullWidth
                    value={canvasName}
                    onChange={handleNameChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CanvasNameModal;
