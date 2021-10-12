import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useLocation, useHistory } from "react-router";

const context = createContext();

const SUPPORTED_REDIRECT_PATHNAME = ["/accounts"];

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const history = useHistory();

  const [twitterAuthData, setTwitterAuthData] = useState();

  useEffect(() => {
    if (SUPPORTED_REDIRECT_PATHNAME.indexOf(location.pathname) === -1) {
      return;
    }

    switch (location.hash) {
      case "#twitter": {
        const query = new URLSearchParams(location.search);
        setTwitterAuthData({
          requestTokenData: {
            oauthToken: query.get("oauth_token"),
            oauthVerifier: query.get("oauth_verifier"),
          },
        });
        history.push(location.path);
        break;
      }
      default:
        return;
    }
  }, [location, history]);

  const clearTwitterAuthData = useCallback(() => {
    setTwitterAuthData(undefined);
  }, [setTwitterAuthData]);

  const setTwitterAccessToken = useCallback(
    (accessToken) => {
      setTwitterAuthData((val) => ({
        ...val,
        accessToken,
      }));
    },
    [setTwitterAuthData]
  );
  const value = useMemo(() => {
    return {
      twitter: twitterAuthData,
      clearTwitterAuthData,
      setTwitterAccessToken,
    };
  }, [twitterAuthData, setTwitterAccessToken, clearTwitterAuthData]);
  return <context.Provider value={value}>{children}</context.Provider>;
};

export const useAuth = () => {
  return useContext(context);
};
