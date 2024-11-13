import Keycloak from "keycloak-js";

const loginOptions = {
  redirectUri: import.meta.env.VITE_SSO_REDIRECT_URI,
  idpHint: "",
};

const options = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
};

const keycloak = new Keycloak(options);
let authenticated: any;
let store = null;

/**
 * Initializes Keycloak, then run callback. This will prompt you to login.
 *
 * @param onAuthenticatedCallback
 */
async function init() {
  let updateTokenInterval: any;
  // The expired token is also used for general update token failures
  // i.e., network disconnection
  let expiredTokenInterval: any;

  try {
    authenticated = await keycloak.init({
      pkceMethod: "S256",
      checkLoginIframe: false,
      onLoad: "check-sso",
    });

    function updateToken(seconds: number) {
      keycloak
        .updateToken(seconds)
        .then((refreshed) => {
          if (refreshed) {
            if (expiredTokenInterval) clearInterval(expiredTokenInterval);
          } else {
            // token is still valid
          }
        })
        .catch(() => {
          // We're failing to update the token
        });
    }

    keycloak.onAuthSuccess = () => {
      // Check token validity every 10 seconds (10 000 ms) and, if necessary, update the token.
      // Refresh token if it's valid for less then 60 seconds
      updateTokenInterval = setInterval(async () => {
        updateToken(60);
      }, 10000);
      // logout();
      clearInterval(updateTokenInterval);
      clearInterval(expiredTokenInterval);
    };

    keycloak.onTokenExpired = () => {
      if (!expiredTokenInterval) {
        expiredTokenInterval = setInterval(() => {
          updateToken(60);
        }, 7000);
      }
      updateToken(60);
    };

    if (authenticated) {
      return keycloak;
    } else {
      keycloak.login(loginOptions);
    }
  } catch (error) {
    console.error("Keycloak init failed");
    console.error(error);
  }
}

/**
 * Logs user in
 */
async function login(redirectUri = window.location.href) {
  try {
    await keycloak.login({ ...loginOptions, redirectUri });
  } catch (error) {
    console.error("Keycloak login failed");
    console.error(error);
  }
}

/**
 * Initializes store with Keycloak user data
 *
 */
async function initStore(storeInstance: any, clearData = true) {
  try {
    store = storeInstance;
    store.initOauth(keycloak, clearData);

    // Force login if user is not authenticated
    if (!authenticated) {
      store.login();
    }
  } catch (error) {
    console.error("Keycloak init failed");
    console.error(error);
  }
}

/**
 * Logout user
 */
const logout = () => {
  window.location.href = `https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${encodeURIComponent(
    `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${
      import.meta.env.VITE_KEYCLOAK_REALM
    }/protocol/openid-connect/logout?post_logout_redirect_uri=` +
      import.meta.env.VITE_SSO_REDIRECT_URI +
      "&client_id=" +
      import.meta.env.VITE_KEYCLOAK_CLIENT_ID
  )}`;
};
/**
 * Refreshes token
 */
async function refreshToken() {
  try {
    await keycloak.updateToken(480);
    return keycloak;
  } catch (error) {
    console.error("Failed to refresh token");
    console.error(error);
  }
}

async function getToken() {
  try {
    return keycloak.token;
  } catch (error) {
    console.error("Failed to get token");
    console.error(error);
  }
}

async function parseToken() {
  try {
    return keycloak.tokenParsed;
  } catch (error) {
    console.error("Failed to parse token");
    console.error(error);
  }
}

const KeycloakService = {
  CallInit: init,
  CallInitStore: initStore,
  CallLogout: logout,
  CallTokenRefresh: refreshToken,
  CallLogin: login,
  CallParseToken: parseToken,
  CallGetToken: getToken,
};

export default KeycloakService;
