import React from "react";
import { TextField } from "@mui/material";


const InputWithLabel = (props) => {
  const { value, setValue, label, type, placeholder } = props;

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  return (
 
    <TextField
    label={label}
    value={value}
    onChange={handleValueChange}
    type={type}
    placeholder={placeholder}
    variant="outlined"
    fullWidth
    required
  />
  )
};

export default InputWithLabel;
