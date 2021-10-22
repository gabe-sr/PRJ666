import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";

// hook to check if user is or is not authenticated in the server
const useFetchUser = (id) => {
  const [isLoading, setLoading] = useState(true);
  const [fetchedUser, setUser] = useState();
  const [error, setError] = useState({ status: false, type: "" });

  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/users/${id}`);

        // redirects to error page
        if (response.data.error) {
          setError({
            status: true,
            type: response.data.type.toString(),
          });
        }

        // if user._id exist, set user.
        if (response.data._id) {
          setUser(response.data);
        }

        // errors including response.status != 200 to 299
      } catch (error) {
        setError({
          status: true,
          type: error.response.status.toString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // call above function here
  }, [history, id]);

  return { fetchedUser, isLoading, error };
};

export default useFetchUser;
