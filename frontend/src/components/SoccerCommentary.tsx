import { useEffect, useState } from "react";

const preKickoffPhrases = [
    "The crowd is roaring, and the match is about to begin!",
    "Players take their positions… The referee blows the whistle!",
    "And we’re off! Let’s see who will dominate the pitch today.",
    "The stadium is electric! Let the game begin!",
    "Both teams are warming up—who will have the upper hand?",
    "Tension is building… the players are ready!",
    "The fans are chanting, the atmosphere is electric!",
    "A strong start is crucial—who will take control first?",
    "Every pass, every movement, every second counts!",
    "The teams exchange handshakes—sportsmanship at its finest.",
    "The referee signals the start—let’s play some football!",
    "The captains exchange a few last words before kickoff.",
    "Both coaches are shouting last-minute instructions!",
    "The players take a deep breath—focus is key.",
    "The opening whistle is moments away!",
    "The energy in the stadium is unreal!",
    "The fans are waving their scarves, ready for the action.",
    "The players huddle up—one last pep talk.",
    "The referee checks his watch… any second now!",
    "Excitement is in the air—who will make history today?",
    "A beautiful day for football, perfect conditions for a match!",
    "The formations are set—tactics will play a huge role!",
    "The ball is placed at the center circle—kickoff imminent!",
    "A new rivalry is born today—who will emerge victorious?",
    "The announcer hypes up the crowd—let's get ready!",
    "The players look focused and determined!",
    "The tension is almost unbearable!",
    "Cameras flash as history is about to unfold!",
    "This is it! The moment we've all been waiting for!"
];

const matchPhrases = [
    "What a pass! This could turn into something special!",
    "A brilliant dribble! Can they break through the defense?",
    "The goalkeeper stands firm—what a save!",
    "He shoots… and the crowd holds its breath!",
    "Off the crossbar! So close yet so far!",
    "Only minutes left! Can they hold on to the lead?",
    "The referee checks his watch—any moment now!",
    "A dangerous free kick—can they make it count?",
    "The ball is whipped in—who’s getting the header?",
    "A rocket of a shot! The keeper needs to be ready!",
    "A golden chance from the penalty spot!",
    "Perfectly delivered corner—will it lead to a goal?",
    "The wall jumps… but is it enough?",
    "A tricky set-piece routine—will it catch them off guard?",
    "The midfield is like a chessboard—every move matters!",
    "Patient build-up play… waiting for the perfect opening.",
    "Quick one-twos—this team is playing beautiful football!",
    "The defense is rock solid! Can they be broken down?",
    "They’re pressing high, putting the opposition under pressure!",
    "A well-timed tackle stops a dangerous attack!",
    "A clever switch of play—spreading the field wide!",
    "That was a textbook interception—defense at its best!",
    "They’ve stolen the ball—here comes the counterattack!",
    "Lightning-fast break! The defense is scrambling!",
    "A crucial block! That was heading straight for goal!",
    "They’re parking the bus—can they hold on?",
    "A last-ditch tackle saves the day!",
    "The defenders are throwing their bodies on the line!",
];

const winning = [
    "They’re in complete control of the game!",
    "What a dominant performance! They’re unstoppable!",
    "The opposition can’t keep up with their pace!",
    "Another incredible pass—this team is on fire!",
    "They’re pressing high, completely overwhelming their rivals!",
    "Everything is clicking—this is championship-level football!",
    "They’re playing with confidence and flair!",
    "One step closer to victory! The fans are loving it!",
    "They’re not just winning, they’re putting on a show!",
    "Another perfectly timed tackle—defense is rock solid!",
    "They are moving the ball effortlessly across the pitch!",
    "The opposition is running out of ideas against this defense!",
    "Total control of the midfield, dictating the pace of the game!",
    "The fans are chanting their names—what a display!",
    "The clock is ticking, and they are cruising to victory!",
    "They’re toying with the opposition now!",
    "Another goal would seal the deal—they’re pushing forward!",
    "The captain leads by example—what an inspiring performance!",
    "This team is proving why they’re the best!",
    "The opposition looks defeated—this match is theirs to win!",
    "They’re relentless, attacking wave after wave!",
    "A true masterclass in football strategy!",
    "They’re dictating the game from start to finish!",
    "Just a few minutes away from a famous victory!",
    "They’ve left the opposition in the dust!",
    "The fans are celebrating already—this game is in the bag!",
    "What a statement performance! This team means business!",
    "One more goal would put the icing on the cake!",
    "A heroic display from every player on the pitch!",
]

const victoryToNextRound = [
    "Victory! They advance with a solid performance!",
    "They've done just enough to keep moving forward!",
    "A crucial win—onto the next challenge!",
    "The team takes a step closer to glory!",
    "A job well done—they’re through to the next stage!",
    "Victory secured—now it's time to focus on what's next!",
    "The next round is waiting—what a way to qualify!",
    "The journey continues—on to the next chapter!",
    "They've passed the test—onto the next round!",
    "The fans cheer as the team moves forward!",
    "A steady performance that takes them to the next stage!",
    "The road to glory gets longer—onto the next round!",
    "On to the next one! This win keeps their dreams alive!",
    "A step closer to the ultimate prize—let’s go to the next round!",
    "The team progresses with confidence and determination!",
    "Another round awaits—their journey isn’t over yet!",
    "The coach is pleased—this win sets up the next big match!",
    "The challenge isn’t over yet, but they've cleared this hurdle!",
    "Next round, here they come!"
];

const advanceOnPenalties = [  // Penalty Shootout Victory Commentary
    "Nerves of steel! They win it on penalties!",
    "The final shot hits the net—THEY HAVE DONE IT!",
    "The goalkeeper’s save seals the victory!",
    "Ice-cold from the spot! They triumph in the shootout!",
    "They hold their nerve and advance on penalties!",
    "Pure drama! The penalty shootout ends in their favor!",
    "What a rollercoaster! They win it from the spot!",
    "The last kick decides it—it’s victory for them!",
    "From the penalty spot to the next round—what a moment!",
    "The pressure was immense, but they delivered!",
    "Their accuracy from the spot makes the difference!",
    "The stadium erupts—they survive the penalty drama!",
    "A nail-biting shootout ends in celebration!",
    "They kept their composure, and now they celebrate!",
    "Unbelievable tension, unforgettable victory!",
    "A heroic performance in the shootout secures the win!",
    "The keeper is the hero! A crucial save wins it!",
    "Every penalty counted, and they did it!",
    "A test of nerves, a triumph of skill—they go through!",
    "From heartbreak to joy—they win the shootout!"
];



export type CommentaryType = 'winning' | 'playing' | 'victoryToNextRound' | 'advanceOnPenalties'

type SoccerCommentaryProps = {
    start: number
    commentaryType: CommentaryType
}

const SoccerCommentary = ({ start, commentaryType }: SoccerCommentaryProps) => {
    const [phrase, setPhrase] = useState<string>('');

    useEffect(() => {
        if (commentaryType === 'advanceOnPenalties') {
            const randomIndex = Math.floor(Math.random() * advanceOnPenalties.length);
            setPhrase(advanceOnPenalties[randomIndex]);
            return
        }
        const interval = setInterval(() => {
            const timePassed = (Date.now() - start) / 1000;
            console.log(`timePassed = ${timePassed};`)
            if (commentaryType === 'victoryToNextRound' && timePassed > 150 && timePassed < 300) {
                const randomIndex = Math.floor(Math.random() * victoryToNextRound.length);
                setPhrase(victoryToNextRound[randomIndex]);
                return
            }
            if (timePassed < 30) {
                const randomIndex = Math.floor(Math.random() * preKickoffPhrases.length);
                setPhrase(preKickoffPhrases[randomIndex]);
            } else if (timePassed < 500) {
                const randomIndex = Math.floor(Math.random() * matchPhrases.length);
                setPhrase(matchPhrases[randomIndex]);
            } else if ((commentaryType === 'winning' || commentaryType === 'victoryToNextRound') && timePassed < 500) {
                const randomIndex = Math.floor(Math.random() * winning.length);
                setPhrase(winning[randomIndex]);
            } else {
                setPhrase('');
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-2 text-xl font-bold text-center bg-white">
            {phrase}
        </div>
    );
};

export default SoccerCommentary;
