import DrawIcon from "@mui/icons-material/Draw";
import BrushIcon from "@mui/icons-material/Brush";
import CreateIcon from "@mui/icons-material/Create";
import Pencil from "../Drawing_Tools/pencil";
import Pen from "../Drawing_Tools/pen";
import Brush from "../Drawing_Tools/brush";
import Eraser from "../Drawing_Tools/Eraser";
import { Icon } from "@iconify/react";
import LineWeightIcon from "@mui/icons-material/LineWeight";

const toolsList = [
    { icon: <CreateIcon />, name: "Pencil", child: <Pencil /> },
    { icon: <DrawIcon />, name: "Pen", child: <Pen /> },
    { icon: <BrushIcon />, name: "Brush", child: <Brush /> },
    {
      icon: <Icon icon="mdi:eraser" width="30" height="30" />,
      name: "Eraser",
      child: <Eraser />,
    },
    { icon: <LineWeightIcon />, name: "Thickness", child: null },
  ];

export default toolsList;