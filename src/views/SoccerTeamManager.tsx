import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, User, Star, ArrowLeftRight } from 'lucide-react';
import { Player } from '../model/Player';
import { Button } from '../components/ui/button';
import { Team } from '../model/Team';

const SoccerTeamManager = () => {
  const [selectedPlayerA, setSelectedPlayerA] = useState<Player | null>(null);
  const [selectedPlayerB, setSelectedPlayerB] = useState<Player | null>(null);
  const [team, setTeam] = useState({
    teamA: {
      name: "Botafogo",
      goalkeeper: {
        name: "Bruno 1",
        level: 5,
        id: "gk1"
      },
      defense: [
        { name: "Oshiro 2", level: 3, id: "def1" },
        { name: "Garry 3", level: 3, id: "def2" },
        { name: "Léo 4", level: 3, id: "def3" },
        { name: "Catarino 5", level: 3, id: "def4" }
      ],
      middle: [
        { name: "Sandhilt 6", level: 3, id: "mid1" },
        { name: "Madeira 7", level: 3, id: "mid2" },
        { name: "Coutinho 8", level: 3, id: "mid3" },
        { name: "Ghiggino 9", level: 3, id: "mid4" }
      ],
      attack: [
        { name: "Milton 10", level: 3, id: "atk1" },
        { name: "Felipe 11", level: 3, id: "atk2" }
      ],
      bench: [
        { name: "Felipe 12", level: 2, position: "GK", id: "bench1" },
        { name: "Pedro 13", level: 2, position: "DEF", id: "bench2" },
        { name: "Carlos 14", level: 2, position: "MID", id: "bench3" },
        { name: "Miguel 15", level: 2, position: "ATK", id: "bench4" },
      ]
    }
  });

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

  const findPlayerPos = (team: Team, player: Player) => {
    if (team.goalkeeper.id === player.id) {
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

  const PositionSection = ({ title, players, position }: { title: string, players: Player[], position: string }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <span className="mr-2">{title}</span>
        <Badge variant="secondary">{players.length}</Badge>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {players.map((player, _index) => (
          <PlayerCard key={player.id} player={player} position={position} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6" />
            {team.teamA.name} Squad Management
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-lg">
              Starting XI
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Goalkeeper */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Goalkeeper</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {team.teamA.goalkeeper && (
                <PlayerCard player={team.teamA.goalkeeper} position="GK" />
              )}
            </div>
          </div>

          {/* Defense */}
          <PositionSection
            title="Defense"
            players={team.teamA.defense}
            position="DEF"
          />

          {/* Midfield */}
          <PositionSection
            title="Midfield"
            players={team.teamA.middle}
            position="MID"
          />

          {/* Attack */}
          <PositionSection
            title="Attack"
            players={team.teamA.attack}
            position="ATK"
          />

          {/* Bench */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ArrowLeftRight className="mr-2 h-6 w-6" />
              Bench Players
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {team.teamA.bench.map((player) => (
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