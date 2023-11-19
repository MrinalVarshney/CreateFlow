import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const InputWithDropdown = ({ slots, setValue }) => {
  const handleInputChange = (event, value) => {
    console.log("Input changed:", value);
    setValue(value);
  };

  return (
    <div style={{ width: "40%" }}>
      <Autocomplete
        options={slots}
        freeSolo
        disableClearable
        onChange={(event, value) => handleInputChange(event, value)}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              onChange: (event) =>
                handleInputChange(event, params.inputProps.value),
            }}
            label="select"
          />
        )}
      />
    </div>
  );
};

export default InputWithDropdown;
