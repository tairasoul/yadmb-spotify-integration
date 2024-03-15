import { dataResolver } from "yadmb-types/types/addonTypes";
import reg from "../defaultRegex.js";
import playdl, { SpotifyTrack } from "play-dl/dist/index.js";

export const songData: dataResolver = {
    name: "spotify",
    async available(url) {
        return reg.test(url);
    },
    priority: 0,
    async resolve(url, cache, invalidation) {
        const s_url = new URL(url);
        const s_id = s_url.pathname;
        if (invalidation)
            await cache.uncache("spotify-song-data", s_id);
        const data = await cache.get("spotify-song-data", s_id);
        if (data) {
            return {
                url: data.extra.url,
                title: data.title
            }
        }
        if (playdl.is_expired()) await playdl.refreshToken();
        const sp = await playdl.spotify(url);
        if (!(sp instanceof SpotifyTrack)) {
            return `Spotify url ${url} is not a spotify track!`;
        }
        await cache.cache("spotify-song-data", {
            id: s_id,
            title: sp.name,
            extra: {
                url: sp.url
            }
        })
        return {
            url: sp.url,
            title: sp.name
        }
    }
}