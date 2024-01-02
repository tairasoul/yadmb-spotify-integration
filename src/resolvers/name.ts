import { AddonInfo } from "yadmb-types/types/addonTypes"
import reg from "../defaultRegex.js";

const addon: AddonInfo = {
    name: "Spotify Name Resolvers",
    description: "Name resolvers for yadmb-spotify-integration.",
    credits: "tairasoul",
    version: "1.0.0",
    type: "songResolver",
    sources: [
        "https://github.com/tairasoul/YADMB/blob/main/src/resolvers/name.ts"
    ],
    resolvers: [
        {
            name: "spotify",
            async available(url) {
                return reg.test(url);
            },
            priority: 0,
            async resolve(url) {
                return "spotify";
            }
        }
    ],
    private: true
}

export default addon;