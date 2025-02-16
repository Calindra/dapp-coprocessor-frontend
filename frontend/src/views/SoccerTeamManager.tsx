import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, User, Star, ArrowLeftRight } from 'lucide-react';
import { Player } from '../model/Player';
import { Button } from '../components/ui/button';
import { Team } from '../model/Team';
import { callRunExecution, countPlayers, watchEvent } from '../services/MatchService';
import { Hex } from 'viem';
import { getNFTs, mintNFTs } from '../services/NFTPlayersService';
import { getWalletClient } from '../services/WalletService';
import GameResult from '../components/GameResult';
import D3TournamentBracket from './D3TournamentBracket';
import { tournamentService } from '../services/TournamentService';
import fireworks from '../services/Fireworks';
import { RunMatchRequest } from '../model/RunMatchRequest';
import SoccerCommentary, { CommentaryType } from '../components/SoccerCommentary';
import { GameResultI } from '../model/GameResult';

const SoccerTeamManager = () => {
  const [selectedPlayerA, setSelectedPlayerA] = useState<Player | null>(null);
  const [selectedPlayerB, setSelectedPlayerB] = useState<Player | null>(null);
  const [team, setTeam] = useState<{ teamA: Team | null }>({ teamA: null });
  const [teamB, setTeamB] = useState('')
  const [showTournament, setShowTournament] = useState(true)

  const [goalsA, setGoalsA] = useState('')
  const [goalsB, setGoalsB] = useState('')
  const [roundNumber, setRoundNumber] = useState(0)
  const [reqId, setReqId] = useState('')
  const [matchStartedAt, setMatchStartedAt] = useState(0);
  const [commentaryType, setCommentaryType] = useState<CommentaryType>('playing')

  const showGameResult = (gameResult: GameResultI | undefined) => {
    if (!gameResult) {
      return
    }
    setGoalsA(`${gameResult.goalsA}`)
    setGoalsB(`${gameResult.goalsB}`)
    const matches = tournamentService.getMatches()
    const currentTeamB = matches.currentMatch?.teamB
    if (!currentTeamB) {
      console.warn(`Sync error`)
      return
    }
    console.log(`Set result by onchain game`, 'England', currentTeamB)
    tournamentService.setResult('England', currentTeamB, `${gameResult.goalsA}`, `${gameResult.goalsB}`)
    tournamentService.fillMatchesResult()
    tournamentService.setLoadingReqId('', '', '')
    setMatchStartedAt(0)
    const newRound = tournamentService.incRound();
    setRoundNumber(newRound)
    if (newRound > 3 && (gameResult.goalsA ?? 0) >= (gameResult.goalsB ?? 0)) {
      fireworks()
      setTimeout(() => fireworks(), 400)
      setTimeout(() => fireworks(), 500)
      setTimeout(() => fireworks(), 800)
      setCommentaryType('weAreTheChampions')
    } else {
      if (gameResult.goalsA == gameResult.goalsB) {
        setCommentaryType('advanceOnPenalties')
      } else if ((gameResult.goalsA ?? 0) > (gameResult.goalsB ?? 0)) {
        setCommentaryType('winning')
        setTimeout(() => setCommentaryType('victoryToNextRound'), 20000)
      }
    }
    setTimeout(() => {
      setCommentaryType('playing')
      setReqId('')
    }, 30000)
  }
  const setSelectedPlayer = (player: Player) => {
    if (selectedPlayerA === null) {
      return setSelectedPlayerA(player)
    }
    if (selectedPlayerB === null) {
      setSelectedPlayerB(player)
      handlePositionChange(selectedPlayerA, player)
      return
    }
  }

  useEffect(() => {
    const wallet = getWalletClient()
    if (wallet) {
      wallet.requestAddresses().then(accounts => {
        if (accounts.length) {
          loadPlayers(accounts[0])
        }
      }).catch(e => console.error(e))
      const matches = tournamentService.getMatches()
      setRoundNumber(matches.round)
      if (matches.loadingReqId) {
        setTeamB(matches.currentMatch?.teamB || '')
        setGoalsA('0')
        setGoalsB('0')
        watchEvent(matches.loadingReqId).then(gameResult => {
          showGameResult(gameResult)
        })
        setReqId(matches.loadingReqId)
        setShowTournament(true)
        setMatchStartedAt(matches.matchStartedAt || 0)
      } else {
        setReqId('')
      }
      const currentAdversary = tournamentService.getCurrentAdversary('England')
      if (currentAdversary) {
        setTeamB(currentAdversary)
      }
    }
  }, [])

  const findPlayerPos = (team: Team, player: Player) => {
    if (team.goalkeeper?.id === player.id) {
      return { list: [], index: -2 }
    }
    const indexDef = team.defense.findIndex(p => p.id === player.id)
    if (indexDef !== -1) {
      return { list: team.defense, index: indexDef }
    }
    const indexMid = team.middle.findIndex(p => p.id === player.id)
    if (indexMid !== -1) {
      return { list: team.middle, index: indexMid }
    }
    const indexAtk = team.attack.findIndex(p => p.id === player.id)
    if (indexAtk !== -1) {
      return { list: team.attack, index: indexAtk }
    }
    const indexBen = team.bench.findIndex(p => p.id === player.id)
    if (indexBen !== -1) {
      return { list: team.bench, index: indexBen }
    }
  }

  const handlePositionChange = (playerA: Player, playerB: Player) => {
    if (!team.teamA) {
      alert(`Please load or buy your team.`)
      return
    }
    const posA = findPlayerPos(team.teamA, playerA)
    if (!posA) {
      return
    }
    const posB = findPlayerPos(team.teamA, playerB)
    if (!posB) {
      return
    }
    if (posA.index === -2) {
      team.teamA.goalkeeper = playerB
    }
    if (posB.index === -2) {
      team.teamA.goalkeeper = playerA
    }
    posA.list[posA.index] = playerB
    posB.list[posB.index] = playerA
    setTeam({ ...team });
    setSelectedPlayerA(null);
    setSelectedPlayerB(null);
  };

  const runMatch = async () => {
    const total = countPlayers(team.teamA)
    if (total < 11) {
      alert(`Buy a pack of players to ensure you have at least 11.`)
      setShowTournament(false)
      return
    }
    setShowTournament(true)
    const currentAdversary = tournamentService.getCurrentAdversary('England')
    if (currentAdversary) {
      setTeamB(currentAdversary)
      setGoalsA('0')
      setGoalsB('0')
    } else {
      if (confirm('Restart?')) {
        tournamentService.initialize()
        setRoundNumber(0)
        setTeamB('')
        setGoalsA('')
        setGoalsB('')
        return
      } else {
        return
      }
    }
    const response = await fetch(`https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971/public/latest`)
    if (!response.ok) {
      throw new Error(`Drand error: ${response.status}`);
    }
    const payload: RunMatchRequest = {
      beacon: await response.json(),
      teamA: team.teamA!,
      reqId: crypto.randomUUID(),
    }
    tournamentService.setLoadingReqId(payload.reqId, 'England', currentAdversary)
    setMatchStartedAt(Date.now())
    setReqId(payload.reqId)
    const gameResult = await callRunExecution(payload)
    showGameResult(gameResult)
  }

  const PlayerCard = ({ player, position }: { player: Player, position: string }) => (
    <div
      className={`flex items-center space-x-2 p-3 rounded-lg shadow cursor-pointer transition-colors ${selectedPlayerA?.id === player.id
        ? "bg-blue-100 border-2 border-blue-500"
        : "bg-white hover:bg-gray-50"
        }`}
      onClick={() => setSelectedPlayer(player)}
    >
      <User className="h-6 w-6 text-gray-500" />
      <div className="flex-1">
        <div className="font-medium">{player.name}</div>
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-500">{position}</span>
          <div className="flex">
            {[...Array(player.level)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PositionSection = ({ title, players, position }: { title: string, players: Player[] | undefined, position: string }) => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <span className="mr-2">{title}</span>
          <Badge variant="secondary">{players?.length || 0}</Badge>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players?.map((player, _index) => (
            <PlayerCard key={player.id} player={player} position={position} />
          ))}
        </div>
      </div>
    )
  };

  const fillArray = (dest: Player[], source: Player[], qt: number): void => {
    for (let i = 0; i < qt; i++) {
      const aux = source.pop();
      if (!aux) {
        console.warn("Not enough players", qt)
        return
      }
      dest.push(aux);
    }
  };

  const loadTeam = async () => {
    const wallet = getWalletClient()
    if (wallet) {
      wallet.requestAddresses().then(accounts => {
        if (accounts.length) {
          loadPlayers(accounts[0])
        }
      }).catch(e => console.error(e))
    }
  }

  const loadPlayers = async (account: string) => {
    try {
      const players = await getNFTs(account as Hex)
      if (!players) {
        return
      }
      team.teamA = {
        name: "",
        defense: [],
        middle: [],
        attack: [],
        bench: [],
        goalkeeper: null,
      }
      const goalkeeper = players.pop()
      if (!goalkeeper) {
        console.warn("Not enough players", players.length)
        setTeam({ ...team })
        return
      }

      team.teamA.goalkeeper = goalkeeper
      fillArray(team.teamA.defense, players, 4);
      fillArray(team.teamA.middle, players, 4);
      fillArray(team.teamA.attack, players, 2);
      for (const player of players) {
        team.teamA.bench.push(player as any)
      }
      setTeam({ ...team })
    } catch (e) {
      console.error(e)
      setTeam({ ...team })
      alert((e as any).message)
    }
  }

  const buyPack = async () => {
    await mintNFTs()
    setTimeout(() => {
      loadTeam()
    }, 1000)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6" />
            {team.teamA?.name || 'England'} Squad Management
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button onClick={runMatch}>Run Match</Button>
            <Button onClick={buyPack}>Buy pack(8)</Button>
            <Button onClick={loadTeam}>Load Team</Button>
          </div>
        </CardHeader>
        {/* <Button onClick={() => setCommentaryType('winning')}>Winning</Button>
        <Button onClick={() => setCommentaryType('advanceOnPenalties')}>Penal</Button>
        <Button onClick={() => setCommentaryType('weAreTheChampions')}>Champion</Button> */}
        <GameResult goalsA={goalsA} goalsB={goalsB} teamBName={teamB} />
        {reqId !== '' && (<SoccerCommentary start={matchStartedAt} commentaryType={commentaryType} />)}
        {showTournament && (
          <D3TournamentBracket roundNumber={roundNumber} teamFocus={'England'} />
        )}
        <CardContent>
          {/* Goalkeeper */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Goalkeeper
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {team.teamA?.goalkeeper && (
                <PlayerCard player={team.teamA?.goalkeeper} position="GK" />
              )}
            </div>
          </div>

          {/* Defense */}
          <PositionSection
            title="Defense"
            players={team.teamA?.defense}
            position="DEF"
          />

          {/* Midfield */}
          <PositionSection
            title="Midfield"
            players={team.teamA?.middle}
            position="MID"
          />

          {/* Attack */}
          <PositionSection
            title="Attack"
            players={team.teamA?.attack}
            position="ATK"
          />

          {/* Bench */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ArrowLeftRight className="mr-2 h-6 w-6" />
              Bench Players
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.teamA?.bench.map((player) => (
                <PlayerCard key={player.id} player={player} position={player.position} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoccerTeamManager;