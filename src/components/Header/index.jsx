import React from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userImg from "../../assets/defaultImages.jpg"
export default function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFunc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("User Logout succesfully");
          navigate("/");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="navbar">
      <p className="logo">Financely.</p>
      {user && (
        <div style={{display:'flex',alignItems:"center",gap:"0.75rem"}}>
          <img src={user.photoURL?user.photoURL:userImg} style={{borderRadius:"50%",height:"1.5rem",width:"1.5rem"}} />
          <p className="logo link" onClick={logoutFunc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}
