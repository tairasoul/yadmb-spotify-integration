import { playlistData, playlistResolver } from "yadmb-types/types/addonTypes";
import reg from "../defaultRegex.js";
import playdl, { SpotifyAlbum, SpotifyPlaylist } from "play-dl/dist/index.js";

export const playlist: playlistResolver = {
    name: "spotify",
    async available(url) {
        return reg.test(url);
    },
    priority: 0,
    async resolve(url) {
        if (playdl.is_expired()) await playdl.refreshToken();
        const returnVal: playlistData = {
            title: "temp",
            items: [],
            url: url
        };
        const sp = await playdl.spotify(url);
        if (sp instanceof SpotifyAlbum || sp instanceof SpotifyPlaylist) {
            returnVal.title = sp.name;
            for (const track of await sp.all_tracks()) {
                returnVal.items.push({
                    title: track.name,
                    url: track.url
                })
            }
        }
        else {
            return `Spotify url ${url} is not a Spotify album or playlist.`;
        }
        return returnVal;
    }
}