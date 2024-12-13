
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../user-context";
import { useNavigate } from "react-router-dom";

const SignInScreen = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [keyPressed, setKeyDown] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [correctCredentials, setCorrectCredentials] = useState(true);


  const EmailInput = (event) => {
    setLoginEmail(event.target.value);
  };



  const handlePasswordInput = (event) => {
    setLoginPassword(event.target.value);
  };


  const checkLogin = () => {
    setCorrectCredentials(true);
    let requestBody = JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    });

    let requestConfig = {
      method: "post",
      url: "http://localhost:8000/api/users/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
      maxBodyLength: Infinity,
      withCredentials: true,
    };

    axios.request(requestConfig).then((response) => {
        setCurrentUser(response.data);
        navigate("/mainstackoverflow");
      }).catch((error) => { setCorrectCredentials(false); });
  };

  const KeyPressHandle = (event) => {
    if (event.key === "Enter") {
      keyPressed(true);
      checkLogin();

    }
  };

  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
      <form style={{ display: "flex", flexDirection: "column", padding: "30px", borderRadius: "12px", width: "300px" }}
        onSubmit={e => {
          e.preventDefault();
          setCorrectCredentials(true);
          checkLogin(); }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <label> E-mail: <input
            type="email" required onChange={EmailInput} value={loginEmail}
            style={{ margin: "12px 0", padding: "12px" }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"  required value={loginPassword}  onChange={handlePasswordInput}
            keyPressed={KeyPressHandle}
            style={{ margin: "14px 0", padding: "14px" }}
          />
        </label>
        {!correctCredentials && <div style={{ color: "red" }}>Incorrect credentials</div>}
        <button
          type="submit"
          style={{ padding: "14px", color: "black", borderRadius: "15px",  cursor: "pointer", marginTop: "13px"}}> Login </button>
      </form>
    </div>
  );
};

export default SignInScreen;