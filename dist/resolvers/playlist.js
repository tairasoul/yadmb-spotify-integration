import reg from "../defaultRegex.js";
import playdl, { SpotifyAlbum, SpotifyPlaylist } from "play-dl/dist/index.js";
const addon = {
    name: "Spotify Playlist Resolvers",
    description: "Playlist resolvers for yadmb-spotify-integration.",
    credits: "tairasoul",
    version: "1.0.0",
    type: "playlistDataResolver",
    sources: [
        "https://github.com/tairasoul/YADMB/blob/main/src/resolvers/playlist.ts"
    ],
    playlistResolvers: [
        {
            name: "spotify",
            async available(url) {
                return reg.test(url);
            },
            priority: 0,
            async resolve(url) {
                if (playdl.is_expired())
                    await playdl.refreshToken();
                const returnVal = {
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
                        });
                    }
                }
                else {
                    return `Spotify url ${url} is not a Spotify album or playlist.`;
                }
                return returnVal;
            }
        }
    ],
    private: true
};
export default addon;
