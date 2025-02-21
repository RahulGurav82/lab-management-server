const net = require("net");
const fs = require("fs");
const express = require("express");

const app = express();
const cors = require('cors');
app.use(cors());

const port = 4000;
const imageDir = "screenshots"; // Directory for screen images

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

// Store latest images per PC
const latestImages = {};

// TCP Server to receive images from students
const server = net.createServer((socket) => {
    console.log("Student connected...");

    let metadataReceived = false;
    let labId = null;
    let pcNumber = null;

    socket.on("data", (data) => {
        if (!metadataReceived) {
            const metadataLength = data.readUInt32LE(0);
            if (data.length >= metadataLength + 4) {
                const metadata = data.slice(4, 4 + metadataLength).toString();
                [labId, pcNumber] = metadata.split("|");

                console.log(`Receiving screen from Lab ${labId}, PC ${pcNumber}`);
                metadataReceived = true;
            }
        } else {
            if (!latestImages[`${labId}_${pcNumber}`]) {
                latestImages[`${labId}_${pcNumber}`] = Buffer.alloc(0);
            }
            latestImages[`${labId}_${pcNumber}`] = Buffer.concat([latestImages[`${labId}_${pcNumber}`], data]);

            // Extract image when length matches
            if (latestImages[`${labId}_${pcNumber}`].length > 4) {
                const imgSize = latestImages[`${labId}_${pcNumber}`].readUInt32LE(0);
                if (latestImages[`${labId}_${pcNumber}`].length >= imgSize + 4) {
                    const imageData = latestImages[`${labId}_${pcNumber}`].slice(4, imgSize + 4);
                    const imagePath = `${imageDir}/${labId}_${pcNumber}.jpg`;

                    fs.writeFileSync(imagePath, imageData);
                    latestImages[`${labId}_${pcNumber}`] = null;
                }
            }
        }
    });

    socket.on("close", () => console.log("Student disconnected."));
});

server.listen(4000, () => console.log("Listening for students on port 4000"));

// Serve MJPEG Stream per PC
app.get("/stream/:labId/:pcNumber", (req, res) => {
    const { labId, pcNumber } = req.params;
    const imagePath = `${imageDir}/${labId}_${pcNumber}.jpg`;

    res.writeHead(200, { "Content-Type": "multipart/x-mixed-replace; boundary=frame" });

    setInterval(() => {
        if (fs.existsSync(imagePath)) {
            const frame = fs.readFileSync(imagePath);
            res.write(`--frame\r\nContent-Type: image/jpeg\r\n\r\n`);
            res.write(frame);
            res.write("\r\n");
        }
    }, 100);
});

app.listen(8080, () => console.log("MJPEG Stream available at http://localhost:8080/stream/{labId}/{pcNumber}"));
