// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./DaiToken.sol";
import "./DappToken.sol";
import "./SafeMath.sol";

contract TokenFarm {
    

    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    // APY (0.1% daily)
    uint256 public defaultAPY = 100;

    // total staked
    uint256 public totalStaked;

    // array of all stakers
    address[] public stakers;

    // 
    uint256 public rewardPeriodEndTimestamp;
    uint256 public rewardPerSesond;

    // users staking balance
    mapping(address => uint256) public stakingBalance;

    // mapping list of users who ever staked
    mapping(address => bool) public hasStaked;

    // mapping list of users who are staking at the moment
    mapping(address => bool) public isStaking;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event AddRewards(uint256 amount, uint256 lengthInDays);
    event ClaimReward(address indexed user, uint256 amount);
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    

    constructor(DappToken _dappToken, DaiToken _daiToken) payable {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // Stakes Tokens (Deposit): transfer the DAI token from the investor to this contract
    function stakeTokens(uint256 _amount) public {
        // must more than 0
        require(_amount > 0, "amount cannot be 0");

        // sending DAi tokens
        daiToken.transferFrom(msg.sender, address(this), _amount);
        totalStaked += _amount;

        // updating staking balnce
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // updating staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // get staking balance for user
        uint256 balance = stakingBalance[msg.sender];

        // balance must more than 0
        require(balance > 0, "staking balance cannot be 0");

        // transfer staked tokens back to user
        daiToken.transfer(msg.sender, balance);
        totalStaked = totalStaked - balance;

        // reseting user staking balance
        stakingBalance[msg.sender] = 0;

        // updating staking status
        isStaking[msg.sender] = false;
    }

    // add Reward Tokens (Earning)
    function updateRewards() onlyOwner public{
        // require(msg.sender == owner, "caller must be the owner");
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];

            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}
