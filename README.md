# ab-bot

This is a bot API + implementation based on the wight Airbattle API.

To run the bot:

1. clone repository and submodule (`git clone --recurse-submodules git://github.com/spatiebot/ab-bot.git`)
1. npm i
2. tsc
3. node dist/src/app.js --name=SomeBot --flag=eu

Parameters:

    --type: the type of aircraft used. Default = 1
    --flag: the flag. Default = eu
    --ws: websocket to connect to. Use the full url or one of the shortcuts:

        local: "ws://127.0.0.1:3501/ffa",
        steamDev: "wss://game.airmash.steamroller.tk/dev",
        steamFfa: "wss://game.airmash.steamroller.tk/ffa",
        euFfa: "wss://eu.airmash.online/ffa",
        euFfa2: "wss://eu-airmash1-foo.westeurope.cloudapp.azure.com/ffa",
        euCtf: "wss://eu.airmash.online/ctf",
        frCtf: "wss://lags.win/ctf",
        fooDev1: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?1",
        fooDev2: "ws://eu-airmash1-foo.westeurope.cloudapp.azure.com/dev?2"

    Default is euFfa.

    --character: characteristics of this bot. Default a character will be selected based on type. Available characters:
        - Goli
        - Mohawk
        - Tornado
        - Prowler
        - Default
        - Aggressive
        - Shy

