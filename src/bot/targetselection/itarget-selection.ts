import { ITarget } from "../targets/itarget";

export interface ITargetSelection {
    exec(): ITarget;
    reset(): void;
}