import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";

// hook to check if user is or is not authenticated in the server
const useFetchRoom = (id) => {
  const [isLoading, setLoading] = useState(true);
  const [fetchedRoom, setRoom] = useState();
  const [error, setError] = useState({ status: false, type: "" });

  const history = useHistory();

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/rooms/${id}`);

        // redirects to error page
        if (response.data.error) {
          setError({
            status: true,
            type: response.data.type.toString(),
          });
        }

        // if room._id exist, set room.
        if (response.data._id) {
          setRoom(response.data);
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

    fetchRoom(); // call above function here
  }, [history, id]);

  return { fetchedRoom, isLoading, error};
};

export default useFetchRoom;
