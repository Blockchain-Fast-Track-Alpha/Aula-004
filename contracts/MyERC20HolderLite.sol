// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IERC20Factory {
    function createERC20(string memory name, string memory symbol)
        external
        returns (address);
}

interface IERC20 {
    function balanceOf(address acc)
        external
        view
        returns (uint256);

    function totalSupply()
        external
        view
        returns (uint256);
}

contract MyERC20HolderLite {
    address public myERC20;

    address _erc20FactoryAddress;
    string _erc20Name;
    string _erc20Symbol;

    constructor(
        address factory,
        string memory name,
        string memory symbol
    ) {
        _erc20FactoryAddress = factory;
        _erc20Name = name;
        _erc20Symbol = symbol;
    }

    function deployMyERC20() public {
        require(myERC20 == address(0), "MyERC20Holder: ERC20 already deployed");
        myERC20 = IERC20Factory(_erc20FactoryAddress).createERC20(_erc20Name, _erc20Symbol);
    }

    function balanceOfMyER20() public view returns (uint256) {
        return IERC20(myERC20).balanceOf(address(this));
    }
}
