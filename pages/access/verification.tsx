import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Container from "../../components/container/Container";
import Title from "../../components/Title";
import { IoIosArrowBack } from "react-icons/io";
import {
  getRegistrationState,
  setRegistrationState,
} from "../../inMemoryData/registration_and_login/storage/registrationState";
import { RegistrationStates } from "../../inMemoryData/registration_and_login/registrationStates";
import { verifyAccount } from "../../inMemoryData/registration_and_login/validation";
import Text from "../../components/Text";
import { MdEmail } from "react-icons/md";
import Button from "../../components/buttons/Button";
import Link from "next/link";
import { RoutesName } from "../../utils/constants";
import { emailAccess } from "../../utils/atoms/access/emailAccess";
const RESEND_TIME = 30;

const Verify: NextPage = () => {
  const router = useRouter();
  const email = useRecoilValue(emailAccess);
  const [resendCountDown, setResendCountDown] = useState(RESEND_TIME);
  const [emailsSent, setEmailsSent] = useState(1);
  const [disableButton, setDisabledButton] = useState(true);

  //send email verification on page load
  useEffect(() => {
    getRegistrationState().then((state) => {
      if (state == RegistrationStates.INIT) {
        verifyAccount();
      }
    });
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
      return () => {
        clearInterval(counter);
      };
    }
  }, []);

  return (
    <Container bg="bg-gray-50 flex flex-col items-center py-32 px-8">
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
      <Title size="text-4xl mt-12">Verify your Email</Title>
      <Text weight="font-normal mt-12" className="text-center">
        To confirm your email address, tap the link in the email that we sent to{" "}
        {email}
      </Text>
      <Button
        disabled={disableButton}
        type="primary"
        text="Resend Email"
        onClick={() => {
          verifyAccount();
          setEmailsSent((prev) => prev + 1);
          setDisabledButton(true);
        }}
        className="mt-8 mb-2"
        padding="py-4 px-3"
      />
      <div className="my-6 flex w-full items-center justify-center flex-col">
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
      <p className="text-slate-600 text-center mt-2">
        Already have an Account?{" "}
        <Link
          href={RoutesName.LOGIN}
          onClick={() => setRegistrationState(RegistrationStates.INIT)}
          className="underline text-lg text-blue-500"
        >
          Login
        </Link>
      </p>
    </Container>
  );
};

export default Verify;
