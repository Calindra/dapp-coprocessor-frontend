import { Star, User } from 'lucide-react'
import { Player } from '../model/Player'

export const PlayerCard = ({ player, position }: { player: Player; position: string }) => (
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
)
