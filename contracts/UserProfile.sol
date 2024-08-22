// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UserProfile {
    struct Profile {
        string name;
        string email;
        string phone;
        string about;
        string profileImage;
    }

    mapping(address => Profile) public profiles;

    function setProfile(string memory _name, string memory _email, string memory _phone, string memory _about, string memory _profileImage) public {
        profiles[msg.sender] = Profile(_name, _email, _phone, _about, _profileImage);
    }

    function getProfile(address _user) public view returns (string memory, string memory, string memory, string memory, string memory) {
        Profile memory profile = profiles[_user];
        return (profile.name, profile.email, profile.phone, profile.about, profile.profileImage);
    }
}