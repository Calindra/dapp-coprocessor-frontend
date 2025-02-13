export const footballTeamAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'teamId', internalType: 'uint256', type: 'uint256' },
      { name: 'teamName', internalType: 'string', type: 'string' },
      { name: 'goalkeeperName', internalType: 'string', type: 'string' },
      { name: 'goalkeeperLevel', internalType: 'uint256', type: 'uint256' },
      { name: 'defenseNames', internalType: 'string[]', type: 'string[]' },
      { name: 'defenseLevels', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'middleNames', internalType: 'string[]', type: 'string[]' },
      { name: 'middleLevels', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'attackNames', internalType: 'string[]', type: 'string[]' },
      { name: 'attackLevels', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'addTeam',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'teamId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAttack',
    outputs: [
      {
        name: '',
        internalType: 'struct FootballTeam.Player[]',
        type: 'tuple[]',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'level', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'teamId', internalType: 'uint256', type: 'uint256' }],
    name: 'getDefense',
    outputs: [
      {
        name: '',
        internalType: 'struct FootballTeam.Player[]',
        type: 'tuple[]',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'level', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'teamId', internalType: 'uint256', type: 'uint256' }],
    name: 'getGoalkeeper',
    outputs: [
      { name: '', internalType: 'string', type: 'string' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'teamId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMiddle',
    outputs: [
      {
        name: '',
        internalType: 'struct FootballTeam.Player[]',
        type: 'tuple[]',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'level', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'teamId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTeamName',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'teams',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      {
        name: 'goalkeeper',
        internalType: 'struct FootballTeam.Player',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'level', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
]
