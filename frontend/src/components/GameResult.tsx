interface GameResultProps {
    goalsA: string
    goalsB: string
}
const GameResult = ({ goalsA, goalsB }: GameResultProps) => {
    if (!goalsA && !goalsB) {
        return <></>
    }
    return (<div className="flex justify-center w-full mt-4">
        <div className="text-xl font-bold bg-secondary px-6 py-2 rounded-lg">
            Botafogo {goalsA} x {goalsB} Flamengo
        </div>
    </div>
    )
}

export default GameResult