import {getAuth, onAuthStateChanged, signInAnonymously} from 'firebase/auth'
import {User} from '../models/User'
import {atom, useRecoilState} from 'recoil'
import {useEffect} from 'react'
import {
  getFirestore,
  collection,
  doc, 
  getDoc, 
  setDoc
} from 'firebase/firestore'

const userState = atom<User>({
  key: 'user',
  default: null
})

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState) 
  useEffect(() => {
    if (user !== null) {
      return
    }
    const auth = getAuth()
    console.log('start useEffect')
    signInAnonymously(auth).catch(error => {
      console.log('error', error)
    })
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('set user')
        const loginUser:User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: ''
        }
        setUser(loginUser)
        createUserIfNotFound(loginUser)
      } else {
        setUser(null)
      }
    })
  }, [])
  return {user}
}

async function createUserIfNotFound(user:User) {
  const db = getFirestore()
  const usersCollection = collection(db, 'users')
  const userRef = doc(usersCollection, user.uid)
  const document = await getDoc(userRef)
  if (document.exists()) {
    return
  }
  await setDoc(userRef, {
    name: `taro ${new Date().getTime()}`
  })
}
 

// function authenticate() {
//   const auth = getAuth()
//   console.log('auth', auth)
//   signInAnonymously(auth)
//     .catch((error) => {
//       console.log('error', error)
//     })
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log('user uid', user.uid)
//       console.log('anonymous', user.isAnonymous)
//     } else {
//       console.log('no user')
//     }
//   })
// }

// if (process.browser) {
//   authenticate()
// }