//SPDX-License-Identifier: UNLICENSED
// solidity version 
pragma solidity ^0.8.0;


contract Transactions {
    uint256 transactionsCounter;


    event Transfer(address from , address receiver, uint amount,string message , uint256 timestamp,string keyword);

    struct TransferStruct {
        address sender;
        address receiver; 
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;  
    }
 TransferStruct[] transactions;

 function addToBlockchain (address payable receiver, uint amount, string memory message , string memory keyword ) public{
    transactionsCounter+= 1;
    transactions.push(TransferStruct(msg.sender,receiver, amount ,message,block.timestamp,keyword));
 }   
 function getAllTansactions () public view returns (TransferStruct[] memory){
     
 }  
  function getTransactionsCount () public view returns (uint256){
     
 }   

}