import { useEffect } from 'react'
import {
  Ascent,
  Bind,
  Breeze,
  Fracture,
  Haven,
  Icebox,
  Lotus,
  Pearl,
  Split,
  Sunset,
  LightShield,
  HeavyShield,
  noShield,
} from '../assets/types'

export interface Option {
  id: number
  name: string
  image: string
}

export const maps: Option[] = [
  { id: 1, name: 'Ascent', image: Ascent },
  { id: 2, name: 'Bind', image: Bind },
  { id: 3, name: 'Breeze', image: Breeze },
  { id: 4, name: 'Fracture', image: Fracture },
  { id: 5, name: 'Haven', image: Haven },
  { id: 6, name: 'Icebox', image: Icebox },
  { id: 7, name: 'Lotus', image: Lotus },
  { id: 8, name: 'Pearl', image: Pearl },
  { id: 9, name: 'Split', image: Split },
  { id: 10, name: 'Sunset', image: Sunset },
]

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

export const agentTypes: Option[] = [
  { id: 1, name: 'Controller', image: '' },
  { id: 2, name: 'Initiator', image: '' },
  { id: 3, name: 'Sentinel', image: '' },
  { id: 4, name: 'Duelist', image: '' },
]

export const teams: Option[] = [
  { id: 1, name: 'Attackers', image: '' },
  { id: 2, name: 'Defenders', image: '' },
]

export const armor: Option[] = [
  { id: 1, name: 'No', image: noShield },
  { id: 2, name: 'Light', image: LightShield },
  { id: 3, name: 'Heavy', image: HeavyShield },
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

import { getDatabase, onValue, ref, set, get } from 'firebase/database'

type Props = { path: string }

export function ReadRealtimeDBdata({ path }: Props) {
  // Get a reference to the database
  const db = getDatabase()

  // Reference to the 'data' node
  const cartRef = ref(db, path)

  // Attach a listener for the 'value' event
  useEffect(() => {
    return () => {
      onValue(
        cartRef,
        (snapshot) => {
          const Data = snapshot.val()
          if (Data !== null) {
            console.log(Data)
          } else {
            console.log('Data not found')
          }
        },
        (error) => {
          console.error('Error reading data:', error.message)
        }
      )
    }
  })
}
