import { Team } from "./Team"

export interface RunMatchRequest {
    reqId: string
    beacon: unknown
    teamA: Team
}