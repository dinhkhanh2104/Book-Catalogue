import { auth } from "./firebase"
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"

export const doCreateUserWithEmailAndPassword = async (email, pass) => {
    return createUserWithEmailAndPassword(auth, email, pass)
}

export const doSignInWithEmailAndPassword = async (email, pass) => {
    return signInWithEmailAndPassword(auth, email, pass)
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
}

export const doSignOut = () => {
    return auth.signOut()
}