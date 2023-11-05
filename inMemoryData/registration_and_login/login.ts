import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { Device } from "@capacitor/device";
import { NextRouter } from "next/router";
import { toast } from "react-toastify";

export async function loginWithEmailAndPassword(
  email: string,
  password: string,
  remember: boolean,
  router: NextRouter,
  setAuth: Dispatch<SetStateAction<boolean>>
) {
  try {
    const result = await FirebaseAuthentication.signInWithEmailAndPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (result.user) sessionStorage.setItem("uid", result.user?.uid);
    if (result.user?.emailVerified == false) {
      router.push("verification");
      return;
    }
    const token = (await FirebaseAuthentication.getIdToken()).token;
    if (token) {
      sessionStorage.setItem("token", token);
      setAuth(true);
    }
  } catch (e: any) {
    toast.error(e.message);
  }
}

export async function loginWithGoogle(
  remember: boolean,
  setAuth: Dispatch<SetStateAction<boolean>>
) {
  try {
    const user = await FirebaseAuthentication.signInWithGoogle();
    FirebaseAuthentication.useAppLanguage();
    const token = (await FirebaseAuthentication.getIdToken()).token;
    if (token && user.user) {
      setAuth(true);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("uid", user.user?.uid);
    }
  } catch (e: any) {
    toast.error(e.message);
  }
}

export async function resetPassword(email: string) {
  try {
    await FirebaseAuthentication.sendPasswordResetEmail({ email: email });
  } catch (e: any) {
    history.back();
    toast.error(e.message);
  }
}
