import { makeStyles } from "@mui/styles";
import eraserImage from "./cursor/eraser.svg";
import pencilImage from "./cursor/pencil.svg";
import penImage from "./cursor/pen.svg";
import brushImage from "./cursor/brush.svg";
import paintBucketImage from "./cursor/paintBucket.svg";

export const useStyles = makeStyles({
  Pencil: {
    cursor: `url(${pencilImage}), auto`,
  },
  Pen: {
    cursor: `url(${penImage}), auto`,
  },
  Brush: {
    cursor: `url(${brushImage}), auto`,
  },
  Eraser: {
    cursor: `url(${eraserImage}), auto`,
  },
  PaintBucket: {
    cursor: `url(${paintBucketImage}), auto`,
  },
});
