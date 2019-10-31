# AB-Bot

This is a nodejs Airmash bot API + implementation based on the wight Airbattle API.

The bots can do FFA and CTF.  

In CTF one bot will appoint one player as the leader, who can issue commands to manage the bots, mostly compatible with the commands of the existing CTF bots.

A CTF bot can be #leader of the other bots  

In FFA it can also run as a protecting bot, sticking to a player and defending the player from enemies.  

# Building
You'll need Node v12 or more, and the gulp-cli.

1. clone repository and submodule (`git clone --recurse-submodules git://github.com/spatiebot/ab-bot.git`)
2. `npm i`
3. `gulp`

# Running 

`node dist/app.js --ws=euCtf --num=5`

(this starts 5 bots in eu ctf.)

Parameters:

    --num: the number of bots. Default = 1
    --type: the type of aircraft used. Default = random
    --flag: the flag. Default = random
    --name: name of the bot. Default = random firstname based on the flag, prefixed by [b]_ for bot
    --ws: websocket to connect to. Use the full url or one of the shortcuts:  
        local: "ws://127.0.0.1:3501/ffa",
        euFfa1: "wss://eu.airmash.online/ffa1",
        euFfa2: "wss://eu.airmash.online/ffa2",
        euCtf: "wss://lags.win/ctf",
        usFfa: "wss://game.airmash.steamroller.tk/ffa",
        usCtf: "wss://game.airmash.steamroller.tk/ctf"
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

    --noTeamCoordinator: will only listen to an other team coordinator (can be used to hosts bot on different servers)
    --dev: will log with pretty logging. Default: false.
    --level: the loglevel. Default: warn.

# CTF behavior and commands

## Bot behavior

In the default mode (auto), the bots will split up between defending and attacking. 

Defenders will stick to the flag, attack intruders, and try to recover if the flag was taken or displaced.

Attackers will try to grab the enemy flag, and protect the flag carrier if the flag was taken.

## Team leader selection

Commands to the bots can only be issued by the team leader. When the bots join, at the start of each game, and each 10 minutes an election will be held to select the team leader. You can propose yourself as team leader by saying #yes during an election. Other people can vote for you during the election by saying #vote (name).

If a bot is selected as team leader, it will direct the bots into an aggressive mode, only being more defensive if the enemy has 2 points already.

You can challenge an existing team leader, see below.

## Commands

Commands are issued in the team chat (or public chat, or whispering, whatever you like).

Commands are always prefixed by a # sign.

**#def, #defend, #recap, #recover**  
Any of these commands will switch all bots to "D"-mode, defending the base and recapturing the flag.

**#cap, #capture, #escort**  
Any of these commands will switch all bots to "A"-mode; they will try to grab the enemy flag and escort the flag carrier.

**#auto**  
The default mode will be activated: bots will be split up between A and D mode.  

**#assist, #protect**  
Needs the playername as parameter, or "me" as a shortcut for the speaker.  
Example: `#assist Spatie`  
Will go to the player requesting assistance and defend him: in case of "me" the team leader, otherwise the mentioned player. 

**#drop**  
If one of the bots is carrying the flag, this command will make the bot fly towards you and drop the flag at your feet. It will only do so if you're within reach, and it will only try to do so for 10 seconds.  
This is one of the commands that non-team leaders can issue.

**#type**  
Needs a number or "random" as parameter. Makes the bot switch to a given aircraft type. Example: `#type 2` will make the bots switch to Goliaths. Use `#type random` to make them select a random aircraft. 

**#leader**  
Needs the playername as parameter. Makes the mentioned player the new leader. You can't make the masterbot the leader, because he will be muted
for spamming if you do. Example: `#leader rookie`.

**#leader-challenge**  
This will call for the leader to reply. If (s)he doesn't reply after 30 seconds, a new election is held. This command can only be issued 2.5 minutes after the previous one / an election, and not within 1 minute of an upcoming election. Bots should never reply to the challenge.  
This is one of the commands that non-team leaders can issue.

