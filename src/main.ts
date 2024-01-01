import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import { AddonInfo } from "yadmb-types/types/addonTypes";
const __dirname = path.dirname(decodeURIComponent(fileURLToPath(import.meta.url)));

const resolversDir = path.join(__dirname, "resolvers");

const AddonsRegistered: AddonInfo[] = [];

for (const dir of fs.readdirSync(resolversDir)) {
    const info: AddonInfo = await import(`file://${resolversDir}/${dir}`).then(m => m.default);
    AddonsRegistered.push(info);
}

export default AddonsRegistered;