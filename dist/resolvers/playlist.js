import reg from "../defaultRegex.js";
import playdl, { SpotifyAlbum, SpotifyPlaylist } from "play-dl/dist/index.js";
export const playlist = {
    name: "spotify",
    async available(url) {
        return reg.test(url);
    },
    priority: 0,
    async resolve(url, cache) {
        if (playdl.is_expired())
            await playdl.refreshToken();
        const returnVal = {
            title: "temp",
            items: [],
            url: url
        };
        const sp = await playdl.spotify(url);
        const data = await cache.get("spotify-playlist-data", sp.id);
        if (data) {
            returnVal.title = data.title;
            const tracks = data.extra.tracks;
            for (const track of tracks) {
                returnVal.items.push({
                    title: track.name,
                    url: track.url
                });
            }
        }
        else {
            if (sp instanceof SpotifyAlbum || sp instanceof SpotifyPlaylist) {
                returnVal.title = sp.name;
                for (const track of await sp.all_tracks()) {
                    returnVal.items.push({
                        title: track.name,
                        url: track.url
                    });
                }
            }
            else {
                return `Spotify url ${url} is not a Spotify album or playlist.`;
            }
        }
        return returnVal;
    }
};
