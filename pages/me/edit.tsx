import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "../../components/container/Container";
import Avatar from "../../components/Avatar";
import { BiChevronLeft } from "react-icons/bi";
import { IoImageOutline } from "react-icons/io5";
import Text from "../../components/Text";
import CustomInput from "../../components/input/CustomInput";
import CustomTextArea from "../../components/CustomTextArea";
import Button from "../../components/buttons/Button";
import ImagePickerModal from "../../components/specialModals/ImagePickerModal";
import { imageUploaded } from "../../utils/atoms/imageUploaded";
import { useRecoilState } from "recoil";
import dynamic from "next/dynamic";
import ImageCropper from "../../components/ImageCropper";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../../components/types/Modal";
import ShowLinksAvailableModal from "../../components/specialModals/ShowLinksAvailableModal";
import AddLinkModals from "../../components/AddLinkModal";
import { IconType } from "react-icons/lib";
import { IoMdRemoveCircleOutline } from "react-icons/io";
const UnsplashUploader = dynamic(
  () => import("../../components/UnplashUploader"),
  { ssr: false }
);
import Link from "next/link";
import RoutingGuard from "../../components/RoutingGuard";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_PROFILE } from "../../graphql/mutation/me";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../graphql/query/me";
import Loading from "../../components/Loading";
import { handleImageType, uploadLocalFiles } from "../../utils/functions";
import { BsFacebook, BsLink45Deg } from "react-icons/bs";
import { AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import { IconProps } from "../../components/calendar/types";
import useUid from "../../hooks/useUid";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const Edit: NextPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useRecoilState(imageUploaded);
  const [open, setOpen] = useState(false);
  const [openUplash, setOpenUplash] = useState(false);
  const [background, setBackground] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [imageType, setImageType] = useState("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [modal, setModal] = useRecoilState(moreModal);
  const uid = useUid();
  const [loading, setLoading] = useState(false);
  const {
    data: myInfo,
    loading: myInfoLoading,
    refetch: refetchMyInfo,
  } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(GET_MY_PROFILE_PRIMARY_STATS);

  const [updateProfile, { data: updateState }] = useMutation<{
    updateMyProfile: { id: string };
  }>(UPDATE_PROFILE);
  const [links, setLinks] = useState<
    {
      firstValue: string;
      secondValue: string;
      name: string;
      Icon: IconType;
    }[]
  >([]);

  const [addLinkState, setAddLinkState] = useState<{
    name: string;
    labelOne: string;
    placeHolderOne: string;
    labelTwo: string;
    placeHolderTwo: string;
    multiple: boolean;
    Icon: IconType | null;
  }>({
    name: "",
    labelOne: "",
    placeHolderOne: "",
    labelTwo: "",
    placeHolderTwo: "",
    multiple: false,
    Icon: null,
  });

  useEffect(() => {
    if (myInfo && !background && !avatarImage) {
      setBackground(myInfo?.me.backgroundImage);
      setAvatarImage(myInfo?.me.profileImage);
    }
  }, [myInfo]);

  useEffect(() => {
    if (croppedImage && imageType == "background") {
      setBackground(croppedImage);
      setCroppedImage(null);
    } else if (croppedImage && imageType == "avatar") {
      setAvatarImage(croppedImage);
      setCroppedImage(null);
    }
  }, [croppedImage]);

  useEffect(() => {
    if (
      !name &&
      !userName &&
      myInfo &&
      myInfo.me.name &&
      myInfo.me.userName &&
      myInfo.me.socialLinks
    ) {
      setName(myInfo.me.name);
      setUserName(myInfo.me.userName);
      setBio(myInfo.me.bio);
      setLinks([...deserealizeSocialLinks(myInfo.me.socialLinks)]);
      myInfo.me.contact &&
        setLinks((prev) => [
          ...prev,
          {
            Icon: () => <HiOutlineMail className="text-blue-500" size={30} />,
            firstValue: myInfo.me.contact,
            name: "Contact",
            secondValue: "",
          },
        ]);
      setLinks((prev) => [...prev, ...deserealizeCustomLinks(myInfo.me.links)]);
    }
  }, [myInfo?.me]);

  if (myInfoLoading) return <Loading />;
  return (
    <RoutingGuard>
      <ShowLinksAvailableModal setAddLinkState={setAddLinkState} />
      <AddLinkModals
        addLinkState={addLinkState}
        setLinks={setLinks}
        links={links}
      />
      <ImagePickerModal
        open={open}
        setOpen={setOpen}
        setOpenUplash={setOpenUplash}
        removeVideos
      />
      {image && (
        <ImageCropper
          aspect={imageType == "avatar" ? 4 / 4 : 3 / 2}
          close={() => setImage("")}
          cropShape={imageType == "avatar" ? "round" : "rect"}
          setCroppedImage={setCroppedImage}
          image={image}
        />
      )}
      {openUplash && <UnsplashUploader setOpen={setOpenUplash} />}
      <Container bg="bg-gray-50">
        <LoadingSpinner open={loading} />
        {myInfo && (
          <ProfileBanner
            setOpenModal={setOpen}
            background={background}
            avatarImage={avatarImage}
            setImageType={setImageType}
          />
        )}
        <main className="pt-14 pb-10 px-8">
          <Text
            color="text-white"
            className="bg-gradient-to-r from-blue-500 to-pink-500 w-32 text-center py-1 shadow rounded-md"
          >
            Edit Profile
          </Text>
          <div className="space-y-3 mt-3">
            <CustomInput
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <CustomInput
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
              label="Username"
              type="text"
            />
            <CustomTextArea
              value={bio}
              onChange={(e) => setBio(e.currentTarget.value)}
              label="Bio"
              type="text-area"
              height="h-36"
            />
            <div className="space-y-5">
              {links.map((val, idx) => (
                <div className="flex items-center justify-between" key={idx}>
                  <Link
                    href={
                      val.name == "Contact"
                        ? "mailto:" + val.firstValue
                        : val.firstValue
                    }
                    className="flex items-center space-x-3"
                  >
                    <val.Icon size={30} className="text-blue-500" />
                    <Text>
                      {val.secondValue.length > 0 ? val.secondValue : val.name}
                    </Text>
                  </Link>
                  <IoMdRemoveCircleOutline
                    className="text-red-500 cursor-pointer"
                    size={24}
                    onClick={() =>
                      setLinks((prev) => prev.filter((v, i) => i !== idx))
                    }
                  />
                </div>
              ))}
            </div>
            <Button
              type="thirdary"
              text="Add Link"
              onClick={() =>
                setModal((prev) => ({
                  ...prev,
                  open: true,
                  type: ModalType.SHOW_LINKS_AVAILABLE,
                }))
              }
              className="text-left"
            />
          </div>
          <Button
            onClick={async () => {
              setLoading(true);
              updateProfile({
                variables: {
                  type: {
                    name: name,
                    userName: userName,
                    links: extractCustomLinks(links),
                    socialLinks: extractSocialLinks(links),
                    contact: extractContact(links),
                    profileImage: await uploadLocalFiles(avatarImage),
                    backgroundImage: await uploadLocalFiles(background),
                    bio: bio,
                  },
                },
                update: async (cache, { data, errors }) => {
                  const cachedProfile =
                    cache.readQuery<GET_MY_PROFILE_PRIMARY_STATS>({
                      query: GET_MY_PROFILE_PRIMARY_STATS,
                    });
                  if (cachedProfile?.me)
                    await cache.writeQuery({
                      query: GET_MY_PROFILE_PRIMARY_STATS,
                      data: {
                        me: {
                          ...cachedProfile.me,
                          name: name,
                          userName: userName,
                          links: extractCustomLinks(links),
                          socialLinks: extractSocialLinks(links),
                          contact: extractContact(links),
                          profileImage: await uploadLocalFiles(avatarImage),
                          backgroundImage: await uploadLocalFiles(background),
                          bio: bio,
                        },
                      },
                    });
                  setLoading(false);
                  router.replace("/me");
                  toast.success("profile updated with success");
                },
              });
            }}
            type="primary"
            text="Save"
            className="w-full mt-2"
          />
        </main>
      </Container>
    </RoutingGuard>
  );
};

export default Edit;

function ProfileBanner({
  background,
  avatarImage,
  setOpenModal,
  setImageType,
}: {
  background: string;
  setOpenModal: (val: boolean) => void;
  avatarImage: string;
  setImageType: (val: string) => void;
}) {
  const router = useRouter();
  return (
    <div className="w-full relative h-32">
      <button
        onClick={() => router.back()}
        className="bg-blue-500 rounded-full opacity-80 p-1 absolute z-[2] left-4 top-6"
      >
        <BiChevronLeft className="text-white" size={30} />
      </button>
      <Image
        src={handleImageType(background)}
        fill
        className="object-cover object-center"
        alt="user background"
      />
      <div className="absolute -bottom-8 z-[2] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="relative shadow-md rounded-full">
          <Avatar width="w-24" height="h-24" src={avatarImage} />
          <ChangeImageComponent
            setImageType={setImageType}
            setOpenModal={setOpenModal}
            className="right-0 -bottom-3"
            type="avatar"
            size={20}
          />
        </div>
      </div>
      <ChangeImageComponent
        type="background"
        setOpenModal={setOpenModal}
        setImageType={setImageType}
        className="right-4 -bottom-4 scale-110"
        size={20}
      />
    </div>
  );
}

function ChangeImageComponent({
  size,
  className,
  setOpenModal,
  setImageType,
  type,
}: {
  size: number;
  className: string;
  setOpenModal: (val: boolean) => void;
  type: string;
  setImageType: (val: string) => void;
}) {
  return (
    <button
      onClick={() => {
        setOpenModal(true);
        setImageType(type);
      }}
      className={`bg-gray-400 opacity-90 rounded-full p-2 absolute z-[2] ${className}`}
    >
      <IoImageOutline size={size} className="text-white" />
    </button>
  );
}

function extractSocialLinks(
  links: {
    firstValue: string;
    secondValue: string;
    name: string;
    Icon: IconType;
  }[]
) {
  const socials = ["Linkedin", "Instagram", "Facebook"];
  let socialLinks = [];
  for (let i = 0; i < links.length; i++) {
    if (socials.includes(links[i].name)) {
      socialLinks.push(links[i].firstValue);
    }
  }
  return socialLinks;
}

function extractCustomLinks(
  links: {
    firstValue: string;
    secondValue: string;
    name: string;
    Icon: IconType;
  }[]
) {
  let customLinks = [];
  for (let i = 0; i < links.length; i++) {
    if (links[i].name == "Custom Link") {
      customLinks.push({
        name: links[i].secondValue,
        url: links[i].firstValue,
      });
    }
  }
  return customLinks;
}

function extractContact(
  links: {
    firstValue: string;
    secondValue: string;
    name: string;
    Icon: IconType;
  }[]
) {
  for (let i = 0; i < links.length; i++) {
    if (links[i].name.toLowerCase() == "contact") {
      return links[i].firstValue;
    }
  }
}

function deserealizeSocialLinks(links: string[]) {
  let socialsLogo = {
    instagram: (props: IconProps) => (
      <AiOutlineInstagram className="text-pink-500" size={30} {...props} />
    ),
    facebook: (props: IconProps) => (
      <BsFacebook className="text-blue-500" size={30} {...props} />
    ),
    linkedin: (props: IconProps) => (
      <AiFillLinkedin className="text-blue-500" size={34} {...props} />
    ),
  };
  let result: {
    Icon: IconType;
    firstValue: string;
    secondValue: string;
    name: string;
  }[] = [];
  for (let i = 0; i < links.length; i++) {
    for (let obj in socialsLogo) {
      if (links[i].includes(obj)) {
        result.push({
          /**@ts-ignore */
          Icon: socialsLogo[obj],
          firstValue: links[i],
          secondValue: "",
          name: obj.charAt(0).toUpperCase() + obj.slice(1),
        });
      }
    }
  }
  return result;
}

function deserealizeCustomLinks(customLinks: { name: string; url: string }[]) {
  let result = [];
  for (let i = 0; i < customLinks.length; i++) {
    result.push({
      Icon: () => <BsLink45Deg size={30} />,
      firstValue: customLinks[i].url,
      secondValue: customLinks[i].name,
      name: "Custom Link",
    });
  }
  return result;
}
