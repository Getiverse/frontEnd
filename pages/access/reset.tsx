import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "../../components/container/Container";
import Title from "../../components/Title";
import { IoIosArrowBack } from "react-icons/io";
import Head from "next/head";
import { useRecoilValue } from "recoil";
import { resetPassword } from "../../inMemoryData/registration_and_login/login";
import { MdEmail } from "react-icons/md";
import { setRegistrationState } from "../../inMemoryData/registration_and_login/storage/registrationState";
import { RegistrationStates } from "../../inMemoryData/registration_and_login/registrationStates";
import Button from "../../components/buttons/Button";
import Text from "../../components/Text";
import Link from "next/link";
import { RoutesName } from "../../utils/constants";
import { emailAccess } from "../../utils/atoms/access/emailAccess";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

const RESEND_TIME = 30;

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const email = useRecoilValue(emailAccess);
  const [resendCountDown, setResendCountDown] = useState(RESEND_TIME);
  const [emailsSent, setEmailsSent] = useState(1);
  const [disableButton, setDisabledButton] = useState(true);

  //send email verification on page load
  useEffect(() => {
    try {
      resetPassword(email);
    } catch (e) {
      alert(e);
    }
  }, []);

  //disable button verification every x seconds
  useEffect(() => {
    if (disableButton) {
      let counter = setInterval(() => {
        if (resendCountDown == 0) {
          setResendCountDown(RESEND_TIME * 2 * emailsSent);
          setDisabledButton(false);
        } else {
          setResendCountDown((prev) => prev - 1);
        }
      }, 1000);
      return () => clearInterval(counter);
    }
  }, []);

  return (
    <Container bg="bg-gray-50 flex flex-col items-center pt-20 px-8">
      <Head>
        <title>Getiverse Verification</title>
      </Head>
      <IoIosArrowBack
        className="absolute top-6 left-4"
        color="#4B5563"
        size={30}
        onClick={() => {
          setRegistrationState(RegistrationStates.INIT);
          router.back();
        }}
      />
      <div className="p-6 bg-gradient-to-b from-sky-400 to-pink-400 rounded-xl flex items-center justify-center">
        <MdEmail size="62" color="white" />
      </div>
      <Title size="text-4xl mt-6">Check your Email</Title>
      <Text weight="font-normal mt-6" className="text-center">
        To reset your password check your address: {email}, tap the Link in the
        email we sent to you.
      </Text>
      <Button
        disabled={disableButton}
        type="primary"
        text="Resend Email"
        onClick={() => {
          resetPassword(email);
          setEmailsSent((prev) => prev + 1);
          setDisabledButton(true);
        }}
        className="my-8 w-full"
        padding="py-4"
      />
      <div className="py-2 flex w-full items-center justify-center flex-col">
        {disableButton && (
          <>
            <p className="text-blue-500 text-lg">Resend In:</p>
            <div className="relative scale-125 my-4">
              <div
                className="spinner-border animate-spin w-8 h-8 border-4 rounded-full text-blue-600"
                role="status"
              />
              <p className="text-sm text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {resendCountDown}
              </p>
            </div>
          </>
        )}
      </div>
      <p className="text-slate-600 text-center mt-4">
        If you have completed the reset press the link bellow:
      </p>
      <Link
        href={RoutesName.LOGIN}
        onClick={() => setRegistrationState(RegistrationStates.INIT)}
        className="underline text-lg text-blue-500 mt-2"
      >
        Login
      </Link>
    </Container>
  );
};

export default ResetPassword;
