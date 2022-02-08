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
    event Deposit(address indexed user, uint256 amount);
    event Withraw(address indexed user, uint256 amount);

    constructor(DappToken _dappToken, DaiToken _daiToken) {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function addRewards(uint256 _rewardsAmount, uint256 _lengthInDays)
        external
        onlyOwner
    {
        require(
            block.timestamp > rewardPeriodEndTimestamp,
            "TokenFarm: can't add rewards before period finished"
        );
        updateRewards();
        rewardPeriodEndTimestamp = block.timestamp.add(
            _lengthInDays.mul(24 * 60 * 60)
        );
        rewardPerSecond = _rewardsAmount.mul(1e7).div(_lengthInDays).div(
            24 * 60 * 60
        );
        require(
            dappToken.transferFrom(msg.sender, address(this), _rewardsAmount),
            "TokenFarm: transfer failed"
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

    //deposit: transfer the DAI token from the investor to this contract
    function deposit(uint256 _amount) external {
        UserInfo storage user = users[msg.sender];
        updateRewards();

        // reward for previous deposits
        if (user.deposited > 0) {
            uint256 pending = user
                .deposited
                .mul(accumulatedRewardPerShare)
                .div(1e12)
                .div(1e7)
                .sub(user.rewardsAlreadyConsidered);

            require(
                dappToken.transfer(msg.sender, pending),
                "TokenFarm: transfer failt"
            );
            emit ClaimReward(msg.sender, pending);
        }

        // deposit
        user.deposited = user.deposited.add(_amount);
        totalStaked = totalStaked.add(_amount);
        user.rewardsAlreadyConsidered = user
            .deposited
            .mul(accumulatedRewardPerShare)
            .div(1e12)
            .div(1e7);
        require(
            daiToken.transferFrom(msg.sender, address(this), _amount),
            "TokenFarm: transferFrom failed"
        );
        emit Deposit(msg.sender, _amount);
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

    function pendingRewards(address _user) public view returns(uint256) {
        UserInfo storage user = users[_user];
        uint256 accumulated = accumulatedRewardPerShare;
        if (block.timestamp > lastRewardTimestamp && lastRewardTimestamp <= rewardPeriodEndTimestamp && totalStaked != 0) {
            uint256 endingTime;
            if (block.timestamp > rewardPeriodEndTimestamp) {
                endingTime = rewardPeriodEndTimestamp;
            } else {
                endingTime = block.timestamp;
            }
            uint256 secondsSinceLastRewardUpdate = endingTime.sub(lastRewardTimestamp);
            uint256 totalNewReward = secondsSinceLastRewardUpdate.mul(rewardPerSecond);
            accumulated = accumulated.add(totalNewReward.mul(1e12).div(totalStaked));
        }
        return user.deposited.mul(accumulated).div(1e12).div(1e7).sub(user.rewardsAlreadyConsidered);  
    }

    function getUserInfo()
        external
        view
        returns (
            uint256 _rewardPerSecond,
            uint256 _secondsLeft,
            uint256 _deposited,
            uint256 _pendingRewards
        )
    {
        if (block.timestamp <= rewardPeriodEndTimestamp) {
            _secondsLeft = rewardPeriodEndTimestamp.sub(block.timestamp);
            _rewardPerSecond = rewardPerSecond.div(1e7);
        }
        _deposited = users[msg.sender].deposited;
        _pendingRewards = pendingRewards(msg.sender);
    }
}
