import { useState, useEffect } from "react";
import axios from "axios";

// hook to check if user is or is not authenticated in the server
const useAuthentication = () => {
  const [isAuth, setAuth] = useState(false);
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getAuth = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/authentication");

        if (res.data.error === false) {
          setAuth(true);
          setData(res.data.userData);
        } else {
          throw new Error();
        }
      } catch (err) {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };
    getAuth();
  }, []);

  return { isAuth, data, isLoading };
};

export default useAuthentication;
