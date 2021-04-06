import { recamansSequence } from "./recamans_sequence.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
const seq = recamansSequence(55);
ctx.lineWidth = 5;

let scale = 2;

const drawArc = function ([p0, p1, p2], r) {
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.arcTo(p1.x, p1.y, p2.x, p2.y, r);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
};

function draw() {
  canvas.width = window.outerWidth * 2;
  canvas.height = window.innerHeight * 2;

  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(30, -(canvas.height / 4));
  drawSequence(seq);
  ctx.restore();
}

draw();

window.addEventListener("resize", (e) => {
  draw();
});

/** 
 * @param {ArrayLike<number>} seq
 * @param {"flip" | string} type
 **/
function drawSequence(seq, type = "flip") {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  const padding = 13;

  let lastNumber = 0;
  let len = seq.byteLength || seq.length;

  for (let i = 0; i < len; i++) {
    let n = seq[i + 1];

    if (n === undefined) break;

    let x = n * padding;
    let y = canvas.height / 2;

    let curveSize = lastNumber < n
      ? ((n - lastNumber) * 0.5) * padding
      : ((lastNumber - n) * 0.5) * padding;

    ctx.beginPath();
    let gradient = ctx.createLinearGradient(i * padding, y, x, y);
    gradient.addColorStop(0, `hsl(${n},75%,60%)`);
    gradient.addColorStop(1, `hsl(${seq[i + 2] || 0},75%,60%)`);

    ctx.strokeStyle = gradient;

    let midY = type === "flip"
      ? i % 2 === 0 ? y - curveSize : y + curveSize
      : lastNumber < n
      ? y - curveSize
      : y + curveSize;

    let midX = (n + lastNumber) * 0.5 * padding;

    drawArc([
      { x: lastNumber * padding, y: y },
      { x: lastNumber * padding, y: midY },
      { x: midX, y: midY },
    ], curveSize);

    drawArc([
      { x: midX, y: midY },
      { x: x, y: midY },
      { x: x, y: y },
    ], curveSize);

    lastNumber = n;
  }

  // // number graph
  // for (let i = 0; i < len; i++) {
  //   let y = canvas.height / 2;
  //   ctx.fillText(`${i}`, i * padding - 2.5, y + (i % 2 ? 10 : 20));

  //   ctx.strokeStyle = "#555";
  //   ctx.beginPath();
  //   ctx.moveTo(i * padding, y);
  //   ctx.lineTo(i * padding, y - 5);
  //   ctx.stroke();
  // }
}
