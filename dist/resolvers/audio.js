import { createAudioResource } from "@discordjs/voice";
import playdl from "play-dl/dist/index.js";
import reg from "../defaultRegex.js";
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
const addon = {
    name: "Spotify Audio Resolvers",
    description: "Audio resolvers for yadmb-spotify-integration.",
    credits: "tairasoul",
    version: "1.0.0",
    type: "audioResourceResolver",
    sources: [
        "https://github.com/tairasoul/YADMB/blob/main/src/resolvers/audio.ts"
    ],
    resourceResolvers: [
        {
            name: "main-resolver",
            priority: 0,
            async available(url) {
                return reg.test(url);
            },
            async resolve(url) {
                if (playdl.is_expired())
                    await playdl.refreshToken();
                const info = await playdl.spotify(url);
                const searched = await playdl.search(info.name, { limit: 1 });
                const stream = await playdl.stream(searched[0].url);
                const resource = createAudioResource(stream.stream, {
                    inputType: stream.type
                });
                const thumbnail = info.thumbnail != undefined ? info.thumbnail.url : getHighestResUrl(searched[0]);
                let artistString = "";
                for (let i = 0; i < info.artists.length; i++) {
                    const artist = info.artists[i];
                    artistString += artist.name;
                    if (i != info.artists.length - 1)
                        artistString += ", ";
                }
                return {
                    resource,
                    info: {
                        channelName: artistString,
                        durationInMs: info.durationInMs,
                        likes: "Likes do not exist for Spotify tracks.",
                        views: "Views do not exist for Spotify tracks.",
                        highestResUrl: thumbnail
                    }
                };
            }
        }
    ]
};
export default addon;