import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists

  let token = sessionStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
export const urlServer = process.env.NEXT_PUBLIC_BACKEND_URL;
export const client = new ApolloClient({
  ssrMode: true,
  link: authLink.concat(
    createHttpLink({
      uri: urlServer + "/graphql",
      credentials: "include",
    })
  ),
  cache: new InMemoryCache({ addTypename: false }),
});
