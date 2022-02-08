// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./DaiToken.sol";
import "./DappToken.sol";
import "./SafeMath.sol";

contract TokenFarm {
    using SafeMath for uint256;

    string public name = "Dapp Token Farm";
    address public owner;

    struct UserInfo {
        uint256 deposited;
        uint256 rewardsAlreadyConsidered;
    }

    // mapping list of all stakers
    mapping(address => UserInfo) users;

    // reward token
    DappToken public dappToken;

    // deposit token
    DaiToken public daiToken;

    // total staked
    uint256 public totalStaked;

    //
    uint256 public rewardPeriodEndTimestamp;
    uint256 public rewardPerSecond;

    // last time update reward
    uint256 public lastRewardTimestamp;
    uint256 public accumulatedRewardPerShare;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event AddRewards(uint256 amount, uint256 lengthInDays);
    event ClaimReward(address indexed user, uint256 amount);
    event Stake(address indexed user, uint256 amount);
    event UnStake(address indexed user, uint256 amount);

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function addRewards(uint256 _rewardsAmount, uint256 _lengthInDays)
        external
        onlyOwner
    {
        require(block.timestamp > rewardPeriodEndTimestamp, "Staker: can't add rewards before period finished");
        updateRewards();
        rewardPeriodEndTimestamp = block.timestamp.add(
            _lengthInDays.mul(24 * 60 * 60)
        );
        rewardPerSecond = _rewardsAmount.mul(1e7).div(_lengthInDays).div(24 * 60 * 60);
        require(
            dappToken.transferFrom(msg.sender, address(this), _rewardsAmount),
            "Staker: transfer failed"
        );
        emit AddRewards(_rewardsAmount, _lengthInDays);
    }

    function updateRewards() public {
        // no staking period active
        if (block.timestamp <= lastRewardTimestamp) {
            return;
        }

        // nobody staed - already updated rewards after staking ended.
        if (
            (totalStaked == 0) || lastRewardTimestamp > rewardPeriodEndTimestamp
        ) {
            lastRewardTimestamp = block.timestamp;
            return;
        }

        uint256 endingTime;
        if (block.timestamp > rewardPeriodEndTimestamp) {
            endingTime = rewardPeriodEndTimestamp;
        } else {
            endingTime = block.timestamp;
        }

        uint256 secondsSinceLastRewardUpdate = endingTime.sub(
            lastRewardTimestamp
        );
        uint256 totalReward = secondsSinceLastRewardUpdate.mul(rewardPerSecond);

        accumulatedRewardPerShare = accumulatedRewardPerShare.add(
            totalReward.mul(1e12).div(totalStaked)
        );
        lastRewardTimestamp = block.timestamp;

        if (block.timestamp > rewardPeriodEndTimestamp) {
            rewardPerSecond = 0;
        }
    }

    // Stakes Tokens (Deposit): transfer the DAI token from the investor to this contract
    function stakeTokens(uint256 _amount) public {
        // // must more than 0
        // require(_amount > 0, "amount cannot be 0");
        // // sending DAi tokens
        // daiToken.transferFrom(msg.sender, address(this), _amount);
        // totalStaked += _amount;
        // // updating staking balnce
        // stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        // if (!hasStaked[msg.sender]) {
        //     // stakers.push(msg.sender);
        // }
        // // updating staking status
        // hasStaked[msg.sender] = true;
        // isStaking[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // // get staking balance for user
        // uint256 balance = stakingBalance[msg.sender];
        // // balance must more than 0
        // require(balance > 0, "staking balance cannot be 0");
        // // transfer staked tokens back to user
        // daiToken.transfer(msg.sender, balance);
        // totalStaked = totalStaked - balance;
        // // reseting user staking balance
        // stakingBalance[msg.sender] = 0;
        // // updating staking status
        // isStaking[msg.sender] = false;
    }

    // add Reward Tokens (Earning)
    // function updateRewards() public onlyOwner {
    //     // require(msg.sender == owner, "caller must be the owner");
    //     for (uint256 i = 0; i < stakers.length; i++) {
    //         address recipient = stakers[i];
    //         uint256 balance = stakingBalance[recipient];

    //         if (balance > 0) {
    //             dappToken.transfer(recipient, balance);
    //         }
    //     }
    // }

    function getUserInfo() external view returns(uint256 _rewardPerSecond, uint256 _secondsLeft, uint256 _deposited) {
        if(block.timestamp <= rewardPeriodEndTimestamp) {
            _secondsLeft = rewardPeriodEndTimestamp.sub(block.timestamp);
            _rewardPerSecond = rewardPerSecond.div(1e7);
        }
        _deposited = users[msg.sender].deposited;
    }
}
