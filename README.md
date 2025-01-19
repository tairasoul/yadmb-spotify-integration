# yadmb-spotify-integration

An addon to allow for Spotify tracks to be played through [tairasoul/YADMB](https://github.com/tairasoul/YADMB)

## Initial setup

After putting the folder within yadmb-dir/addons or running git clone, you need to authenticate play-dl.

To authenticate, follow [instructions](https://github.com/play-dl/play-dl/tree/main/instructions#spotify) but run `node dist/auth.js` instead of creating `authorize.js`.

You have to choose `Yes` for saving to file, otherwise the auth won't work on the bot.
