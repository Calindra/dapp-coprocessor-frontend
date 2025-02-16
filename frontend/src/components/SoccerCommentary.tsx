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

type SoccerCommentaryProps = {
    start: number
}

const SoccerCommentary = ({ start }: SoccerCommentaryProps) => {
    const [phrase, setPhrase] = useState<string>('');

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(`start = ${start}`)
            const timePassed = (Date.now() - start) / 1000;
            if (timePassed < 30) {
                const randomIndex = Math.floor(Math.random() * preKickoffPhrases.length);
                setPhrase(preKickoffPhrases[randomIndex]);
            } else if (timePassed < 180) {
                const randomIndex = Math.floor(Math.random() * matchPhrases.length);
                setPhrase(matchPhrases[randomIndex]);
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
