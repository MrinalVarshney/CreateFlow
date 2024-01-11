import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';


const NewDrawingBoardContainer = ({onAddClick}) => {
    const navigate = useNavigate();
    const handleBack = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        navigate('/dashboard');
    }
    return (
<div style={{textAlign:'center',marginTop: '16px'}}>
    <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
    >
        Add New Drawing Board
    </Button>
    <Button
        variant="contained"
        onClick={handleBack}
        sx={{marginLeft:'16px'}}
    >
        Back to DashBoard
    </Button>
</div>
    );
};

export default NewDrawingBoardContainer;
