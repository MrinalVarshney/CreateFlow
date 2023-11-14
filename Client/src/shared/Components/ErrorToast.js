import { Alert } from "@mui/material"
const ErrorToast = ({message,setError}) => {
    setTimeout(() => {
        setError(null);
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
        {message && <Alert severity="error">{message}</Alert>}
      </div>
    )
}

export default ErrorToast