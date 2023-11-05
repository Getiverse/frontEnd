import { toast } from "react-toastify";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

export async function createAccount(
  email: string | null,
  password: string | null,
  fullName: string | null,
  retypePassword: string | null,
  setRegistred: (value: boolean) => void
) {
  if (!fullName) {
    toast.error("Enter your fullname");
    return false;
  }
  if (!email) {
    toast.error("Invalid Email");
    return false;
  }
  if (!password) {
    toast.error("Enter the password");
    return false;
  }
  if (password != retypePassword) {
    toast.error("Passwords are not the same");
    return false;
  }
  try {
    const result = await FirebaseAuthentication.createUserWithEmailAndPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (result.user?.uid) {
      /**add first name and last name to the jwt token */
      const currentUser = await FirebaseAuthentication.getCurrentUser();
      if (currentUser.user) {
        FirebaseAuthentication.updateProfile({ displayName: fullName });
      } else {
        toast.error("Error");
      }
      setRegistred(true);
    } else toast("Error during Account Creation");
  } catch (e: any) {
    toast.error(e.message);
    return false;
  }
}
