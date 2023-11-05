import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { RoutesName } from "../utils/constants";
import { RegistrationStates } from "../inMemoryData/registration_and_login/registrationStates";
import { setRegistrationState } from "../inMemoryData/registration_and_login/storage/registrationState";
import { RoutingGuard } from "./types/RoutingGuard";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { delay } from "../utils/functions";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import useUid from "../hooks/useUid";
function RoutingGuard({ children, skipValidation = false }: RoutingGuard) {
  const router = useRouter();
  const [access, setAccess] = useState(false);
  const uid = useUid();
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(getAuth(), (user) => {
      async function handleCheckAccess() {
        setRegistrationState(RegistrationStates.INIT);
        try {
          if (!uid && !skipValidation) {
            router.replace(RoutesName.LOGIN);
          } else {
            setAccess(true);
          }
        } catch (e) {
          router.replace(RoutesName.LOGIN);
        }
      }
      handleCheckAccess();
    });
    return () => unSubscribe();
  }, []);

  return <Fragment>{access && children}</Fragment>;
}

export default RoutingGuard;
