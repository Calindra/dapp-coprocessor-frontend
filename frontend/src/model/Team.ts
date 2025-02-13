import { Player } from "./Player";

export type Team = {
    name: string;
    goalkeeper: Player;
    defense: Player[];
    middle: Player[];
    attack: Player[];
    bench: Player[];
};