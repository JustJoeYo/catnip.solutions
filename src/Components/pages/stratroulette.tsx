import { useEffect, useRef, useState } from 'react'
import {
  Option,
  maps,
  teams,
  armor,
  mapTargets,
  weapons,
  agents,
  agentTypes,
  ReadRealtimeDBdata,
} from '../data'
import { CustomCombobox, Checkbox } from '../construction/utilities'

interface CheckboxState {
  [key: string]: boolean
}

export default function StratRoulette() {
  const [selectedmap, setSelectedMap] = useState(maps[0])
  const [selectedTeam, setSelectedTeam] = useState(teams[0])
  const [selectedArmor, setSelectedArmor] = useState(armor[0])
  const [selectedRole, setSelectedRole] = useState(agentTypes[0])
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

  // Get data from Realtime Database

  ReadRealtimeDBdata({ path: 'agentdata/' })
  ReadRealtimeDBdata({ path: 'maptargetdata/' })
  ReadRealtimeDBdata({ path: 'agenttypedata/' })
  ReadRealtimeDBdata({ path: 'teamdata/' })
  ReadRealtimeDBdata({ path: 'mapdata/' })
  ReadRealtimeDBdata({ path: 'weapondata/' })
  ReadRealtimeDBdata({ path: 'shielddata/' })

  const consoleBodyRef = useRef<HTMLDivElement>(null)

  const setImageFromOption = (option: Option | null): string | undefined => {
    return option?.image
  }

  const handleCheckboxChange = (checkboxName: keyof CheckboxState) => {
    setCheckboxes((prevState) => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName], // Toggle the checkbox state
    }))
  }

  const getRandomAffordableWeapon = (
    remainingFunds: number,
    checkboxes: CheckboxState
  ) => {
    const affordableWeapons = weapons.filter((weapon) => {
      const isAffordable = weapon.buyPrice <= remainingFunds
      if (!isAffordable) return false // If the weapon is not affordable, exclude it
      if (!checkboxes.allowPistols && weapon.category === 'Pistol') return false
      if (!checkboxes.allowShotguns && weapon.category === 'Shotgun')
        return false
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

  const generateStrategy = () => {
    const saveAvailableFunds = availableFunds

    const mapTarget = mapTargets.find((map) => map.id === selectedmap.id)
    if (!mapTarget) return

    const targets = Array.from({ length: mapTarget.targets }, (_, index) =>
      String.fromCharCode(65 + index)
    )
    const randomIndex = Math.floor(Math.random() * targets.length)
    const selectedTarget = targets[randomIndex]

    let strategy = ''
    if (selectedTeam.name === 'Attackers') {
      strategy = `Attack target ${selectedTarget}`
    } else if (selectedTeam.name === 'Defenders') {
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
        checkboxes
      )
      if (weapon) {
        strategy += ` and a ${weapon.name}`
        const remainingFundsAfterWeapon =
          remainingFundsAfterShield - weapon.buyPrice
        setAvailableFunds(remainingFundsAfterWeapon)
      }
    }

    setStrategies((prevStrategies) => [strategy, ...prevStrategies])
    setAvailableFunds(saveAvailableFunds)
  }

  const generateRandomAgent = () => {
    let RandoAgent = ''

    // Filter agents based on selected role
    const filteredAgents = agents.filter(
      (selectedAgent) => selectedAgent.role === selectedRole.name
    )

    // Select a random agent from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredAgents.length)
    const randomAgent = filteredAgents[randomIndex].name
    RandoAgent += randomAgent

    setSelectedAgent((prevSelectedAgent) => [RandoAgent, ...prevSelectedAgent])
  }

  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight
    }
  }, [strategies])

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
                value={selectedRole}
                onChange={setSelectedRole}
                options={agentTypes}
                displayValue={(agentTypes: any) => agentTypes.name}
                onSelectOption={(agentTypes: any) => agentTypes.name}
              />
            </div>
            <div className="">
              <CustomCombobox
                value={selectedTeam}
                onChange={setSelectedTeam}
                options={teams}
                displayValue={(teams: any) => teams.name}
                onSelectOption={(teams: any) => teams.name}
              />
            </div>
            <div className="mx-5">
              <CustomCombobox
                value={selectedArmor}
                onChange={setSelectedArmor}
                options={armor}
                displayValue={(armor: any) => armor.name}
                onSelectOption={(armor: any) => armor.name}
              />
            </div>

            {selectedArmor && (
              <div className="flex w-8">
                <img
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
                  onClick={generateRandomAgent}
                >
                  Random Agent
                </button>
                <button
                  id="findStrat"
                  className=" bg-mainclr mx-5 rounded-lg border border-gray-700 shadow-lg text-textclr text-center h-12 w-full hover:bg-slate-500 font-semibold"
                  onClick={generateStrategy}
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
                value={selectedmap}
                onChange={setSelectedMap}
                options={maps}
                displayValue={(maps: any) => maps.name}
                onSelectOption={(maps: any) => maps.name}
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
          {selectedmap && (
            <div className="flex justify-center h-5/6">
              <img
                src={setImageFromOption(selectedmap)}
                alt={selectedmap.name}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
