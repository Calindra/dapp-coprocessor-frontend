import { Match, TournamentBracket } from "../model/TournamentBracket";

const nullGoals = '?'

class TournamentService {
    cachedMatches: TournamentBracket | undefined

    initialize() {
        const matches: TournamentBracket = {
            round: 0,
            roundOf16Left: [
                { teamA: "Brazil", goalsA: nullGoals, teamB: "Argentina", goalsB: nullGoals },
                { teamA: "France", goalsA: nullGoals, teamB: "Germany", goalsB: nullGoals },
                { teamA: "Spain", goalsA: nullGoals, teamB: "Portugal", goalsB: nullGoals },
                { teamA: "Italy", goalsA: nullGoals, teamB: "Netherlands", goalsB: nullGoals }
            ],
            quarterFinalsLeft: [
                { teamA: "", goalsA: nullGoals, teamB: "", goalsB: nullGoals },
                { teamA: "", goalsA: nullGoals, teamB: "", goalsB: nullGoals }
            ],
            semiFinalsLeft: [
                { teamA: "", goalsA: nullGoals, teamB: "", goalsB: nullGoals }
            ],
            roundOf16Right: [
                { teamA: "England", goalsA: nullGoals, teamB: "Belgium", goalsB: nullGoals },
                { teamA: "Croatia", goalsA: nullGoals, teamB: "Denmark", goalsB: nullGoals },
                { teamA: "Switzerland", goalsA: nullGoals, teamB: "Poland", goalsB: nullGoals },
                { teamA: "Wales", goalsA: nullGoals, teamB: "Sweden", goalsB: nullGoals }
            ],
            quarterFinalsRight: [
                { teamA: "", goalsA: nullGoals, teamB: "", goalsB: nullGoals },
                { teamA: "", goalsA: nullGoals, teamB: "", goalsB: nullGoals }
            ],
            semiFinalsRight: [
                { teamA: "", goalsA: nullGoals, teamB: "", goalsB: nullGoals }
            ],
            final: {
                teamA: "", goalsA: '',
                teamB: "", goalsB: ''
            }
        };
        localStorage.setItem('matches', JSON.stringify(matches))
        this.cachedMatches = matches
        return matches
    }

    setResult(teamA: string, teamB: string, goalsA: string, goalsB: string, skipSave?: boolean) {
        const matches = this.getMatches();
        const roundNumber = matches.round;
        // Define all rounds in an array for indexed access
        const rounds: (Match[] | Match)[] = [
            matches.roundOf16Left.concat(matches.roundOf16Right),
            matches.quarterFinalsLeft.concat(matches.quarterFinalsRight),
            matches.semiFinalsLeft.concat(matches.semiFinalsRight),
            [matches.final]
        ];

        // Ensure the roundNumber is within valid bounds
        if (roundNumber < 0 || roundNumber >= rounds.length) {
            console.warn(`Invalid round number: ${roundNumber}`);
            return;
        }

        const round = rounds[roundNumber] as Match[];

        // Find and update the match
        const match = round.find(m =>
            (m.teamA === teamA && m.teamB === teamB) ||
            (m.teamA === teamB && m.teamB === teamA)
        );

        if (match) {
            match.goalsA = teamA === match.teamA ? goalsA : goalsB;
            match.goalsB = teamB === match.teamB ? goalsB : goalsA;

            // Determine winner
            let winner = "";
            if (parseInt(match.goalsB) > parseInt(match.goalsA)) {
                winner = match.teamB;
            } else {
                winner = match.teamA;
            }

            // If there's a next round, advance the winner
            const nextRoundNumber = roundNumber + 1;
            if (nextRoundNumber < rounds.length) {
                const nextRound = rounds[nextRoundNumber] as Match[];
                const matchIndex = Math.floor(round.indexOf(match) / 2);

                if (nextRound[matchIndex]) {
                    if (!nextRound[matchIndex].teamA) {
                        nextRound[matchIndex].teamA = winner;
                    } else {
                        nextRound[matchIndex].teamB = winner;
                    }
                }
            }

            // Save updated matches
            localStorage.setItem('matches', JSON.stringify(matches));
        } else {
            console.warn(`Match not found in round ${roundNumber}: ${teamA} vs ${teamB}`);
        }
    }


    fillMatchesResult() {
        const matches = this.getMatches();
        const roundNumber = matches.round;
        // Define all rounds in an array for indexed access
        const rounds: (Match[] | Match)[] = [
            matches.roundOf16Left.concat(matches.roundOf16Right),
            matches.quarterFinalsLeft.concat(matches.quarterFinalsRight),
            matches.semiFinalsLeft.concat(matches.semiFinalsRight),
            [matches.final]
        ];

        // Ensure the roundNumber is within valid bounds
        if (roundNumber < 0 || roundNumber >= rounds.length) {
            console.warn(`Invalid round number: ${roundNumber}`);
            return;
        }
        const round = rounds[roundNumber] as Match[];
        for (const match of round) {
            if (match.goalsA === nullGoals && match.goalsB === nullGoals) {
                console.log(`setResult`, match.teamA, match.teamB, matches.round, roundNumber)
                this.setResult(match.teamA, match.teamB, `${Math.floor(Math.random() * 5)}`, `${Math.floor(Math.random() * 5)}`, true)
            }
        }
        localStorage.setItem('matches', JSON.stringify(matches));
    }

    incRound() {
        const matches = this.getMatches();
        matches.round ++;
        localStorage.setItem('matches', JSON.stringify(matches));
        return matches.round;
    }

    getMatches(_round?: number): TournamentBracket {
        if (this.cachedMatches) {
            return this.cachedMatches
        }
        const json = localStorage.getItem('matches')
        if (json) {
            return this.cachedMatches = JSON.parse(json)
        }
        return this.initialize()
    }

    getNextAdversary(team: string, roundNumber: number): string | null {
        const matches = this.getMatches();

        // Define the rounds in order
        const rounds: (Match[] | Match)[] = [
            matches.roundOf16Left.concat(matches.roundOf16Right),
            matches.quarterFinalsLeft.concat(matches.quarterFinalsRight),
            matches.semiFinalsLeft.concat(matches.semiFinalsRight),
            [matches.final]
        ];

        // Ensure the round exists
        if (roundNumber < 0 || roundNumber >= rounds.length - 1) {
            return null;
        }

        const currentRound = rounds[roundNumber];
        const nextRound = rounds[roundNumber + 1];

        // Find the match where the team played
        const matchIndex = (currentRound as Match[]).findIndex(m => m.teamA === team || m.teamB === team);
        if (matchIndex === -1) return null; // Team not found in this round

        // Find the corresponding match in the next round
        const nextMatch = (nextRound as Match[])[Math.floor(matchIndex / 2)];
        if (!nextMatch) return null; // No match in the next round yet

        // Return the adversary (if it's already defined)
        if (nextMatch.teamA && nextMatch.teamA !== team) return nextMatch.teamA;
        if (nextMatch.teamB && nextMatch.teamB !== team) return nextMatch.teamB;

        return null; // Next opponent is not yet set
    }

    getCurrentAdversary(team: string): string | null {
        const matches = this.getMatches();
        const roundNumber = matches.round;
        const rounds: (Match[] | Match)[] = [
            matches.roundOf16Left.concat(matches.roundOf16Right),
            matches.quarterFinalsLeft.concat(matches.quarterFinalsRight),
            matches.semiFinalsLeft.concat(matches.semiFinalsRight),
            [matches.final]
        ];

        if (roundNumber < 0 || roundNumber >= rounds.length) {
            return null;
        }

        const currentRound = rounds[roundNumber] as Match[];
        if (!currentRound) return null;
        const match = currentRound.find(m => m.teamA === team || m.teamB === team);
        if (!match) return null;

        return match.teamA === team ? match.teamB : match.teamA;
    }
}

const tournamentService = new TournamentService()

export { tournamentService }