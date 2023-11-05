import { RefObject, useEffect } from 'react'

const useOutsideClick = (
  ref: RefObject<HTMLDivElement>,
  callback: (e: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        return callback(e)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [callback, ref])
}

export default useOutsideClick
