import React from "react";
import Header from "../Header";
import SignupSignin from "../SignupSignin";

function Signup() {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SignupSignin />
      </div>
    </div>
  );
}

export default Signup;