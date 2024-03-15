import { playlistData, playlistResolver } from "yadmb-types/types/addonTypes";
import reg from "../defaultRegex.js";
import playdl, { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack } from "play-dl/dist/index.js";

export const playlist: playlistResolver = {
    name: "spotify",
    async available(url) {
        return reg.test(url);
    },
    priority: 0,
    async resolve(url, cache, invalidation) {
        const returnVal: playlistData = {
            title: "temp",
            items: [],
            url: url
        };
        const id = (new URL(url)).pathname;
        if (invalidation)
            await cache.uncache("spotify-playlist-data", id);
        const data = await cache.get("spotify-playlist-data", id);
        if (data) {
            returnVal.title = data.title;
            const tracks = data.extra.tracks as SpotifyTrack[];
            for (const track of tracks) {
                returnVal.items.push({
                    title: track.name,
                    url: track.url
                })
            }
        }
        else {
            if (playdl.is_expired()) await playdl.refreshToken();
            const sp = await playdl.spotify(url);
            if (sp instanceof SpotifyAlbum || sp instanceof SpotifyPlaylist) {
                returnVal.title = sp.name;
                const tracks = await sp.all_tracks();
                for (const track of tracks) {
                    returnVal.items.push({
                        title: track.name,
                        url: track.url
                    })
                }
                await cache.cache("spotify-playlist-data", {
                    id: id,
                    title: sp.name,
                    extra: {
                        tracks
                    }
                })
            }
            else {
                return `Spotify url ${url} is not a Spotify album or playlist.`;
            }
        }
        return returnVal;
    }
}