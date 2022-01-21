import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractAbi, contractAddres } from "../utils/constant";

export const Transaction = React.createContext();
const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddres,
    contractAbi,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [CurrentAccount, setCurrentAccount] = useState("");
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [trasactions, setTrasactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTansactions();

      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }));

      console.log(structuredTransactions);
      setTrasactions(structuredTransactions)

    } catch (error) {
      console.log(error);
    }
  };
  const checkIfXalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No account found.");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionsCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const { addressTo, amount, keyword, message } = formData;
      const parsedAmount = ethers.utils.parseEther(amount); // 0.0001 change the amount to GWEI
      const transactionContract = getEthereumContract();
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: CurrentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 GWEI
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`success - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.getTransactionsCount();
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };
  useEffect(() => {
    checkIfXalletIsConnected();
    checkIfTransactionExist();
  }, []);
  return (
    <Transaction.Provider
      value={{
        connectWallet,
        CurrentAccount,
        formData,
        sendTransaction,
        handleChange,
        trasactions,
        isLoading
      }}
    >
      {children}
    </Transaction.Provider>
  );
};
