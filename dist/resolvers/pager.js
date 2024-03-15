import reg from "../defaultRegex.js";
import playdl, { SpotifyAlbum } from "play-dl/dist/index.js";
import humanizeDuration from "humanize-duration";
import * as builders from "@oceanicjs/builders";
function getHighestResUrl(data) {
    const thumbnails = data.thumbnails;
    let highestX = 0;
    let highestY = 0;
    let currentHighestUrl = "";
    for (const thumbnail of thumbnails) {
        if (thumbnail.width > highestX && thumbnail.height > highestY) {
            currentHighestUrl = thumbnail.url;
        }
    }
    return currentHighestUrl;
}
export const pager = {
    name: "spotify",
    priority: 0,
    async available(url) {
        return reg.test(url);
    },
    async queuedPager(track, index, cache, invalidation) {
        const id = (new URL(track.tracks[0].url)).pathname;
        if (invalidation)
            await cache.uncache("spotify-qpager-data", id);
        const data = await cache.get("spotify-qpager-data", id);
        const embed = new builders.EmbedBuilder();
        embed.setTitle(track.name);
        if (data) {
            embed.addField("index", index.toString(), true);
            embed.addField("type", track.type, true);
            embed.addField("songs", track.tracks.length.toString(), true);
            embed.setImage(data.extra.thumbnail);
        }
        else {
            if (playdl.is_expired())
                await playdl.refreshToken();
            embed.addField("index", index.toString(), true);
            embed.addField("type", track.type, true);
            embed.addField("songs", track.tracks.length.toString(), true);
            const sp = await playdl.spotify(track.tracks[0].url) || SpotifyAlbum;
            let thumbnail = sp.thumbnail?.url;
            if (thumbnail == null) {
                const search = await playdl.search(`${sp.name} - ${sp.owner.name}`, { limit: 0 });
                thumbnail = getHighestResUrl(search[0]);
            }
            embed.setImage(thumbnail);
            await cache.cache("spotify-qpager-data", {
                id,
                title: track.name,
                extra: {
                    thumbnail
                }
            });
        }
        return {
            id: track.name,
            type: track.type,
            index,
            embed
        };
    },
    async trackPager(track, index, cache, invalidation) {
        const id = (new URL(track.url)).pathname;
        if (invalidation)
            await cache.uncache("spotify-pager-data", id);
        const data = await cache.get("spotify-pager-data", id);
        const embed = new builders.EmbedBuilder();
        embed.setTitle(track.name);
        if (data) {
            embed.addField("Author(s)", data.extra.artists.join());
            embed.addField("Duration", humanizeDuration(data.extra.durationInSec * 1000));
            embed.setImage(data.extra.thumbnail);
        }
        else {
            if (playdl.is_expired())
                await playdl.refreshToken();
            const sp = await playdl.spotify(track.url);
            embed.addField("Author(s)", sp.artists.map((artist) => artist.name).join());
            embed.addField("Duration", humanizeDuration(sp.durationInSec * 1000));
            let thumbnail = sp.thumbnail?.url;
            if (thumbnail == null) {
                const search = await playdl.search(`${sp.name} - ${sp.artists.join()}`, { limit: 0 });
                thumbnail = getHighestResUrl(search[0]);
            }
            embed.setImage(thumbnail);
            await cache.cache("spotify-pager-data", {
                id,
                title: track.name,
                extra: {
                    thumbnail,
                    artists: sp.artists.map((artist) => artist.name),
                    durationInSec: sp.durationInSec
                }
            });
        }
        return {
            id: track.name,
            type: "song",
            index,
            embed
        };
    }
};
