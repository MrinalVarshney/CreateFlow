import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import ShareIcon from "@mui/icons-material/Share";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useUserAndChats } from "../Context/userAndChatsProvider";
import ShareableCodeModal from "./Components/ShareableCodeModal";
import PicLinkModal from "./Components/PickLinkModal";

const SettingsMenu = ({
  handleOpenModal,
  downloadCanvasImage,
  reSaveCanvas,
  navigateToGallery
}) => {
  const { setCanvasDetails} = useUserAndChats();
  const [anchorEl, setAnchorEl] = useState(null);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const navigate = useNavigate();
  const [pic,setPic] = useState(null)
  const [open,setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBackToGallery = async () => {
    setAnchorEl(null);
    const canvasCurrentData = localStorage.getItem("snapShot");
    const details = JSON.parse(localStorage.getItem("canvasDetails"));
    if (!details) {
      navigateToGallery.current = true;
      handleOpenModal();
      return;
    }
    const canvasPreSaveData = details.canvasData;

    if (canvasPreSaveData !== canvasCurrentData) {
      console.log("Resaving");
      await reSaveCanvas();
    }
    setCanvasDetails(null);
    localStorage.removeItem("canvasDetails");
    localStorage.removeItem("snapShot");
    navigate("/drawingGallery");
  };

  const handleSave = () => {
    const details = JSON.parse(localStorage.getItem("canvasDetails"));
    if (details) {
      reSaveCanvas();
    } else {
      handleOpenModal();
    }
  };

  const handleAdd = () => {
    console.log("Add collaborators");
    setCodeModalOpen(true);
  };

  const handleCloseCodeModal = () => {
    setCodeModalOpen(false);
  }

  const handleDownload = () => {
    console.log("Downloading");
    const dataUrl = localStorage.getItem("snapShot");
    downloadCanvasImage(dataUrl);
  };

  const handleShare = async () => {
    try {
      const dataUrl = localStorage.getItem("snapShot");
  
      // Convert data URL to Blob
      const base64String = dataUrl.split(",")[1];
      const binaryString = atob(base64String);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: 'image/png' });
  
      // Create FormData and append the blob
      const data = new FormData();
      data.append("file", blob);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
  
      // Make the Cloudinary upload request
      const response = await fetch("https://api.cloudinary.com/v1_1/dyo3vk9cy/image/upload", {
        method: "POST",
        body: data,
      });
  
      const result = await response.json();
  
      // Handle the Cloudinary response
      setPic(result.url.toString());
      setOpen(true);
      console.log(result.url.toString());
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
  };

  const onClose = ()=>{
    setOpen(false)
  }

  console.log(pic)
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        boxShadow: "10",
        position: "absolute",
        right: "0",
        zIndex:"5"
      }}
    >
      <IconButton onClick={handleClick} color="inherit">
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleBackToGallery()}>
          <CollectionsBookmarkIcon sx={{ marginRight: 1 }} />
          Back To gallery
        </MenuItem>
        <MenuItem onClick={() => handleShare()}>
          <ShareIcon sx={{ marginRight: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={() => handleDownload()}>
          <CloudDownloadIcon sx={{ marginRight: 1 }} />
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSave();
          }}
        >
          <SaveIcon sx={{ marginRight: 1 }} />
          Save
        </MenuItem>
        <MenuItem onClick={() => handleAdd()}>
          <AddIcon sx={{ marginRight: 1 }} />
          Add Collaborators
        </MenuItem>
      </Menu>
      <ShareableCodeModal open={codeModalOpen} onClose={handleCloseCodeModal} />
      <PicLinkModal open={open} picUrl={pic} onClose={onClose}/>
    </div>
  );
};

export default SettingsMenu;
