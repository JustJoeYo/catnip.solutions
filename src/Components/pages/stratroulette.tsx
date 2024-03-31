import { useEffect, useRef, useState } from 'react'
import {
  mapTargets,
  generateRandomAgent,
  generateStrategy,
  CheckboxState,
  Map,
  getDataFromDatabase,
} from '../data'
import CustomCombobox, { Checkbox } from '../construction/utilities'
import { getDatabase, ref } from 'firebase/database'

export default function StratRoulette() {
  const [dataFetched, setDataFetched] = useState<boolean>(false)

  const [mapNames, setMapNames] = useState<Map[]>([])
  const [selectedMap, setSelectedMap] = useState<Map | null>(null)

  const [teamNames, setTeamNames] = useState<Map[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Map | null>(null)

  const [armorNames, setArmorNames] = useState<Map[]>([])
  const [selectedArmor, setSelectedArmor] = useState<Map | null>(null)

  const [roleNames, setRoleNames] = useState<Map[]>([])
  const [selectedRole, setSelectedRole] = useState<Map | null>(null)

  const [query, setQuery] = useState('')
  const [strategies, setStrategies] = useState<string[]>([])
  const [availableFunds, setAvailableFunds] = useState<number>(0)
  const [selectedAgent, setSelectedAgent] = useState<string[]>([])
  const [checkboxes, setCheckboxes] = useState<CheckboxState>({
    allowPistols: true,
    allowShotguns: true,
    allowSnipers: true,
    allowSMGS: true,
    allowRifles: true,
    allowHeavies: true,
  })

  const consoleBodyRef = useRef<HTMLDivElement>(null)

  const setImageFromOption = (
    option: Map | null | undefined
  ): string | undefined => {
    return option?.image
  }
  const selectedMapImage = setImageFromOption(selectedMap)

  const handleCheckboxChange = (checkboxName: keyof CheckboxState) => {
    setCheckboxes((prevState) => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName], // Toggle the checkbox state
    }))
  }

  const handleAgentClick = () => {
    if (selectedRole) {
      generateRandomAgent(selectedRole, setSelectedAgent)
    }
  }

  const handleGenerateStrategyClick = () => {
    generateStrategy(
      availableFunds,
      setAvailableFunds,
      selectedMap,
      mapTargets,
      selectedTeam,
      selectedArmor,
      checkboxes,
      setStrategies
    )
  }

  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight
    }

    if (!dataFetched) {
      const db = getDatabase()
      getDataFromDatabase(ref(db, 'mapdata/maps'), setMapNames, setSelectedMap)
      getDataFromDatabase(
        ref(db, 'teamdata/teams'),
        setTeamNames,
        setSelectedTeam
      )
      getDataFromDatabase(
        ref(db, 'shielddata/shield'),
        setArmorNames,
        setSelectedArmor
      )
      getDataFromDatabase(
        ref(db, 'agenttypedata/agentTypes'),
        setRoleNames,
        setSelectedRole
      )
      setDataFetched(true)
    }
  }, [strategies, dataFetched, selectedAgent])

  const clearPrevConsole = () => {
    setSelectedAgent([])
    setStrategies([])
  }

  return (
    <>
      <div className="bg-popclr text-gray-900 outline outline-outlineclr max-h-full h-full m-5 p-5 flex overflow-hidden">
        <div className="w-2/4">
          <div className="flex justify-center text-white my-5">
            <div className="mx-5">
              <CustomCombobox
                data={roleNames}
                value={selectedRole}
                onChange={setSelectedRole}
                query={query}
                setQuery={setQuery}
              />
            </div>
            <div className="selectedTeamCombo">
              <CustomCombobox
                data={teamNames}
                value={selectedTeam}
                onChange={setSelectedTeam}
                query={query}
                setQuery={setQuery}
              />
            </div>
            <div className="mx-5">
              <CustomCombobox
                data={armorNames}
                value={selectedArmor}
                onChange={setSelectedArmor}
                query={query}
                setQuery={setQuery}
              />
            </div>

            {selectedArmor && (
              <div className="flex">
                <img
                  className="h-8 w-12"
                  src={setImageFromOption(selectedArmor)}
                  alt={selectedArmor.name}
                />
              </div>
            )}
          </div>
          <div className="text-white w-full h-full my-7 overflow-auto">
            <div className="console-container flex flex-col h-5/6 bg-black rounded-lg border border-gray-700 shadow-lg overflow-hidden">
              <div className="console-header flex justify-end p-2">
                <span className="console-btn red bg-red-500"></span>
                <span className="console-btn yellow bg-yellow-500 mx-1"></span>
                <span className="console-btn green bg-green-500"></span>
              </div>
              <div
                className="console-body flex-1 overflow-auto p-4"
                ref={consoleBodyRef}
              >
                <div className="console-content">
                  {selectedAgent
                    .slice()
                    .reverse()
                    .map((agent, index) => (
                      <p
                        key={index}
                        className="console-text text-white font-mono"
                      >
                        {agent}
                      </p>
                    ))}
                  {strategies
                    .slice()
                    .reverse()
                    .map((strategy, index) => (
                      <p
                        key={index}
                        className="console-text text-white font-mono"
                      >
                        {strategy}
                      </p>
                    ))}
                  {!strategies.length && (
                    <p className="console-text text-white font-mono">
                      Click 'Find Strategy' to create a new strategy!
                    </p>
                  )}
                </div>
              </div>
              <div className="console-footer p-4 flex justify-center">
                <button
                  id="findStrat"
                  className=" bg-mainclr rounded-lg border border-gray-700 shadow-lg text-textclr text-center h-12 w-full hover:bg-slate-500 font-semibold"
                  onClick={handleAgentClick}
                >
                  Random Agent
                </button>
                <button
                  id="findStrat"
                  className=" bg-mainclr mx-5 rounded-lg border border-gray-700 shadow-lg text-textclr text-center h-12 w-full hover:bg-slate-500 font-semibold"
                  onClick={handleGenerateStrategyClick}
                >
                  Find Strategy
                </button>
                <button
                  id="findStrat"
                  className=" bg-mainclr rounded-lg border border-gray-700 shadow-lg text-textclr text-center h-12 w-full hover:bg-slate-500 font-semibold"
                  onClick={clearPrevConsole}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-center mx-28 p-5">
          <div className="flex justify-center">
            <input
              id="money"
              placeholder="Available Funds"
              className="h-9 text-center w-54 mx-5 rounded-lg"
              onChange={(e) => setAvailableFunds(parseInt(e.target.value))}
            ></input>

            <div className="mx-5">
              <CustomCombobox
                data={mapNames}
                value={selectedMap}
                onChange={setSelectedMap}
                query={query}
                setQuery={setQuery}
              />
            </div>
          </div>
          <div className="flex justify-center text-white my-5">
            <Checkbox
              label="Pistols"
              checked={checkboxes.allowPistols}
              onChange={() => handleCheckboxChange('allowPistols')}
            />
            <Checkbox
              label="Shotguns"
              checked={checkboxes.allowShotguns}
              onChange={() => handleCheckboxChange('allowShotguns')}
            />
            <Checkbox
              label="SMGs"
              checked={checkboxes.allowSMGS}
              onChange={() => handleCheckboxChange('allowSMGS')}
            />
            <Checkbox
              label="Snipers"
              checked={checkboxes.allowSnipers}
              onChange={() => handleCheckboxChange('allowSnipers')}
            />
            <Checkbox
              label="Rifles"
              checked={checkboxes.allowRifles}
              onChange={() => handleCheckboxChange('allowRifles')}
            />
            <Checkbox
              label="Heavies"
              checked={checkboxes.allowHeavies}
              onChange={() => handleCheckboxChange('allowHeavies')}
            />
          </div>
          {selectedMapImage && (
            <div className="flex justify-center h-5/6">
              <img
                src={selectedMapImage}
                alt={selectedMap ? selectedMap.name : ''}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
