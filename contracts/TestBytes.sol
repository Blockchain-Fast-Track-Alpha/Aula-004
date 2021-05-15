// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract TestStoreString {
    string store;

    function storeValue(string memory value) public {
        store = value;
    }
}

contract TestStoreBytes {
    bytes32 store;

    function storeValue(bytes32 value) public {
        store = value;
    }
}