interface GameResultProps {
    goalsA: string
    goalsB: string
    teamBName: string
}
const GameResult = ({ goalsA, goalsB, teamBName }: GameResultProps) => {
    if (!goalsA && !goalsB) {
        return <></>
    }
    return (<div className="flex justify-center w-full mt-4">
        <div className="text-xl font-bold bg-secondary px-6 py-2 rounded-lg">
            England {goalsA} x {goalsB} {teamBName}
        </div>
    </div>
    )
}

export default GameResult