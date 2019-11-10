import { Calculations } from './bot/calculations';
import { BotIdentity } from './bot-identity';

let lastAircraftType = 0;
// const flagCodes = ['communist', 'imperial', 'rainbow', 'jolly', 'nl', 'be', 'de', 'fr', 'cz', 'fi',
//     'hu', 'lv', 'lt', 'md', 'pt', 'ro', 'rs', 'sk', 'ch', 'tr', 'ua', 'gb', 'al', 'at', 'ba', 'by', 'bg',
//     'hr', 'cy', 'dk', 'ee', 'gr', 'is', 'il', 'it', 'mk', 'no', 'pl', 'ru', 'si', 'es', 'se'];

const localesForFlag = {
    au: 'en_AU',
    ca: 'en_CA',
    nl: 'nl',
    be: 'nl',
    de: 'de',
    fr: 'fr',
    // cz: 'cz',
    pt: 'pt_BR',
    // sk: 'sk',
    ch: 'de_CH',
    // tr: 'tr',
    gb: 'en_GB',
    at: 'de_AT',
    it: 'it',
    no: 'nb_NO',
    // pl: 'pl',
    // ru: 'ru',
    es: 'es',
    se: 'sv',
    us: 'en_US',
    // communist: 'zh_CN',
    // imperial: 'ja'
};
const flagCodes = Object.keys(localesForFlag);

export class BotIdentityGenerator {

    constructor(private flagConfig: string, private planeTypeConfig: string, private nameConfig: string) {
    }

    generateIdentity(): BotIdentity {
        let aircraftType: number;
        let flag: string;
      
        if (this.flagConfig === 'random') {
            flag = flagCodes[Calculations.getRandomInt(0, flagCodes.length)];
        } else {
            flag = this.flagConfig;
        }

        if (this.planeTypeConfig === 'random') {
            aircraftType = Calculations.getRandomInt(1, 6);
        } else if (this.planeTypeConfig === 'distribute') {
            lastAircraftType = lastAircraftType + 1;
            if (lastAircraftType === 6) {
                lastAircraftType = 1;
            }
            aircraftType = lastAircraftType;
        } else {
            aircraftType = Number(this.planeTypeConfig);
        }

        let lang = localesForFlag[flag];
        if (!lang) {
            lang = localesForFlag[flagCodes[Calculations.getRandomInt(0, flagCodes.length)]];
        }

        const x = require('faker/locale/' + lang);
        const name = this.nameConfig || x.name.firstName() + "_";

        return {
            name,
            aircraftType,
            flag
        };
    }

}