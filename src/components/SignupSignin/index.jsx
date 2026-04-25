import React, { useState } from "react";
import Input from "../input";
import "./style.css";
import Button from "../Button";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db ,provider} from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function SignupSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signUpWithEmail() {
    setLoading(true);
    // alert(name + " " + email + " " + password + " " + confirmPassword);
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("user", user);
            // ...
            toast.success("user created");
            setLoading(false);

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password and Confirm Password must be same!");
        setLoading(false);
      }
    } else {
      toast.error("All field Mandatory !");
      setLoading(false);
    }
  }
  function logInWithEmail() {
    console.log("email", email);
    console.log("password", password);
    setLoading(true);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("Log in Succesfully");
          console.log("user Logged in", user);
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fiels are Required!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    //toast.success("create doc running......");
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoUrl: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      //toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user", user);
          createDoc(user);
          setLoading(false);
          toast.success("User Authenticated succesfully!")
          navigate("/dashboard")

          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          // The email of the user's account used
          setLoading(false);
          // ...
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input
              type={"email"}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"example@gmail.com"}
            />
            <Input
              type={"password"}
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"******"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "LogIn Using Email and Password"}
              onClick={logInWithEmail}
            />
            <p className="p-login">OR</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              onClick={() => setLoginForm(!loginForm)}
              style={{ cursor: "pointer" }}
            >
              or Don't have account? Click here..
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
            <Input
              type={"text"}
              label={"full name"}
              state={name}
              setState={setName}
              placeholder={"Badru Doza"}
            />
            <Input
              type={"email"}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"example@gmail.com"}
            />
            <Input
              type={"password"}
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"******"}
            />
            <Input
              type={"password"}
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"******"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "SignUp Using Email and Password"}
              onClick={signUpWithEmail}
            />
            <p className="p-login">OR</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "SignUp Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              onClick={() => setLoginForm(!loginForm)}
              style={{ cursor: "pointer" }}
            >
              or Have account Already? Click here..
            </p>
          </form>
        </div>
      )}
    </>
  );
}
