import Pencil from "../Drawing_Tools/pencil";
import Pen from "../Drawing_Tools/pen";
import Brush from "../Drawing_Tools/brush";
import Eraser from "../Drawing_Tools/Eraser";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import PaintBucket from "../Drawing_Tools/PaintBucket";
import UploadFiles from "../Drawing_Tools/uploadFiles";


const toolsList = [
  { icon: <Pencil />, name: "Pencil" },
  { icon: <Pen />, name: "Pen" },
  { icon: <Brush />, name: "Brush" },
  {
    icon: <Eraser />,
    name: "Eraser",
  },
  { icon: <PaintBucket />, name: "PaintBucket" },
  { icon: <UploadFiles />, name: "UploadFiles" },
  { icon: <LineWeightIcon />, name: "Thickness" },
];

export default toolsList;
