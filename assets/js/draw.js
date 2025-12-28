const canvas = document.getElementById("color");
const ctx = canvas.getContext("2d");
const history = [];

const params = new URLSearchParams(window.location.search);
const imgFile = params.get("img");

if (imgFile) {
    const img = new Image();
    img.src = `assets/images/art/${imgFile}`;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        historyStep = 0;
        ctx.beginPath();

        const frame = document.getElementById("frame");
        frame.style.aspectRatio = `${img.width} / ${img.height}`;
    }
}


let historyStep = 0;
let isDrawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', (e) => {
    if (isDrawing) draw(e);
    stopDrawing();
});

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
    }
    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
    }
});

document.getElementById("download").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

function startDrawing(e) {
    isDrawing = true;
    const pos = getPointerPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    e.preventDefault();
}

function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    ctx.closePath();

    history.splice(historyStep + 1);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyStep = history.length - 1;
}

function draw(e) {
    if (!isDrawing) return;

    const pos = getPointerPos(e);

    ctx.lineCap = 'round';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    e.preventDefault();
}

function undo() {
    console.log(historyStep);
    console.log(history);
    if (historyStep > 0) {
        historyStep--;
        ctx.putImageData(history[historyStep], 0, 0);
    }
}

function redo() {
    if (historyStep < history.length - 1) {
        historyStep++;
        ctx.putImageData(history[historyStep], 0, 0)
    }
} 

function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    return { x, y };
}
