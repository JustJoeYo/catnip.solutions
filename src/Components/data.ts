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

export const teams: Option[] = [
  { id: 1, name: 'Attackers', image: '' },
  { id: 2, name: 'Defenders', image: '' },
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
