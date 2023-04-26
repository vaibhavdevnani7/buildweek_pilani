import "./LandingPage.css";
import { GlobalContext } from "../contexts/GlobalContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";
import { Dropdown } from 'react-bootstrap';


async function connect(_chainId, _tokenAddr, _amount, _receiverAddr) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', []) // connects MetaMask
const signer = provider.getSigner()
console.log('hello')
console.log(signer.getAddress())
var useraddr = await signer.getAddress()
console.log(useraddr)
let SDK_ID = 24 // get your unique sdk id by contacting us on Telegram
let chainId = 137
const routerprotocol = new RouterProtocol(SDK_ID, chainId, provider)
await routerprotocol.initialize()
let args = {
  amount: (ethers.utils.parseUnits(_amount, 0)).toString(), // 
  dest_chain_id: _chainId, // Fantom
  src_token_address: "0x0000000000000000000000000000000000001010", // matic on Polygon
  dest_token_address: _tokenAddr, // USDC on Fantom
  user_address: useraddr,
  receiver_address: _receiverAddr, // same as user_address if swapping to self.
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
        split money whille doing transactions, request money from friends, buy nfts together, and more!
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

const Transactions =  () => {
  const [transactions, setTransactions] = useState(null);
  
    const fetchData = async () => {
      const response = await fetch('/api/transactions');
      const jsonData = await response.json();
      setTransactions(jsonData);
    };
    fetchData();
  
  return (
    <div>
      {transactions && (transactions.transactions.map((transaction) => (
        <TransactionCard transaction={transaction} key={transaction.id} />
      )))}
    </div>
  );
};


function ChainDropdown(props) {
  const handleDropdownSelect = (eventKey) => {
    props.onSelect(eventKey);
  };

  return (
    <Dropdown onSelect={handleDropdownSelect}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.selectedChainName}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.keys(props.chainMapping).map((key) => (
          <Dropdown.Item key={key} eventKey={key}>
            {props.chainMapping[key].chain}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
function TokenDropdown(props) {
  const handleDropdownSelect = (eventKey) => {
    props.onSelect(eventKey);
  };

  return (
    <Dropdown onSelect={handleDropdownSelect}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.selectedTokenName}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.keys(props.chainMapping).map((key) => (
          <Dropdown.Item key={key} eventKey={key}>
            {props.chainMapping[key].NATIVE.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
const Card = ({ request }) => {
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [selectedChainName, setSelectedChainName] = useState("Select a chain");
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [selectedTokenName, setSelectedTokenName] = useState("Select a Token");
  const [selectedTokenAddr, setSelectedTokenAddr] = useState(null);
  const handleChainSelect = (chainId) => {
    setSelectedChainId(chainId);
    setSelectedChainName(chainMapping[chainId].chain);
  };
  const handleTokenSelect = (chainId) => {
    setSelectedTokenId(chainId);
    setSelectedTokenName(chainMapping[chainId].NATIVE.name);
    setSelectedTokenAddr(chainMapping[chainId].NATIVE.address);
  };
  
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{request.id}</h5>
        <p className="card-text">Address: {request.address}</p>
        <p className="card-text">Amount: {request.amount}</p>
        <p className="card-text">Status: {request.status}</p>
        <p className="card-text">Target: {request.target}</p>
        <p className="card-text">User ID: {request.user_id}</p>
        <div className="dropdowns">
        <ChainDropdown
        chainMapping={chainMapping}
        selectedChainName={selectedChainName}
        onSelect={handleChainSelect}
      />
      <TokenDropdown
        chainMapping={chainMapping}
        selectedTokenName={selectedTokenName}
        onSelect={handleTokenSelect}
      />
      </div>
        <div className="button">
        
          <button onClick={e => connect(selectedChainId, selectedTokenAddr, request.amount, request.target)}>PAY</button>
        </div>
      </div>
    </div>
  );
};

const Requests = () => {
  const [requestsfetch, setRequests] = useState(null);
  
    const fetchData = async () => {
      const response = await fetch('/api/requests');
      console.log(response);
      const jsonData = await response.json();
      setRequests(jsonData);
    };
    fetchData();
  
  return (
    <div>
      {requestsfetch && (requestsfetch.requests.map((request) => (
        <Card request={request} key={request.id} />
      )))}
    </div>
  );
};

const chainMapping = {
  "137": {
      "chain": "Polygon",
      "rpc": "https://polygon-rpc.com",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0xfEd3c880FF02B195abee916328c5a3953976befD",
      "NATIVE": {
          "address": "0x0000000000000000000000000000000000001010",
          "wrapped_address": "0x4c28f48448720e9000907BC2611F73022fdcE1fA",
          "name": "MATIC"
      }
  },
  "1": {
      "chain": "Ethereum",
      "rpc": "https://speedy-nodes-nyc.moralis.io/36a3a9840a5f2cc2ea2bbb42/eth/mainnet",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x5e9A385a15cDE1b149Cb215d9cF3151096A37D67",
      "NATIVE": {
          "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          "wrapped_address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          "name": "ETH"
      }
  },
  "250": {
      "chain": "Fantom",
      "rpc": "https://rpc.ftm.tools/",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x621F0549102262148f6a7D289D8330adf7CbC09F",
      "NATIVE": {
          "address": "0x0100000000000000000000000000000000000001",
          "wrapped_address": "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
          "name": "FTM"
      }
  },
  "42161": {
      "chain": "Arbitrum",
      "rpc": "https://arb1.arbitrum.io/rpc",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x88b1E0ecaC05b876560eF072d51692F53932b16f",
      "NATIVE": {
          "address": "0x0000000000000000000000000000000000001010",
          "wrapped_address": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
          "name": "ARB"
      }
  },
  "56": {
      "chain": "BSC",
      "rpc": "https://bsc-dataseed.binance.org/",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x45d880647Ec9BEF6Bff58ee6bB985C67d7234b0C",
      "NATIVE": {
          "address": "0x0100000000000000000000000000000000000001",
          "wrapped_address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          "name": "BNB"
      }
  },
  "43114": {
      "chain": "Avalanche",
      "rpc": "https://api.avax.network/ext/bc/C/rpc",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x5febcA23e97c8ead354318e5A3Ed34ec3704459a",
      "NATIVE": {
          "address": "0x0100000000000000000000000000000000000001",
          "wrapped_address": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
          "name": "AVAX"
      }
  },
  "10": {
      "chain": "Optimism",
      "rpc": "https://mainnet.optimism.io",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x88b1E0ecaC05b876560eF072d51692F53932b16f",
      "NATIVE": {
          "address": "0x0000000000000000000000000000000000001010",
          "wrapped_address": "0x4200000000000000000000000000000000000006",
          "name": "OPT"
      }
  },
  "25": {
      "chain": "Cronos",
      "rpc": "https://evm.cronos.org",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0xf44Ff799eA2bBFeC96f9A50498209AAc3C2b3b8b",
      "NATIVE": {
          "address": "0x0000000000000000000000000000000000000001",
          "wrapped_address": "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
          "name": "CRO"
      }
  },
  "1666600000": {
      "chain": "Harmony",
      "rpc": "https://api.harmony.one",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x8413041a7702603d9d991F2C4ADd29e4e8A241F8",
      "NATIVE": {
          "address": "0x0000000000000000000000000000000000001010",
          "wrapped_address": "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a",
          "name": "ONE"
      }
  },
  "1313161554": {
      "chain": "Aurora",
      "rpc": "https://mainnet.aurora.dev",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0x13538f1450Ca2E1882Df650F87Eb996fF4Ffec34",
      "NATIVE": {
          "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          "wrapped_address": "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
          "name": "AURORA"
      }
  },
  "2222": {
      "chain": "Kava",
      "rpc": "https://evm.kava.io",
      "reserveHandler_address": "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
      "oneSplit_address": "0xB065a867a1baa919F0A9a3F5C1543D19768CeFBD",
      "NATIVE": {
          "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          "wrapped_address": "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
          "name": "KAVA"
      }
  }
}


export default Home;
