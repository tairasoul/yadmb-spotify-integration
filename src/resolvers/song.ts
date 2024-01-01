import { AddonInfo } from "yadmb-types/types/addonTypes";
import reg from "../defaultRegex.js";
import playdl, { SpotifyTrack } from "play-dl/dist/index.js";

const addon: AddonInfo = {
    name: "Spotify Song Data Resolvers",
    description: "Song data resolvers for yadmb-spotify-integration.",
    credits: "tairasoul",
    version: "1.0.0",
    type: "songDataResolver",
    sources: [
        "https://github.com/tairasoul/YADMB/blob/main/src/resolvers/song.ts"
    ],
    dataResolvers: [
        {
            name: "spotify",
            async available(url) {
                return reg.test(url);
            },
            priority: 0,
            async resolve(url) {
                if (playdl.is_expired()) await playdl.refreshToken();
                const sp = await playdl.spotify(url);
                if (!(sp instanceof SpotifyTrack)) {
                    return `Spotify url ${url} is not a spotify track!`;
                }
                return {
                    url: sp.url,
                    title: sp.name
                }
            }
        }
    ]
}

export default addon;