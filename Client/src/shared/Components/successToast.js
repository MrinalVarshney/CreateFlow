import { Alert } from "@mui/material"
const SuccessToast = ({message,setSuccess}) => {
    setTimeout(() => {
        setSuccess(null)
      }, 3000);
    return (
        <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "fit-content",
          marginBottom: "16px", // Adjust as needed
        }}
      >
        {message && <Alert severity="success">{message}</Alert>}
      </div>
    )
}

export default SuccessToast