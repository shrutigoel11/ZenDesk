// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserAuth {
    struct User {
        bytes32 passwordHash;
        bool exists;
    }

    mapping(address => User) public users;

    event UserRegistered(address userAddress);
    event UserLoggedIn(address userAddress);

    function register(bytes32 _passwordHash) public {
        require(!users[msg.sender].exists, "User already exists");
        users[msg.sender] = User(_passwordHash, true);
        emit UserRegistered(msg.sender);
    }

    function login(bytes32 _passwordHash) public view returns (bool) {
        require(users[msg.sender].exists, "User does not exist");
        return users[msg.sender].passwordHash == _passwordHash;
    }
}