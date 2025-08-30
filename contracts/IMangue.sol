// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMangue {
    //donations
    function donate(address user,uint256 amount,string message)external payable;

    function setDonatorAccount() external;
    function getDonatorsAccounts() returns (mapping address) external;


    //definitions
    function setRecoveryArea(uint8 area) external;
    function getRecoveredArea() external;
    //balance and control
    function depositExternal(string calldata message) external payable;

    function checkBalance(address user) external view returns (uint256);

    function withdraw(uint256 amount) external;

}
