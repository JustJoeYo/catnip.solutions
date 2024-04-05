import { useState } from 'react'
import { useToast, EToastTypes } from '../../contexts/types'

let numbaaaa: Number

export default function NumberGuesser() {
  const [loading, setLoading] = useState(false)
  const { showTypedToast } = useToast()

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    try {
      setLoading(true)
      if (numbaaaa != undefined && numbaaaa != null) {
        showTypedToast(
          EToastTypes.SUCCESS,
          'The number you were thinking of was ' + numbaaaa + '!'
        )
      } else {
        showTypedToast(
          EToastTypes.ERROR,
          'WRONG FORMAT! Please use your eyes before submitting again!'
        )
      }
    } catch {
      showTypedToast(EToastTypes.ERROR, 'FAIL')
    }

    setLoading(false)
  }

  return (
    <>
      <div className="bg-popclr text-textclr outline outline-outlineclr h-full p-5 m-5">
        <div className="align-middle justify-center text-center flex">
          <input
            id="numbaaaa"
            placeholder="Number You Are Thinking Of"
            className="text-xs outline outline-outlineclr h-12 w-48 my-20"
            onInput={(e) => (numbaaaa = Number(e.currentTarget.value))}
            type="text"
            pattern="[0-9]*"
          ></input>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="text-2xl outline outline-outlineclr h-12 w-32 my-20"
          >
            GUESS
          </button>
        </div>
      </div>
    </>
  )
}
