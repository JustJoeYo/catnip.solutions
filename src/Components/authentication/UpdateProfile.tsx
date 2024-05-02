import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { ETypes, MessageCard } from '../Atoms/MessageCard'
import { AiFillExclamationCircle } from 'react-icons/ai'

import { useAuth, useToast, EToastTypes } from '../../contexts/types'
import BGparticles from '../particles/particles'

export default function UpdateProfile() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const { currentUser, updatePassword, updateEmail, deleteAccount } = useAuth()
  const { showTypedToast } = useToast()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteClicked, setDeleteClicked] = useState(0)
  const navigate = useNavigate()

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError('Passwords do not match')
    }

    const promises = []
    setLoading(true)
    setError('')

    if (emailRef.current?.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current?.value))
    }
    if (passwordRef.current?.value) {
      promises.push(updatePassword(passwordRef.current?.value))
    }

    Promise.all(promises)
      .then(() => {
        navigate('/')
        showTypedToast(EToastTypes.SUCCESS, 'Profile updated Successfully')
      })
      .catch(() => {
        setError('Failed to update account')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleDeleteSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    const button = document.getElementById('delete-button')
    if (button) {
      const randomX = Math.floor(
        Math.random() * (window.innerWidth - button.offsetWidth)
      )
      const randomY = Math.floor(
        Math.random() * (window.innerHeight - button.offsetHeight)
      )
      button.style.position = 'absolute'
      button.style.left = `${randomX}px`
      button.style.top = `${randomY}px`
      setDeleteClicked(deleteClicked + 1)
    }

    if (deleteClicked > 10) {
      console.log('Fine!')
      const promises = []
      setLoading(true)
      setError('')

      promises.push(deleteAccount())

      Promise.all(promises)
        .then(() => {
          navigate('/')
          showTypedToast(EToastTypes.SUCCESS, 'Profile Deleted Successfully')
        })
        .catch(() => {
          setError('Failed to delete account')
        })
        .finally(() => {
          setLoading(false)
        })
      return
    } else {
      console.log('NOPE!')
    }
  }

  return (
    <div className="absolute">
      <BGparticles />
      <div className="flex relative min-h-full h-screen w-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-5 outline outline-blue-400 rounded-3xl">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
              alt="Catnip.Solutions Logo"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Update Profile
            </h2>
          </div>
          <MessageCard message={error} type={ETypes.DANGER} visible={Boolean(error)} />
          <form className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  ref={emailRef}
                  defaultValue={currentUser.email}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="-space-y-px rounded-md shadow-sm">
              <h1 className="py-1 text-sm text-gray-500 flex items-center ">
                <AiFillExclamationCircle className="mr-1" /> Leave blank to keep
                the same
              </h1>
              <div>
                <label className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passwordRef}
                  className="relative block w-full appearance-none rounded-none rounded-t-md  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  ref={passwordConfirmRef}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </form>
          <div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative transition-colors flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Update
            </button>
          </div>
          <div>
            <button
              id="delete-button"
              onClick={handleDeleteSubmit}
              disabled={loading}
              className={`group relative transition-colors flex w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                deleteClicked ? 'w-auto' : ''
              }`}
            >
              {deleteClicked < 11
                ? deleteClicked
                  ? 'Are you sure?'
                  : 'Delete'
                : 'Fine!'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500"
              to="/"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
