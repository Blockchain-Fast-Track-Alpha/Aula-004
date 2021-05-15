// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 2**254);
    }
}

contract MyERC20Holder {
    address public myERC20;

    string _erc20Name;
    string _erc20Symbol;

    constructor(string memory name, string memory symbol) {
        _erc20Name = name;
        _erc20Symbol = symbol;
    }

    function deployMyERC20() public {
        require(myERC20 == address(0), "MyERC20Holder: ERC20 already deployed");
        DummyERC20 newContract = new DummyERC20(_erc20Name, _erc20Symbol);
        myERC20 = address(newContract);
    }

    function balanceOfMyER20() public view returns (uint256){
        return ERC20(myERC20).balanceOf(address(this));
    }
}