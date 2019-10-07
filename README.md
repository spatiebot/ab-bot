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

