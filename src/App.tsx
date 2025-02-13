// import './App.css'
// import SoccerTeamManager from './views/SoccerTeamManager'

// function App() {
//   return (
//     <>
//       <SoccerTeamManager />
//     </>
//   )
// }

// export default App
import { ethers } from 'ethers'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { footballTeamAbi } from './FootballTeamABI'

import { Users } from 'lucide-react'
import './App.css'
import { PlayerCard } from './components/PlayerCard'
import { PlayerSection } from './components/PlayerSection'
import { Badge } from './components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

// Define a type for a player.
interface Player {
  name: string
  level: number
}

// Replace with your deployed FootballTeam contract address.
const CONTRACT_ADDRESS = '0xYourFootballTeamContractAddress'

const App: React.FC = () => {
  // State variables with proper TypeScript types.
  const [teamId, setTeamId] = useState<number>(1)
  const [teamName, setTeamName] = useState<string>('')
  const [goalkeeper, setGoalkeeper] = useState<Player>({ name: '', level: 0 })
  const [defense, setDefense] = useState<Player[]>([])
  const [middle, setMiddle] = useState<Player[]>([])
  const [attack, setAttack] = useState<Player[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      if (!window.ethereum) {
        alert('Please install MetaMask to use this application.')
        return
      }
      // Request account access if needed.
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, footballTeamAbi, provider)

      // Fetch team data from the contract.
      const fetchedTeamName: string = await contract.getTeamName(teamId)
      const fetchedGoalkeeper: [string, any] = await contract.getGoalkeeper(teamId)
      // fetchedGoalkeeper returns an array: [name, BigNumber level].
      const [gkName, gkLevelBN] = fetchedGoalkeeper
      const gkLevel = gkLevelBN.toNumber()

      const fetchedDefense = await contract.getDefense(teamId)
      const fetchedMiddle = await contract.getMiddle(teamId)
      const fetchedAttack = await contract.getAttack(teamId)

      // Map the fetched arrays to our Player type.
      const defensePlayers: Player[] = fetchedDefense.map((player: any) => ({
        name: player.name,
        level: player.level.toNumber(),
      }))
      const middlePlayers: Player[] = fetchedMiddle.map((player: any) => ({
        name: player.name,
        level: player.level.toNumber(),
      }))
      const attackPlayers: Player[] = fetchedAttack.map((player: any) => ({
        name: player.name,
        level: player.level.toNumber(),
      }))

      // Update state.
      setTeamName(fetchedTeamName)
      setGoalkeeper({ name: gkName, level: gkLevel })
      setDefense(defensePlayers)
      setMiddle(middlePlayers)
      setAttack(attackPlayers)
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle teamId input change.
  const handleTeamIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.target.value)
    setTeamId(id)
  }

  // Fetch team data when the component mounts or when teamId changes.
  useEffect(() => {
    fetchTeamData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId])

  return (
    <div className="App">
      <header>
        <h1>{teamName ? teamName : 'Football Team Formation'}</h1>
      </header>
      <section>
        <div className="controls">
          <input type="number" value={teamId} onChange={handleTeamIdChange} placeholder="Team ID" />
          <button onClick={fetchTeamData}>Fetch Team</button>
        </div>
        {loading ? (
          <p>Loading team data...</p>
        ) : (
          <>
            <div className="p-6 max-w-7xl mx-auto">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Users className="mr-2 h-6 w-6" />
                    {/* {team.teamA.name} Squad Management */}
                    SQUAD MANAGEMENT
                  </CardTitle>
                  <Badge variant="secondary" className="text-lg">
                    Starting XI
                  </Badge>
                </CardHeader>
              </Card>
            </div>

            <CardContent>
              {/* Goalkeeper */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Goalkeeper</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* <PlayerCard player={team.teamA.goalkeeper} position="GK" /> */}
                  <PlayerCard player={goalkeeper} position={''} />
                </div>
              </div>

              {/* Defense */}
              <PlayerSection
                title="Defense"
                players={defense}
                // players={team.teamA.defense}
                position="DEF"
              />

              {/* Midfield */}
              <PlayerSection
                title="Midfield"
                players={middle}
                // players={team.teamA.middle}
                position="MID"
              />

              {/* Attack */}
              <PlayerSection
                title="Attack"
                players={attack}
                // players={team.teamA.attack}
                position="ATK"
              />
            </CardContent>

            <div className="formation">
              <div className="position">
                <h3>Goalkeeper</h3>
                <PlayerCard player={goalkeeper} position={''} />
              </div>
              <PlayerSection title="Defense" players={defense} position={''} />
              <PlayerSection title="Midfield" players={middle} position={''} />
              <PlayerSection title="Attack" players={attack} position={''} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default App
