import { Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useContext} from "react"
import { UserContext } from "./user-context";

const Logout = () => {
  const [user, setUser] = useContext(UserContext);
  const navi = useNavigate();
  const handleLogout = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/users/logout",
      headers: {},
      withCredentials: true
    };

    axios
      .request(config)
      .then((response) => {
        console.log("logged out")
        sessionStorage.removeItem("user");
        setUser(null);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
    navi("/");
  };
  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleLogout()}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Logout;
