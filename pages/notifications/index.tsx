import { useRouter } from "next/router";
import Container from "../../components/container/Container";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import RecomandedAuthor from "../../components/RecomandedAuthor";
import RoutingGuard from "../../components/RoutingGuard";
import Text from "../../components/Text";
import getiverseLogo from "/public/icons/getiverse_dark.svg";

function Notifications() {
  const router = useRouter();
  return (
    <RoutingGuard>
      <Container bg="bg-gray-50">
        <div className="flex flex-col w-full h-screen">
          <Header label="Notifications" hideIcons={true} />
          <main className="px-5 pt-5 pb-24 h-full flex-1 overflow-y-scroll scrollbar-hide">
            {/* <div>
              <Text color="text-gray-800">Today</Text>
              <div className="space-y-6 mt-3">
                <RecomandedAuthor
                  onClick={() => router.push("author/cippa")}
                  text="Read"
                  time="12 hours ago"
                  notification={true}
                  id={8}
                  src={avatarTest}
                  alt="profile image"
                  author="Rynold Home"
                  bio="Rynold has posted a new Article
you can see it."
                />
                <RecomandedAuthor
                  onClick={() => router.push("notifications/update")}
                  text="More"
                  time="12 hours ago"
                  notification={true}
                  id={8}
                  src={getiverseLogo}
                  alt="profile image"
                  author="Rynold Home"
                  bio="Rynold has posted a new Article
you can see it."
                />
              </div>
            </div>
            <div className="mt-5">
              <Text color="text-gray-800">This Week</Text>
              <div className="space-y-6 mt-3">
                <RecomandedAuthor
                  onClick={() => router.push("author/cippa")}
                  text="Read"
                  time="12 hours ago"
                  notification={true}
                  id={8}
                  src={avatarTest}
                  alt="profile image"
                  author="Rynold Home"
                  bio="Rynold has posted a new Article
you can see it."
                />
                <RecomandedAuthor
                  onClick={() => router.push("notifications/update")}
                  text="More"
                  time="12 hours ago"
                  notification={true}
                  id={8}
                  src={getiverseLogo}
                  alt="profile image"
                  author="Rynold Home"
                  bio="Rynold has posted a new Article
you can see it."
                />
              </div>
            </div>
            <div className="mt-5">
              <Text color="text-gray-800">Older</Text>
              <div className="space-y-6 mt-3">
                <RecomandedAuthor
                  onClick={() => router.push("author/cippa")}
                  text="Read"
                  time="12 hours ago"
                  notification={true}
                  id={8}
                  src={avatarTest}
                  alt="profile image"
                  author="Rynold Home"
                  bio="Rynold has posted a new Article
you can see it."
                />
                <RecomandedAuthor
                  onClick={() => router.push("notifications/update")}
                  text="More"
                  time="12 hours ago"
                  notification={true}
                  id={8}
                  src={getiverseLogo}
                  alt="profile image"
                  author="Rynold Home"
                  bio="Rynold has posted a new Article
you can see it."
                />
              </div>
            </div> */}
          </main>
          <TabBar />
        </div>
      </Container>
    </RoutingGuard>
  );
}

export default Notifications;
