
import { useState } from "react";
import axios from "axios";

const RegistrationPage = () => {
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEmailFormatCorrect, setIsEmailFormatCorrect] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const handleRegister = () => {
    setIsUsernameValid(true);
    setIsPasswordValid(true);
    setIsEmailValid(true);
    setIsEmailFormatCorrect(true);


    let payload = JSON.stringify({
      email: userEmail,
      username: userUsername,
      password: userPassword,
    });

    let requestOptions = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/users/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };


    axios.request(requestOptions).then((response) => { console.log(JSON.stringify(response.data));
    setIsUsernameValid(true);
    window.location.href = "/login";
      })
      .catch((error) => {
        if (error.response.data.error === "Email already taken") {
          setIsEmailValid(false);
        }
        if (error.response.data.error === "Password can't contain words from username or email"){
          setIsPasswordValid(false);
        }
        if (error.response.data.error === "Incorrect email format") {
          setIsEmailFormatCorrect(false);
        }
      });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "120vh",
      backgroundSize: "cover",
    }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: "320px",
          padding: "30px",
          borderRadius: "13px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}
        onSubmit={e => {
          e.preventDefault();  
          handleRegister();
        }}
      >
        <label style={{ margin: "12px 0", color: "#233" }}>
          E-mail:
          <input
            type="email"
            required
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            style={{ margin: "5px 0", padding: "10px" }}
          />
        </label>
        {!isEmailValid && <div style={{ color: "red" }}>Email already taken</div>}
        
        <label style={{ margin: "12px 0", color: "#333" }}>
          Username:
          <input
            type="text"
            required
            value={userUsername}
            onChange={e => setUserUsername(e.target.value)}
            style={{ margin: "5px 0", padding: "10px" }}
          />
        </label>

        <label style={{ margin: "12px 0", color: "#333" }}>
          Password:
          <input
            type="password"
            required
            value={userPassword}
            onChange={e => setUserPassword(e.target.value)}
            style={{ margin: "5px 0", padding: "10px" }}
          />
        </label>
        {!isPasswordValid && <div style={{ color: "red" }}>Password should not contain username or email</div>}

        <button type="submit"
          style={{
            margin: "5px 0",
            border: "none",
            color: "black",
            cursor: "pointer",
            padding: "12px",
            borderRadius: "2px",
          }} >
          Create New Account
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;