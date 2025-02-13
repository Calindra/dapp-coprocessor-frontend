import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, User, Star, ArrowLeftRight } from 'lucide-react';
import { Player } from '../model/Player';

const SoccerTeamManager = () => {
  const [team, setTeam] = useState({
    teamA: {
      name: "Botafogo",
      goalkeeper: {
        name: "Bruno",
        level: 5
      },
      defense: [
        { name: "Oshiro", level: 3 },
        { name: "Garry", level: 3 },
        { name: "Léo", level: 3 },
        { name: "Catarino", level: 3 }
      ],
      middle: [
        { name: "Oshiro", level: 3 },
        { name: "Garry", level: 3 },
        { name: "Léo", level: 3 },
        { name: "Catarino", level: 3 }
      ],
      attack: [
        { name: "Léo", level: 3 },
        { name: "Catarino", level: 3 }
      ]
    }
  });

  const [benchPlayers] = useState([
    { name: "João", level: 2, position: "GK" },
    { name: "Pedro", level: 2, position: "DEF" },
    { name: "Carlos", level: 2, position: "MID" },
    { name: "Miguel", level: 2, position: "ATK" },
  ]);

  const PlayerCard = ({ player, position }: { player: Player, position: string }) => (
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow">
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
        {players.map((player, index) => (
          <PlayerCard key={index} player={player} position={position} />
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
          <Badge variant="secondary" className="text-lg">
            Starting XI
          </Badge>
        </CardHeader>
        <CardContent>
          {/* Goalkeeper */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Goalkeeper</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <PlayerCard player={team.teamA.goalkeeper} position="GK" />
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
              {benchPlayers.map((player, index) => (
                <PlayerCard key={index} player={player} position={player.position} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoccerTeamManager;