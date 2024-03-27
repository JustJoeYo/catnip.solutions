import { useState } from 'react'
import { Option, maps, teams } from '../data'
import { CustomCombobox } from '../combobox/combobox'

export default function StratRoulette() {
  const [selected, setSelected] = useState(maps[0])
  const [selectedTeam, setSelectedTeam] = useState(teams[0])

  const setImageFromOption = (option: Option | null): string | undefined => {
    return option?.image
  }

  return (
    <>
      <div className="bg-popclr text-gray-900 outline outline-outlineclr h-full m-5 p-5 flex">
        <div className="outline outline-outlineclr w-2/4 h-full p-5">
          <div className="flex justify-center text-white">
            <div className="">
              <CustomCombobox
                value={selectedTeam}
                onChange={setSelectedTeam}
                options={teams}
                displayValue={(teams: any) => teams.name}
                onSelectOption={(teams: any) => teams.name}
              />
            </div>
          </div>
        </div>
        <div className="justify-end mx-5">
          <div className="flex justify-end">
            <input
              id="money"
              placeholder="Available Funds"
              className="h-9 text-center rounded-lg"
            ></input>
            <div className="mx-5">
              <CustomCombobox
                value={selected}
                onChange={setSelected}
                options={maps}
                displayValue={(maps: any) => maps.name}
                onSelectOption={(maps: any) => maps.name}
              />
            </div>
            <button
              id="findStrat"
              className="outline outline-outlineclr bg-white text-center h-9 w-auto px-10 hover:bg-slate-500"
            >
              Find Strategy
            </button>
          </div>
          <div className="flex justify-end text-white my-5">
            <h1 className="mx-2">Create Plan Based on Map</h1>
            <input
              className="mt-1"
              type="checkbox"
              defaultChecked={true}
              onChange={(e) => {
                e.target.value
              }}
            ></input>
            <h1 className="mx-2">Allow Pistols</h1>
            <input
              className="mt-1"
              type="checkbox"
              defaultChecked={true}
              onChange={(e) => {
                e.target.value
              }}
            ></input>
            <h1 className="mx-2">Allow Shotguns</h1>
            <input
              className="mt-1"
              type="checkbox"
              defaultChecked={true}
              onChange={(e) => {
                e.target.value
              }}
            ></input>
            <h1 className="mx-2">Allow Snipers</h1>
            <input
              className="mt-1"
              type="checkbox"
              defaultChecked={true}
              onChange={(e) => {
                e.target.value
              }}
            ></input>
          </div>
          {selected && (
            <div className="flex justify-end h-5/6 mr-6">
              <img src={setImageFromOption(selected)} alt={selected.name} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
