import playdl from "play-dl/dist/index.js";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
const __dirname = path.dirname(decodeURIComponent(fileURLToPath(import.meta.url)));

playdl.authorization();

(async () => {
    const data = path.join(__dirname, "..", ".data");

    while (!fs.existsSync(data)) {
        await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    };
    
    fs.cpSync(data, path.join(__dirname, "..", "..", "..", ".data"), {recursive: true});
    fs.rmSync(data, {recursive: true});
})()