import React, { useEffect, useState } from 'react'
import {
  getDatabase,
  ref,
  onValue,
  DataSnapshot,
  set,
  push,
  remove,
} from 'firebase/database'

import { useToast, EToastTypes } from '../../contexts/types'

const Dashboard: React.FC = () => {
  const db = getDatabase()
  const [tableData, setTableData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { showTypedToast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(7) // State for items per page
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [manualDeleteInput, setManualDeleteInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const dbRef = ref(db, 'Users/')

    onValue(dbRef, (snapshot: DataSnapshot) => {
      let records: any[] = []
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        let keyName = childSnapshot.key!
        let data = childSnapshot.val()
        records.push({ key: keyName, data: data })
      })
      setTableData(records)
    })
  }, [])

  interface StateType {
    username: string
    firstname: string
    lastname: string
  }

  const [state, setState] = useState<StateType>({
    username: '',
    firstname: '',
    lastname: '',
  })
  let UsernameInput = state.username || ''
  let FirstnameInput = state.firstname || ''
  let LastnameInput = state.lastname || ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    try {
      setLoading(true)

      // Set the data to the database
      let inputData = {
        Username: state.username,
        Firstname: state.firstname,
        Lastname: state.lastname,
      }
      if (
        state.username === '' ||
        state.firstname === '' ||
        state.lastname === ''
      ) {
        showTypedToast(EToastTypes.ERROR, 'Please fill all the fields!')
        return
      }

      // Check if firstname or lastname contain numbers
      if (/\d/.test(state.firstname) || /\d/.test(state.lastname)) {
        showTypedToast(
          EToastTypes.ERROR,
          'First name and Last name should not contain numbers!'
        )
        return
      }

      // Check if the username, first name, and last name contain special characters
      const regex = /^[a-zA-Z0-9]+$/
      if (!regex.test(state.username)) {
        showTypedToast(
          EToastTypes.ERROR,
          'Username should only contain alphanumeric characters!'
        )
        return
      }
      if (!regex.test(state.firstname)) {
        showTypedToast(
          EToastTypes.ERROR,
          'First name should only contain alphanumeric characters!'
        )
        return
      }
      if (!regex.test(state.lastname)) {
        showTypedToast(
          EToastTypes.ERROR,
          'Last name should only contain alphanumeric characters!'
        )
        return
      }

      // Check if the username already exists
      const usernameExists = tableData.some(
        (user) => user.data.Username === state.username
      )

      if (usernameExists) {
        showTypedToast(EToastTypes.ERROR, 'Username already exists!')
        return
      }

      // Get a reference to the "Users" node and push the new data
      const usersRef = ref(db, 'Users/')
      const newUserRef = push(usersRef)

      // Get the key generated for the new user
      const newUserKey = newUserRef.key

      if (newUserKey) {
        // Set the data with the generated key
        await set(ref(db, `Users/${newUserKey}`), inputData)
        showTypedToast(EToastTypes.SUCCESS, 'Data Saved Successfully!')
      }
    } catch {
      showTypedToast(EToastTypes.ERROR, 'FAILED')
    }

    setLoading(false)
  }

  async function handleDeleteSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    try {
      setLoading(true)

      if (selectedItems.length === 0 && !manualDeleteInput) {
        showTypedToast(
          EToastTypes.ERROR,
          'Please select items or provide manual input for deletion!'
        )
        return
      }

      const itemsToDelete = [...selectedItems]
      if (manualDeleteInput) {
        // Add the manually entered key for deletion
        itemsToDelete.push(manualDeleteInput)
      }

      const userToDeletePromises = itemsToDelete.map((userKey) => {
        const userToDeleteRef = ref(db, `Users/${userKey}`)
        return remove(userToDeleteRef)
      })

      Promise.all(userToDeletePromises)
        .then(() => {
          showTypedToast(
            EToastTypes.SUCCESS,
            'Selected user data deleted successfully!'
          )
          setSelectedItems([]) // Clear selected items after deletion
          setManualDeleteInput('') // Clear manual delete input after deletion
        })
        .catch((error) => {
          console.error('Error deleting user data: ', error)
          showTypedToast(EToastTypes.ERROR, 'Error deleting user data: ', error)
        })
    } catch {
      showTypedToast(EToastTypes.ERROR, 'FAILED!')
    }

    setLoading(false)
  }

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  // Filter table data based on search query
  const filteredTableData = tableData.filter(
    (user) =>
      user.data.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.data.Firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.data.Lastname.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const currentItems = filteredTableData.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Checkbox event handler
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const isChecked = e.target.checked
    if (isChecked) {
      setSelectedItems([...selectedItems, key])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== key))
    }
  }

  // Select all checkboxes event handler
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setSelectAllChecked(isChecked)
    if (isChecked) {
      const keysOnCurrentPage = currentItems.map((item) => item.key)
      setSelectedItems(keysOnCurrentPage)
    } else {
      setSelectedItems([])
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      <div className="bg-popclr text-textclr outline outline-outlineclr h-full p-5 m-5 max-h-full overflow-hidden">
        <div className="flex justify-center mb-5">
          <input
            type="text"
            value={UsernameInput || ''}
            id="username"
            name="username"
            placeholder="Username"
            onChange={handleInputChange}
          />
          <input
            type="text"
            value={FirstnameInput || ''}
            id="firstname"
            name="firstname"
            placeholder="Firstname"
            onChange={handleInputChange}
          />
          <input
            type="text"
            value={LastnameInput || ''}
            id="lastname"
            name="lastname"
            placeholder="Lastname"
            onChange={handleInputChange}
          />
          <button
            className="outline outline-outlineclr h-11 w-32 text-textclr hover:bg-mainclr mx-5"
            onClick={(e) => {
              handleSubmit(e)
            }}
          >
            Save User
          </button>
          <button
            className="outline outline-outlineclr h-11 w-32 text-textclr hover:bg-mainclr"
            onClick={(e) => {
              handleDeleteSubmit(e)
            }}
          >
            Delete User
          </button>
          <input
            type="text"
            id="searchbar"
            name="searchbar"
            placeholder="Search for User"
            className="mx-5"
            onChange={handleSearchChange}
          />
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onChange={handleSelectAllChange}
                      checked={selectAllChecked}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Index
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  First Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Last Name
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((rdata, index) => (
                <tr
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  key={index}
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-table-search-${index}`}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        onChange={(e) => handleCheckboxChange(e, rdata.key)}
                        checked={selectedItems.includes(rdata.key)}
                      />
                    </div>
                  </td>

                  <th scope="row" className="py-4 px-6">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </th>
                  <td className=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {rdata.data.Username}
                  </td>
                  <td className="px-6 py-4">{rdata.data.Firstname}</td>
                  <td className="px-6 py-4">{rdata.data.Lastname}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <nav className="mt-4 flex justify-center">
          <ul className="pagination flex">
            {Array.from({
              length: Math.ceil(filteredTableData.length / itemsPerPage),
            }).map((_, index) => (
              <li key={index} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link mx-2"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Dashboard
