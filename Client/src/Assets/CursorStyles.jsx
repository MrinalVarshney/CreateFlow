import { makeStyles } from "@mui/styles";
import eraserImage from "./cursor/eraser.jpg";
import pencilImage from "./cursor/pencil.png";
import penImage from "./cursor/pen.png";
import brushImage from "./cursor/brush.jpg";
import paintBucketImage from "./cursor/paintBucket.jpg";

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
