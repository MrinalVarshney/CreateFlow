import { Input, Modal } from "@mui/material";
import React, { useState } from "react";
import paintBoy1 from "../../Assets/Images/paintboy1.jpg";
import paintBoy2 from "../../Assets/Images/paintboy2.jpg";
import paintBoy3 from "../../Assets/Images/paintboy3.jpg";
import paintBoy4 from "../../Assets/Images/paintboy4.jpg";

const EditModal = ({ isOpen, onRequestClose, onSave, modalContent }) => {
  const [data, setData] = useState(null);
  const [pic, setPic] = useState();

  const postDetails = (pics) => {
    if (pics === undefined) {
      return;
    }
    console.log("pics", pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/dyo3vk9cy/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  const handleSave = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    console.log("pic",pic)
    onSave(pic, modalContent);
  }

  console.log("in editModal", pic);
  return (
    <Modal
      open={isOpen}
      onClose={() => onRequestClose()}
      contentLabel="Edit Modal"
    >
      <div
        style={{
          height: "30%",
          width: "40%",
          backgroundColor: "yellow",
          marginTop: "17%",
          marginLeft: "30%",
        }}
      >
        {modalContent !== "pic" ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ marginLeft: "35%" }}>{modalContent}</h2>
            <input
              style={{ width: "90%", marginLeft: "2%" }}
              onChange={(e) => setData(e.target.value)}
            />
            <button
              style={{ width: "fit-content", marginLeft: "45%" }}
              onClick={() => onSave(data, modalContent)}
            >
              Save
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: "7%",
              gap: "2%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
            <div style={{ display: "flex", gap: "2%" }}>
              <img
                onClick={() =>
                  setPic(
                    "http://res.cloudinary.com/dyo3vk9cy/image/upload/v1700855273/vguxbppqksvmsidlwl7y.jpg"
                  )
                }
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                src={paintBoy2}
                alt="dog1"
              />
              <img
                onClick={() =>
                  setPic(
                    "http://res.cloudinary.com/dyo3vk9cy/image/upload/v1700855856/situurscmcffl7lpmgbh.jpg"
                  )
                }
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                src={paintBoy1}
                alt="dog1"
              />
              <img
                onClick={() =>
                  setPic(
                    "http://res.cloudinary.com/dyo3vk9cy/image/upload/v1700855912/ugfqo6a8zo1o1fathkvp.jpg"
                  )
                }
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                src={paintBoy3}
                alt="dog1"
              />
              <img
                onClick={() =>
                  setPic(
                    "http://res.cloudinary.com/dyo3vk9cy/image/upload/v1700855944/tntsctjdssptbooygan7.jpg"
                  )
                }
                style={{ width: "100px", height: "100px", cursor: "pointer" }}
                src={paintBoy4}
                alt="dog1"
              />
            </div>
            <button
              style={{ width: "fit-content", marginLeft: "45%" }}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditModal;
