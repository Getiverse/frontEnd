import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { toast } from "react-toastify";
import { RegistrationStates } from "./registrationStates";
import { setRegistrationState } from "./storage/registrationState";

export async function verifyAccount() {
  try {
    await FirebaseAuthentication.sendEmailVerification();
    setRegistrationState(RegistrationStates.EmailValidation);
  } catch (e: any) {
    toast.error(e.message);
  }
}

export async function resetPassword(email: string | null) {
  if (!email) {
    toast.error("email non inserita");
    return false;
  }

  try {
    const result = await FirebaseAuthentication.sendPasswordResetEmail({
      email: email,
    });
    setRegistrationState(RegistrationStates.ResetPassword);
  } catch (e: any) {
    toast.error(e.message);
  }
}
