const drawTriangle = (startX, startY, endX, endY, ctx, pt3X) => {
  var moveX = (endX + pt3X) / 2;
  if (startY < endY) {
    ctx.moveTo(moveX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineTo(pt3X, endY);
    ctx.lineTo(moveX, startY);
    ctx.stroke();
  } else {
    ctx.moveTo(pt3X, startY);
    ctx.lineTo(endX, startY);
    ctx.lineTo(moveX, endY);
    ctx.closePath();
    ctx.stroke();
  }
  return { e1X: pt3X, e1Y: startY, e2X: endX, e2Y: endY };
};

const drawRectangle = (startX, startY, endX, endY, ctx) => {
  const width = endX - startX;
  const height = endY - startY;
  ctx.strokeRect(startX, startY, width, height);
  return { e1X: startX, e1Y: startY, e2X: endX, e2Y: endY };
};

const drawLine = (startX, startY, endX, endY, ctx) => {
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  return { e1X: startX, e1Y: startY, e2X: endX, e2Y: endY };
};

const drawEllipse = (startX, startY, endX, endY, ctx) => {
  const radiusX = Math.abs(endX - startX) / 2;
  const radiusY = Math.abs(endY - startY) / 2;
  var centreX;
  var centreY;
  if (endY > startY) {
    centreY = startY + radiusY;
  } else {
    centreY = startY - radiusY;
  }
  if (endX > startX) {
    centreX = startX + radiusX;
  } else {
    centreX = startX - radiusX;
  }
  ctx.ellipse(centreX, centreY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
  return {
    e1X: centreX - radiusX,
    e1Y: centreY - radiusY,
    e2X: centreX + radiusX,
    e2Y: centreY + radiusY,
  };
};

const drawCircle = (startX, startY, endX, endY, ctx) => {
  const radius = Math.abs(endY - startY) / 2;
  var centreX;
  var centreY;
  if (endY > startY) {
    centreY = startY + radius;
  } else {
    centreY = startY - radius;
  }
  if (endX > startX) {
    centreX = startX + radius;
  } else {
    centreX = startX - radius;
  }
  ctx.arc(centreX, centreY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  return {
    e1X: centreX - radius,
    e1Y: centreY - radius,
    e2X: centreX + radius,
    e2Y: centreY + radius,
  };
};

const drawNSidePolygon = (startX, endX, startY, endY, n, ctx) => {
  const angleStep = (2 * Math.PI) / n;
  const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = angleStep * i;
    const x = startX + radius * Math.cos(angle);
    const y = startY + radius * Math.sin(angle);
    points.push({ x, y });
  }
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[0].x, points[0].y);
  ctx.stroke();
  return { e1X: startX, e1Y: startY, e2X: endX, e2Y: endY };
};

const drawDashedRectangle = (startX, startY, endX, endY, ctx) => {
  ctx.setLineDash([5, 20]);
  ctx.strokeStyle = "blue";
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  ctx.setLineDash([]);
  drawResizingDots(startX, startY, endX, endY, ctx);
};
const drawLineDashedRectangle = (startX, startY, endX, endY, ctx) => {
  ctx.setLineDash([5, 20]);
  ctx.strokeStyle = "blue";
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  ctx.setLineDash([]);
  drawLineResizingDots(startX, startY, endX, endY, ctx);
};

const drawResizingDots = (startX, startY, endX, endY, ctx) => {
  console.log("Drawing resizing dots", startX, startY, endX, endY);
  ctx.moveTo(startX, startY);
  ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
  ctx.moveTo(startX, endY);
  ctx.arc(startX, endY, 3, 0, 2 * Math.PI);
  ctx.moveTo(endX, startY);
  ctx.arc(endX, startY, 3, 0, 2 * Math.PI);
  ctx.moveTo(endX, endY);
  ctx.arc(endX, endY, 3, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawLineResizingDots = (startX, startY, endX, endY, ctx) => {
  console.log("Drawing resizing dots", startX, startY, endX, endY);
  ctx.moveTo(startX, startY);
  ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
  ctx.moveTo(endX, endY);
  ctx.arc(endX, endY, 3, 0, 2 * Math.PI);
  ctx.stroke();
};
export {
  drawTriangle,
  drawRectangle,
  drawLine,
  drawEllipse,
  drawCircle,
  drawNSidePolygon,
  drawDashedRectangle,
  drawLineDashedRectangle,
};
