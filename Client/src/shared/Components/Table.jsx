import React from "react";

const Table = ({ usersJoined, user }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "2px solid black",
        width: "50%",
        borderRadius: "10px",
      }}
    >
      {usersJoined.map((User) => (
        <h4
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "5px",
            padding: "5px",
            marginBottom: "0px",
            borderBottom: "1px solid #b8bcbd",
            backgroundColor: User._id === user._id ? "lightgreen" : "",
          }}
          key={User._id}
        >
          {User.userName}
        </h4>
      ))}
    </div>
  );
};

export default Table;
