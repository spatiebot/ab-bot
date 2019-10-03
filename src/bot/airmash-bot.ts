import { IAirmashEnvironment } from "./airmash/iairmash-environment";
import { SteeringInstallation } from "./steering/steering-installation";
import { BotCharacter } from "./bot-character";
import { Score } from "./airmash/score";
import { TargetSelection } from "./targets/target-selection";

export class AirmashBot {

    static current: AirmashBot;

    private readonly steeringInstallation: SteeringInstallation;
    private readonly targetSelection: TargetSelection;
    private aircraftType: number;
    private isSpawned: boolean;
    
    constructor(private env: IAirmashEnvironment, private character: BotCharacter = null) {

        this.env.on('spawned', (x) => this.onSpawned(x));
        this.env.on('playerkilled', (x) => this.onPlayerKilled(x));
        this.env.on('error', (x) => this.onError(x));
        this.env.on('tick', () => this.onTick());
        this.env.on('chat', (msg) => this.onChat(msg));

        this.steeringInstallation = new SteeringInstallation(this.env);
        this.targetSelection = new TargetSelection(this.env, this.character);

        AirmashBot.current = this;
    }

    start(name: string, flag: string, aircraftType: number) {
        this.env.startMainLoop();
        this.aircraftType = aircraftType;
        this.env.joinGame(name, flag);
    }

    private onSpawned(data: any) {
        setTimeout(()=>this.onEnvironmentReady(data), 100);
    }

    private onEnvironmentReady(data): void {

        if (data.id !== this.env.myId()) {
            return;
        }

        console.log("i spawned");

        if (this.env.me().type !== this.aircraftType) {
            console.log("... in the wrong body. Respawning as a different aircraft...");
            setTimeout(() => this.env.selectAircraft(this.aircraftType), 2000);
            return;
        }

        this.isSpawned = true;

        const myType = this.env.me().type;
        if (!this.character || this.character.type !== 0 && this.character.type !== myType) {
            console.log('new char selected because this character is not my type');
            this.character = BotCharacter.get(myType);
        }
        this.steeringInstallation.start();
    }

    private onChat(msg) {
        const p = this.env.getPlayer(msg.id);
        const name = p ? p.name : "unknown";
        console.log("Chat: " + name + ": " + msg.text);
    }

    private onTick() {
        if (!this.isSpawned) {
            return;
        }

        const target = this.targetSelection.getTarget();
        const instructions = target.getInstructions();
        for (let i of instructions) {
            this.steeringInstallation.add(i.getSteeringInstruction());
        }
    }

    private onPlayerKilled(data: any) {
        if (data.killedID === this.env.myId()) {
            console.log('I was killed or removed from the game');
            this.isSpawned = false;
            this.steeringInstallation.stop();
        } else if (data.killerID === this.env.myId()) {
            const other = this.env.getPlayer(data.killedID);
            const otherName = !!other ? other.name : "an unknown player";
            console.log("I killed " + otherName);
        }
    }

    private onError(data: any) {
        console.log('Error', data);
        this.env.stopMainLoop();
        this.steeringInstallation.stop();
    }
}