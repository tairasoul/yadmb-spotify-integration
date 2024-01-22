import { dataResolver } from "yadmb-types/types/addonTypes";
import reg from "../defaultRegex.js";
import playdl, { SpotifyTrack } from "play-dl/dist/index.js";

export const songData: dataResolver = {
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