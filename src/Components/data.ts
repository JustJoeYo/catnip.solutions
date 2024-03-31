import { Dispatch, SetStateAction } from 'react'
import { onValue, DataSnapshot } from 'firebase/database'

export interface Option {
  id: number
  name: string
  image: string
}

export const mapTargets = [
  { id: 1, targets: 2 },
  { id: 2, targets: 2 },
  { id: 3, targets: 2 },
  { id: 4, targets: 2 },
  { id: 5, targets: 3 },
  { id: 6, targets: 2 },
  { id: 7, targets: 3 },
  { id: 8, targets: 2 },
  { id: 9, targets: 2 },
  { id: 10, targets: 2 },
]
export interface Weapon {
  id: number
  name: string
  category: string
  buyPrice: number // Price in credits
}

export const weapons: Weapon[] = [
  { id: 1, name: 'Classic', category: 'Pistol', buyPrice: 0 },
  { id: 2, name: 'Shorty', category: 'Pistol', buyPrice: 300 },
  { id: 3, name: 'Frenzy', category: 'Pistol', buyPrice: 450 },
  { id: 4, name: 'Ghost', category: 'Pistol', buyPrice: 500 },
  { id: 5, name: 'Sheriff', category: 'Pistol', buyPrice: 800 },
  { id: 6, name: 'Stinger', category: 'SMG', buyPrice: 1100 },
  { id: 7, name: 'Spectre', category: 'SMG', buyPrice: 1600 },
  { id: 8, name: 'Bucky', category: 'Shotgun', buyPrice: 850 },
  { id: 9, name: 'Judge', category: 'Shotgun', buyPrice: 1850 },
  { id: 10, name: 'Bulldog', category: 'Rifle', buyPrice: 2050 },
  { id: 11, name: 'Guardian', category: 'Rifle', buyPrice: 2250 },
  { id: 12, name: 'Phantom', category: 'Rifle', buyPrice: 2900 },
  { id: 13, name: 'Vandal', category: 'Rifle', buyPrice: 2900 },
  { id: 14, name: 'Marshal', category: 'Sniper', buyPrice: 950 },
  { id: 15, name: 'Operator', category: 'Sniper', buyPrice: 4700 },
  { id: 16, name: 'Outlaw', category: 'Sniper', buyPrice: 2400 },
  { id: 17, name: 'Ares', category: 'Heavy', buyPrice: 1600 },
  { id: 18, name: 'Odin', category: 'Heavy', buyPrice: 3200 },
]

export interface Agent {
  name: string
  role: string
}

export const agents: Agent[] = [
  { name: 'Brimstone', role: 'Controller' },
  { name: 'Viper', role: 'Controller' },
  { name: 'Omen', role: 'Controller' },
  { name: 'Astra', role: 'Controller' },
  { name: 'Harbor', role: 'Controller' },
  { name: 'Clove', role: 'Controller' },

  { name: 'Breach', role: 'Initiator' },
  { name: 'Sova', role: 'Initiator' },
  { name: 'Skye', role: 'Initiator' },
  { name: 'KAYO', role: 'Initiator' },
  { name: 'Fade', role: 'Initiator' },
  { name: 'Gekko', role: 'Initiator' },

  { name: 'Cypher', role: 'Sentinel' },
  { name: 'Killjoy', role: 'Sentinel' },
  { name: 'Sage', role: 'Sentinel' },
  { name: 'Deadlock', role: 'Sentinel' },
  { name: 'Chamber', role: 'Sentinel' },

  { name: 'Phoenix', role: 'Duelist' },
  { name: 'Jett', role: 'Duelist' },
  { name: 'Reyna', role: 'Duelist' },
  { name: 'Yoru', role: 'Duelist' },
  { name: 'Raze', role: 'Duelist' },
  { name: 'Neon', role: 'Duelist' },
  { name: 'Iso', role: 'Duelist' },
]

export interface CheckboxState {
  [key: string]: boolean
}

interface MapItem {
  id: number
  name: string
  // Define other properties if needed
}

export function filterData(maps: MapItem[], query: string): MapItem[] {
  const filteredData: MapItem[] =
    query === ''
      ? maps
      : maps.filter((map: MapItem) =>
          map.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )
  return filteredData
}

export const generateRandomAgent = (
  selectedRole: { name: string } | null,
  setSelectedAgent: Dispatch<SetStateAction<string[]>>
) => {
  let randomAgent = ''

  if (selectedRole) {
    // Filter agents based on selected role
    const filteredAgents = agents.filter(
      (agent) => agent.role === selectedRole.name
    )

    if (filteredAgents.length > 0) {
      // Select a random agent from the filtered list
      const randomIndex = Math.floor(Math.random() * filteredAgents.length)
      randomAgent = filteredAgents[randomIndex].name
    }
  }

  // Update selected agents
  setSelectedAgent((prevSelectedAgents: string[]) => [
    randomAgent,
    ...prevSelectedAgents,
  ])
}

const getRandomAffordableWeapon = (
  remainingFunds: number,
  checkboxes: CheckboxState,
  weapons: Weapon[]
): Weapon | undefined => {
  const affordableWeapons = weapons.filter((weapon) => {
    const isAffordable = weapon.buyPrice <= remainingFunds
    if (!isAffordable) return false // If the weapon is not affordable, exclude it
    if (!checkboxes.allowPistols && weapon.category === 'Pistol') return false
    if (!checkboxes.allowShotguns && weapon.category === 'Shotgun') return false
    if (!checkboxes.allowSnipers && weapon.category === 'Sniper') return false
    if (!checkboxes.allowSMGS && weapon.category === 'SMG') return false
    if (!checkboxes.allowRifles && weapon.category === 'Rifle') return false
    if (!checkboxes.allowHeavies && weapon.category === 'Heavy') return false
    // Add conditions for other weapon types if needed
    else return true
  })
  const randomIndex = Math.floor(Math.random() * affordableWeapons.length)
  return affordableWeapons[randomIndex]
}

export const generateStrategy = (
  availableFunds: number,
  setAvailableFunds: React.Dispatch<React.SetStateAction<number>>,
  selectedMap: any | null | undefined,
  mapTargets: any[],
  selectedTeam: any | null | undefined,
  selectedArmor: any,
  checkboxes: CheckboxState,
  setStrategies: React.Dispatch<React.SetStateAction<string[]>>
): void => {
  const saveAvailableFunds = availableFunds

  const mapTarget = mapTargets.find((map) => map.id === selectedMap?.id)
  if (!mapTarget) return

  const targets = Array.from({ length: mapTarget.targets }, (_, index) =>
    String.fromCharCode(65 + index)
  )
  const randomIndex = Math.floor(Math.random() * targets.length)
  const selectedTarget = targets[randomIndex]

  let strategy = ''
  if (selectedTeam ? selectedTeam.name === 'Attackers' : '') {
    strategy = `Attack target ${selectedTarget}`
  } else if (selectedTeam ? selectedTeam.name === 'Defenders' : '') {
    strategy = `Defend target ${selectedTarget}`
  }

  let shieldPrice = 0
  if (selectedArmor) {
    if (selectedArmor.name == 'Heavy') {
      shieldPrice = 1000
    } else if (selectedArmor.name == 'Light') {
      shieldPrice = 400
    } else {
      shieldPrice = 0
    }
    strategy += ` purchasing ${selectedArmor.name} shield`
  } else {
    shieldPrice = 0
  }
  setAvailableFunds((prevFunds) => prevFunds - shieldPrice)
  const remainingFundsAfterShield = availableFunds - shieldPrice

  if (remainingFundsAfterShield == 0) {
    strategy = 'RUSH B WITH CLASSIC BROKIE!'
  } else {
    const weapon = getRandomAffordableWeapon(
      remainingFundsAfterShield,
      checkboxes,
      weapons
    )
    if (weapon) {
      strategy += ` and a ${weapon.name}`
      strategy = `<span className="text-red-500">${strategy}</span>`
      const remainingFundsAfterWeapon =
        remainingFundsAfterShield - weapon.buyPrice
      setAvailableFunds(remainingFundsAfterWeapon)
    }
  }

  setStrategies((prevStrategies) => [strategy, ...prevStrategies])
  setAvailableFunds(saveAvailableFunds)
}

export interface Map {
  id: number
  name: string
  image: string
}

export const getDataFromDatabase = (
  dbRef: any,
  setData: React.Dispatch<React.SetStateAction<Map[]>>,
  setSelectedData: React.Dispatch<React.SetStateAction<Map | null>>
) => {
  const names: Map[] = []
  onValue(dbRef, (snapshot: DataSnapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val() as Map
      names.push(data)
    })
    setData(names)

    // Set the default value to the first item in the database
    if (names.length > 0) {
      setSelectedData(names[0])
    }
  })
}
