import { AddonInfo } from "yadmb-types/types/addonTypes";
import { audio } from "./resolvers/audio.js";
import { provider } from "./resolvers/name.js";
import { pager } from "./resolvers/pager.js";
import { playlist } from "./resolvers/playlist.js";
import { songData } from "./resolvers/song.js";

const addon: AddonInfo = {
    name: "Spotify Support",
    description: "Adds support for Spotify.",
    version: "1.1.0",
    credits: "tairasoul",
    sources: [
        "https://github.com/tairasoul/yadmb-spotify-integration"
    ],
    data: {
        resolvers: {
            audio: [audio],
            provider: [provider],
            pager: [pager],
            playlist: [playlist],
            songData: [songData]
        }
    }
}

export default addon;