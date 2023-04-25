// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;

contract SmartInvoice {
  uint256 public invoiceAmount;
  address payable public receiver;
  address[] public payees;
  uint256[] public payeeamounts;
  uint256[] public statuspayees;
  uint256 public status;

  constructor(uint _invoiceAmount, address payable _receiver, address[] memory _payees, uint256[] memory _payeeamounts, uint[] memory _statuspayees) public {
    invoiceAmount = _invoiceAmount;
    receiver = _receiver;
    payees = _payees;
    payeeamounts = _payeeamounts;
    statuspayees = _statuspayees;
  }

  fallback () payable external {
    address sender = msg.sender;
    uint amount = msg.value;
    if (payeeamounts[getindex(payees, sender)] == amount){
        statuspayees[getindex(payees, sender)] = 1;
        checkandsend();
    }
  }

  function getContractBalance() public view returns(uint) {
    return address(this).balance;
  }

  function getindex(address[] memory _payees, address payee) public returns(uint){
      for (uint i = 0; i < _payees.length; i++) {
        if (_payees[i] == payee) {
            return uint(i);
        }
    }
  }

function checkandsend() public {
    status =1;
 for (uint i = 0; i < payees.length; i++) {
        if (statuspayees[i] != 1) {
            status=0;
        }
  }
  if (status==1){
receiver.transfer(invoiceAmount);
  }
}
}