import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { IconType } from "react-icons";
import { AiFillLinkedin, AiOutlineInstagram } from "react-icons/ai";
import { BsFacebook, BsLink45Deg } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { FIND_USER_PROFILE_BY_ID } from "../../graphql/query/author";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../../graphql/query/me";
import Button from "../buttons/Button";
import Text from "../Text";

function About() {
  const router = useRouter();
  const authorId = router.query.id as string;
  const { data: me, loading } = useQuery<GET_MY_PROFILE_PRIMARY_STATS>(
    GET_MY_PROFILE_PRIMARY_STATS,
    {
      skip: authorId != null && authorId.length > 0,
    }
  );

  const {
    data: author,
    loading: loadingAuhtor,
    refetch: refetchAuthor,
  } = useQuery<FIND_USER_PROFILE_BY_ID>(FIND_USER_PROFILE_BY_ID, {
    variables: {
      skip: !authorId,
      type: authorId,
    },
  });

  if (!loading) {
    return (
      <Fragment>
        <div className="pt-6 px-5 w-full pb-20 h-full">
          {(author?.findUserById || me?.me) && (
            <Text size="text-lg" weight="font-bold">
              {authorId ? author?.findUserById.name : me?.me.name}
            </Text>
          )}
          {((author?.findUserById && author?.findUserById.bio.length > 0) ||
            (me?.me && me?.me.bio.length > 0)) && (
            <div className="w-full border-b border-gray-300 dark:border-gray-700 pb-2 mt-2">
              <Text size="text-lg" weight="font-medium">
                Bio:
              </Text>
              <Text size="text-md">
                {authorId ? author?.findUserById.bio : me?.me.bio}
              </Text>
            </div>
          )}
          {((me && me.me.links.length > 0) ||
            (author && author.findUserById.links.length > 0)) && (
            <div className="w-full border-b border-gray-300 dark:border-gray-700 pb-2 mt-2">
              <Text size="text-lg" weight="font-medium">
                Links:
              </Text>
              <Links
                data={authorId ? author?.findUserById.links : me?.me.links}
              />
            </div>
          )}
          {((me && me.me.socialLinks.length > 0) ||
            (author && author.findUserById.socialLinks.length > 0)) && (
            <SocialLinks
              data={
                authorId ? author?.findUserById.socialLinks : me?.me.socialLinks
              }
            />
          )}
          {((me && me?.me.contact) ||
            (author && author?.findUserById.contact)) && (
            <Button
              className="bg-blue-500 w-44 text-white rounded-md fixed bottom-6 left-1/2 -translate-x-1/2"
              text="Contact"
              type="primary"
              onClick={() =>
                router.push(
                  "mailto:" +
                    (me ? me?.me.contact : author?.findUserById.contact)
                )
              }
              padding="py-2"
            />
          )}
        </div>
      </Fragment>
    );
  }
}

const Links = ({
  data,
}: {
  data: { name: string; url: string }[] | undefined;
}) => {
  if (!data) return <></>;

  return (
    <div className="flex items-center w-full space-x-5 pb-3 pt-1">
      {data.map((link) => {
        return (
          <div className="flex items-center space-x-1">
            <BsLink45Deg size={30} className="text-blue-500" />
            <Link
              passHref
              target={"_blank"}
              className="text-blue-500"
              href={`https://${link.url}`}
            >
              {link.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

const SocialLinks = ({ data }: { data: string[] | undefined }) => {
  if (!data) return <></>;

  return (
    <div className="my-3 border-b border-gray-300 dark:border-gray-700">
      <Text size="text-lg" className="mb-2" weight="font-medium">
        Socials:
      </Text>
      <div className="flex items-center w-full space-x-5 pb-4">
        {data.map((social) => {
          let linkData = getSocialLink(social);
          return (
            linkData && (
              <Link
                passHref
                href={`https://${linkData?.link ? linkData.link : ""}`}
                target="_blank"
              >
                <linkData.Icon />
              </Link>
            )
          );
        })}
      </div>
    </div>
  );
};

function getSocialLink(link: string) {
  let socialsLogo = {
    instagram: (props: IconType) => (
      <AiOutlineInstagram className="text-pink-500" size={30} {...props} />
    ),
    facebook: (props: IconType) => (
      <BsFacebook className="text-blue-500" size={30} {...props} />
    ),
    linkedin: (props: IconType) => (
      <AiFillLinkedin className="text-blue-500" size={34} {...props} />
    ),
  };

  for (let obj in socialsLogo) {
    if (link.includes(obj)) {
      return {
        link: link,
        /**@ts-ignore */
        Icon: socialsLogo[obj],
        name: link.slice(link.indexOf(obj)),
      };
    }
  }
}

export default About;
