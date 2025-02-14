export interface Match {
    teamA: string;
    goalsA: string | number;
    teamB: string;
    goalsB: string | number;
}

export interface TournamentBracket {
    roundOf16Left: Match[];
    quarterFinalsLeft: Match[];
    semiFinalsLeft: Match[];
    roundOf16Right: Match[];
    quarterFinalsRight: Match[];
    semiFinalsRight: Match[];
    final: Match;
}
