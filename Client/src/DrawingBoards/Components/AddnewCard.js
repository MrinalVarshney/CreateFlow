import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';


const NewDrawingBoardContainer = ({onAddClick}) => {
    return (
<div style={{textAlign:'center',marginTop: '16px'}}>
    <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddClick}
    >
        Add New Drawing Board
    </Button>
</div>
    );
};

export default NewDrawingBoardContainer;
