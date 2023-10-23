import Pencil from "../Drawing_Tools/pencil";
import Pen from "../Drawing_Tools/pen";
import Brush from "../Drawing_Tools/brush";
import Eraser from "../Drawing_Tools/Eraser";
import LineWeightIcon from "@mui/icons-material/LineWeight";

const toolsList = [
    { icon: <Pencil />, name: "Pencil", child: <Pencil /> },
    { icon: <Pen/>, name: "Pen", child: <Pen /> },
    { icon: <Brush />, name: "Brush", child: <Brush /> },
    {
      icon: <Eraser />,
      name: "Eraser",
    },
    { icon: <LineWeightIcon />, name: "Thickness"},
  ];

export default toolsList;