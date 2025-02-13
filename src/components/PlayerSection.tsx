import { Player } from '../model/Player'
import { PlayerCard } from './PlayerCard'
import { Badge } from './ui/badge'

export const PlayerSection = ({ title, players, position }: { title: string; players: Player[]; position: string }) => (
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
)
