import React, { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { filterData } from '../data'

interface Map {
  id: number
  name: string
}

interface ComboboxProps {
  data: Map[]
  value: Map | null
  onChange: any
  query: string
  setQuery: any
}

const CustomCombobox: React.FC<ComboboxProps> = ({
  data,
  value,
  onChange,
  query,
  setQuery,
}) => {
  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(selectedTeam: Map | null) =>
              selectedTeam ? selectedTeam.name : ''
            }
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filterData(data, query).length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filterData(data, query).map((map) => (
                <Combobox.Option
                  key={map.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-mainclr text-white' : 'text-gray-900'
                    }`
                  }
                  value={map}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {map.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-mainclr'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

export default CustomCombobox

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <>
      <h1 className="mx-2 text-sm">{label}</h1>
      <input
        className="mt-1"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </>
  )
}
