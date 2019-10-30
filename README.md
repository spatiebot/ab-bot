# ab-bot

This is an Airmash bot API + implementation based on the wight Airbattle API.

The bot can do FFA and CTF.  

In CTF one bot will appoint one player as the leader, who can issue commands to manage the bots, mostly compatible with the commands of the existing CTF bots.

A CTF bot can be #leader of the other bots  

In FFA it can also run as a protecting bot, sticking to a player and defending the player from enemies.  

To run the bot, you need Node v12 or more, and (to build it) the gulp-cli.

1. clone repository and submodule (`git clone --recurse-submodules git://github.com/spatiebot/ab-bot.git`)
2. npm i
3. gulp
4. node dist/app.js --ws=euCtf --num=5

(this starts 5 bots in eu ctf.)

Parameters:

    --num: the number of bots. Default = 1
    --type: the type of aircraft used. Default = random
    --flag: the flag. Default = random
    --name: name of the bot. Default = random, based on flag.
    --ws: websocket to connect to. Use the full url or one of the shortcuts:

        local: "ws://127.0.0.1:3501/ffa",
        euFfa: "wss://eu.airmash.online/ffa",
        euFfa2: "wss://eu-airmash1-foo.westeurope.cloudapp.azure.com/ffa",
        euCtf: "wss://lags.win/ctf",
        euCtf2: "wss://eu-airmash1-foo.westeurope.cloudapp.azure.com/ctf",
        euCtf3: "wss://eu.airmash.online/ctf",
        fooDev: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?1",
        ukDev: "wss://uk.test.airmash.online/dev",
        usFfa: "wss://game.airmash.steamroller.tk/ffa",
        usCtf: "wss://game.airmash.steamroller.tk/ctf",
        usDev: "wss://game.airmash.steamroller.tk/dev"

    Default is euFfa.

    --character: characteristics of this bot. Default a character will be selected based on type. Available characters:
        - Goli
        - Mohawk
        - Tornado
        - Prowler
        - Default
        - Aggressive
        - Shy
        - Protective (will listen to '#protect me' commands)

