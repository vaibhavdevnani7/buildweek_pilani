import styles from "../styles/Oops.css"

const Oops = () => {
  return (
    <div className="error-container">
      <img className="logo" src={"" + "/img/logo.png"} />
      <div className="error-block card">
        <div className="error-content">
          <img src={"" + "/img/crying.gif"} />
          <h1>Oops!</h1>
          <h2 className="error">Something Went Wrong</h2>
          <span>Brace yourself till we get the error fixed. Please try again later.</span>
        </div>
      </div>
    </div>
  )
}

export default Oops;