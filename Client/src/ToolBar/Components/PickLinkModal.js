// PicLinkModal.js

import React from "react";
import { Modal, Button } from "@mui/material";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import TextField from "@mui/material/TextField";

const PicLinkModal = ({ open, onClose, picUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(picUrl);
    console.log("copied");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
          Copy and share your canvas snap !!
        </h2>
        <TextField
          value={picUrl}
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          style={{ marginBottom: "16px" }}
        />
        <Button onClick={handleCopy} style={{ marginRight: "8px" }}>
          <FileCopyIcon />
        </Button>
      </div>
    </Modal>
  );
};

export default PicLinkModal;
