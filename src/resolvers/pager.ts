import { AddonInfo } from "yadmb-types/types/addonTypes";
import reg from "../defaultRegex.js";
import playdl, { SpotifyTrack, YouTubeVideo } from "play-dl/dist/index.js";
import humanizeDuration from "humanize-duration";
import * as builders from "@oceanicjs/builders";

function getHighestResUrl(data: YouTubeVideo) {
    const thumbnails = data.thumbnails;
    let highestX = 0;
    let highestY = 0;
    let currentHighestUrl = "";
    for (const thumbnail of thumbnails) {
        if (thumbnail.width > highestX && thumbnail.height > highestY) {
            currentHighestUrl = thumbnail.url;
        }
    }
    return currentHighestUrl
}

const addon: AddonInfo = {
    name: "Spotify Pagers",
    description: "Pagers for yadmb-spotify-integration.",
    credits: "tairasoul",
    version: "1.0.0",
    type: "pagerAddon",
    sources: [
        "https://github.com/tairasoul/YADMB/blob/main/src/resolvers/pager.ts"
    ],
    pagers: [
        {
            name: "spotify",
            priority: 0,
            async available(url) {
                return reg.test(url);
            },
            async queuedPager(track, index) {
                if (playdl.is_expired()) await playdl.refreshToken();
                const embed = new builders.EmbedBuilder();
                embed.setTitle(track.name);
                embed.addField("index", index.toString(), true);
                embed.addField("type", track.type, true);
                embed.addField("songs", track.tracks.length.toString(), true);
                const sp = await playdl.spotify(track.tracks[0].url);
                let thumbnail = sp.thumbnail?.url;
                if (thumbnail == null) {
                    const search = await playdl.search(sp.name, {limit: 0});
                    thumbnail = getHighestResUrl(search[0]);
                }
                embed.setImage(thumbnail);
                return {
                    id: track.name,
                    type: track.type,
                    index,
                    embed
                }
            },
            async trackPager(track, index) {
                if (playdl.is_expired()) await playdl.refreshToken();
                const embed = new builders.EmbedBuilder();
                embed.setTitle(track.name);
                const sp = await playdl.spotify(track.url) as SpotifyTrack;
                let thumbnail = sp.thumbnail?.url;
                if (thumbnail == null) {
                    const search = await playdl.search(sp.name, {limit: 0});
                    thumbnail = getHighestResUrl(search[0]);
                }
                embed.setImage(thumbnail);
                embed.addField("Author", sp.artists.join());
                embed.addField("Duration", humanizeDuration(sp.durationInSec * 1000));
                return {
                    id: track.name,
                    type: "song",
                    index,
                    embed
                }
            }
        }
    ],
    private: true
}

export default addon;