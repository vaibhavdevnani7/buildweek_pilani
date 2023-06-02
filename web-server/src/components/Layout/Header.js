import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext"
const Header = () => {
  const globalContext = useContext(GlobalContext);
  return (
    <header>
      <div className="logo-wrapper">
        {/* <img className="logo" src={"" + "/img/logo.png"} /> */}
        DegenSplit
      </div>
      {globalContext.isLogged ? <AccountBar/> : <SignInButton />}
    </header>
  )
}

const AccountBar = () => {
  return (
    <div className="accountbar-container">
      <div className="ethereum">
        <img src={"" + "/img/icons/polygon.svg"} />
      </div>
      <div className="profile">
        <img src={"" + "/img/AvatarImg.webp"} />
      </div>
    </div>
  )
}

const SignInButton = () => {
  const location = useLocation();
  return (
    <div className="sign-in">
      <Link to="login" state={{ background: location }}>
        <button className="btn-s btn-yellow">
          Sign In
        </button>
      </Link>
    </div >
  )
}
export default Header;