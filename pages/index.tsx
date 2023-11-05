import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { RoutesName } from '../utils/constants'
import { RegistrationStates } from '../inMemoryData/registration_and_login/registrationStates'
import { getRegistrationState, setRegistrationState } from '../inMemoryData/registration_and_login/storage/registrationState'

const Index: NextPage = () => {
    const router = useRouter();

    async function redirectBasedOnState() {
        const registrationState = await getRegistrationState();
        if (!registrationState) {
            setRegistrationState(RegistrationStates.INIT);
        }
        if (registrationState == RegistrationStates.INIT) {
            router.push(RoutesName.LOGIN);
        }
        else if (registrationState == RegistrationStates.EmailValidation) {
            router.push(RoutesName.VERIFICATION);
        }
        else if (registrationState == RegistrationStates.ResetPassword) {
            router.push(RoutesName.RESET);
        }
    }
    useEffect(() => {
        redirectBasedOnState();
    })

    return (
        <div>
            <Head>
                <title>Getiverse Redirect</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
        </div>
  )
}

export default Index
