
import { useCallback, useReducer, useEffect, useRef } from 'react';
import api from "./api";

//used as status
const LOADED = 'LOADED'
const INIT = 'INIT'
const PENDING = 'PENDING'
const FILES_UPLOADED = 'FILES_UPLOADED'
const UPLOAD_ERROR = 'UPLOAD_ERROR'

const initialState = {
    files: [], //is where the user initially loads an array of files by selecting them from the file input.
    pending: [], //will be used to let the UI know what file is currently being processed and how many files are left over.
    next: null, //will be assigned the next item in the pending array when the code detects that it’s ready to do so.
    uploading: false, //will be used for the code to know that files are still being uploaded.
    uploaded: {}, //will be the object we insert files into as soon as they are done uploading.
    status: 'idle', //is provided as extra convenience mainly for the user interface to utilize to its advantage.
}

const logUploadedFile = (num, color = 'green') => {
  const msg = `%cUploaded ${num} files.`
  const style = `color:${color};font-weight:bold;`
  console.log(msg, style)
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'load': //The action when user put files onto browser.
          return {...state, files: action.files, status: LOADED}
        case 'submit': //handle conveying files to remote server
          return { ...state, uploading: true, pending: state.files, status: INIT }
        case 'next':
          return {
            ...state,
            next: action.next,
            status: PENDING,
          }
        case 'file-uploaded':
          return {
            ...state,
            next: null,
            pending: action.pending,
            uploaded: {
              ...state.uploaded,
              [action.prev.id]: action.prev.file,
            },
          }
        case 'files-uploaded':
          return { ...state, uploading: false, status: FILES_UPLOADED }
        case 'set-upload-error':
          return { ...state, uploadError: action.error, status: UPLOAD_ERROR }
        default:
            return state
    }
}

const useFileHandlers = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    //handle when user put files by using input(upload)
    const onChange = (e) => {
        if (e.target.files.length) {
            const arrFiles = Array.from(e.target.files) //e.target.files is a FileList, not an arry. so need to convert it to array.
            const files = arrFiles.map((file, index) => {
                const src = window.URL.createObjectURL(file) //create a blob string
                return { file, id: index, src }
            })
            dispatch({ type: 'load', files })
        }
    }
    const onSubmit = useCallback(
        (e) => {
          e.preventDefault()
          if (state.files.length) {
            dispatch({ type: 'submit' })
          } else {
            window.alert("You don't have any files loaded.")
          }
        },
        [state.files.length],
      )
      // Sets the next file when it detects that state.next can be set again
      useEffect(() => {
        if (state.pending.length && state.next == null) {
          const next = state.pending[0]
          dispatch({ type: 'next', next })
        }
      }, [state.next, state.pending])
      
      const countRef = useRef(0)
      // Processes the next pending thumbnail when ready

      useEffect(() => {
        if (state.pending.length && state.next) {
          const { next } = state
          api
            .uploadFile(next)
            .then(() => {
              const prev = next
              logUploadedFile(++countRef.current)
              const pending = state.pending.slice(1)
              dispatch({ type: 'file-uploaded', prev, pending })
            })
            .catch((error) => {
              console.error(error)
              dispatch({ type: 'set-upload-error', error })
            })
        }
      }, [state])
      // Ends the upload process
      useEffect(() => {
        if (!state.pending.length && state.uploading) {
          dispatch({ type: 'files-uploaded' })
        }
      }, [state.pending.length, state.uploading])
      return {
        ...state,
        onSubmit,
        onChange,
      }
}

export default useFileHandlers;
