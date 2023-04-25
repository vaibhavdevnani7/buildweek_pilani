import "./LandingPage.css";
import { GlobalContext } from "../contexts/GlobalContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";

async function connect() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', [137]) // connects MetaMask
const signer = provider.getSigner()
console.log('hello')
console.log(signer)
let SDK_ID = 24 // get your unique sdk id by contacting us on Telegram
let chainId = 137
const routerprotocol = new RouterProtocol(SDK_ID, chainId, provider)
await routerprotocol.initialize()
let args = {
  amount: (ethers.utils.parseUnits("10.0", 6)).toString(), // 10 USDC
  dest_chain_id: 250, // Fantom
  src_token_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
  dest_token_address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // USDC on Fantom
  user_address: "0x179E354ec7D8920d118347639ABE97Ccf849211a",
  receiver_address: "0x179E354ec7D8920d118347639ABE97Ccf849211a", // same as user_address if swapping to self.
  fee_token_address: "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4", // ROUTE on Polygon
  slippage_tolerance: 2.0
}
const quote = await routerprotocol.getQuote(args.amount, args.dest_chain_id, args.src_token_address, args.dest_token_address, args.user_address, args.receiver_address, args.fee_token_address, args.slippage_tolerance)
console.log(quote)

let tx;
try{
    tx = await routerprotocol.swap(quote,signer)
    console.log(`Transaction successfully completed. Tx hash: ${tx.hash}`)
}
catch(e){
    console.log(`Transaction failed with error ${e}`)
    return
}
}
const Home = () => {
 
  
  const globalContext = useContext(GlobalContext);
  return (
    <div className="centered">
      <h1>share the risks, split the rewards - the degenerate way</h1>
      <p>
        lorem ipsum dolor sit amet, consectetur adipiscing elit. sed euismod
      </p>
      <ButtonsBar />
      <Requests />
      <Transactions />
    </div>
  );
};
const ButtonsBar = () => {
  const [activeForm, setActiveForm] = useState(null);

  const handleClick = (formName) => {
    setActiveForm(formName);
  };

  const handleClosePopup = () => {
    setActiveForm(null);
  };
  return (
    <div className="accountbar-container">
      {links.map(({ name, link }) => {
        return (
          <li key={name} className="button">
            <div className=" hover:text-black">
              <button onClick={() => handleClick(link)}>{name}</button>
            </div>
          </li>
        );
      })}
      {activeForm === "/api/splitmoney" && (
        <Splitform onClose={handleClosePopup} />
      )}
      {activeForm === "/api/request" && (
        <Requestform onClose={handleClosePopup} />
      )}
      {activeForm === "/api/buynft" && <Nftform onClose={handleClosePopup} />}
    </div>
  );
};

const Splitform = ({ onClose }) => {
  const [formData, setFormData] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/splitmoney", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      console.log("Form submitted successfully");
      onClose();
    } else {
      console.error("Error submitting form");
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Receiver:</label>
          <input type="text" name="address" id="name" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            name="amount"
            id="amount"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="payees">Payees:</label>
          <input
            type="text"
            name="payees"
            id="payees"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="splits">Split Amounts:</label>
          <input
            type="text"
            name="splits"
            id="splits"
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" class="button">
            Submit
          </button>
        </div>
      </form>
      {/* <button onClick={onClose}>Close</button> */}
    </div>
  );
};

const Requestform = ({ onClose }) => {
  const [formData, setFormData] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/requestmoney", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      console.log("Form submitted successfully");
      onClose();
    } else {
      console.error("Error submitting form");
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Sender:</label>
          <input type="text" name="address" id="name" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            name="amount"
            id="amount"
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" class="button">
            Submit
          </button>
        </div>
      </form>
      {/* <button onClick={onClose}>Close</button> */}
    </div>
  );
};
const Nftform = ({ onClose }) => {
  const [formData, setFormData] = useState({});
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/buynft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      console.log("Form submitted successfully");
      onClose();
    } else {
      console.error("Error submitting form");
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">NFT_ID:</label>
          <input type="text" name="address" id="name" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="payees">Payees:</label>
          <input
            type="text"
            name="payees"
            id="payees"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="splits">Split Proportions:</label>
          <input
            type="text"
            name="splits"
            id="splits"
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" class="button">
            Submit
          </button>
        </div>
      </form>
      {/* <button onClick={onClose}>Close</button> */}
    </div>
  );
};

const links = [
  // { name: "Home", link: "/" },
  { name: "split money", link: "/api/splitmoney", form: "splitmoney" },
  { name: "request money", link: "/api/request", form: "splitmoney" },
  { name: "buy nfts", link: "/api/buynft", form: "splitmoney" },
];

const transactions = {
  transactions: [
    {
      details: {
        address: "hehe",
        amount: "5",
        payees: "5",
        splits: "5",
      },
      id: "Tue, 25 Apr 2023 15:56:31 GMT",
      transactiontype: "split",
      user_id: "vaibhavdevnani77",
    },
    {
      details: {
        address: "fvd",
        amount: "500",
        payees: "a,b,c",
        splits: "1,2,3",
      },
      id: "Tue, 25 Apr 2023 16:06:25 GMT",
      transactiontype: "split",
      user_id: "vaibhavdevnani77",
    },
  ],
};

const TransactionCard = ({ transaction }) => {
  const { details, id, transactiontype, user_id } = transaction;

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{id}</h5>
        <p className="card-text">Transaction Type: {transactiontype}</p>
        <p className="card-text">User ID: {user_id}</p>
        <p className="card-text">Address: {details.address}</p>
        <p className="card-text">Amount: {details.amount}</p>
        <p className="card-text">Payees: {details.payees}</p>
        <p className="card-text">Splits: {details.splits}</p>
      </div>
    </div>
  );
};

const Transactions = () => {
  return (
    <div>
      {transactions.transactions.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      ))}
    </div>
  );
};

const requests = {
  requests: [
    {
      address: "vaibhavdevnani77",
      amount: "55",
      details: {
        address: "vaibhavdevnani77",
        amount: "55",
      },
      id: "Tue, 25 Apr 2023 16:29:33 GMT",
      status: "Pending",
      target: "0x179E354ec7D8920d118347639ABE97Ccf849211a",
      user_id: "vaibhavdevnani77",
    },
  ],
};

const Card = ({ request }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{request.id}</h5>
        <p className="card-text">Address: {request.address}</p>
        <p className="card-text">Amount: {request.amount}</p>
        <p className="card-text">Status: {request.status}</p>
        <p className="card-text">Target: {request.target}</p>
        <p className="card-text">User ID: {request.user_id}</p>
        <div className="button">
          <button onClick={connect}>PAY</button>
        </div>
      </div>
    </div>
  );
};

const Requests = () => {
  return (
    <div>
      {requests.requests.map((request) => (
        <Card request={request} key={request.id} />
      ))}
    </div>
  );
};

export default Home;
