// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Tweetsomething {
  
  uint public tweet_count=0;/*state variable which will have the tweet count*/

  struct Tweetanything{/*tweet struct for storing a tweet*/
    uint id;
    string userAddress;/*the user address who created the tweet to check for updation and deletion*/
    string tweetText;
    bool deleted;
    uint timestamp;
  }

  mapping(uint => Tweetanything) public tweets;/*mapping works as a database for our tweets*/

  event TweetCreated(/*tweet creation event*/
    uint id,
    string userAddress,
    string tweetText,
    bool deleted,
    uint timestamp
  );

  event TweetUpdated(/*tweet update event*/
    uint id,
    string tweetText
  );

  event TweetDeleted(/*tweet delete event*/
    uint id,
    bool deleted
  );

  constructor() public {/*tweet constructor, this will run everytime the smart contract is deployed and a default tweet will be created*/
   tweet("0xcfcf85e8a8cb1f58c11889f3833a56d19d54c342", "Its the 1st default tweet upon deployment!"); 
  }

  function tweet(string memory _userAddress, string memory _tweetText) public {/*create new tweet and put it in mapping(Database)*/
    tweet_count++;
    tweets[tweet_count] = Tweetanything(tweet_count, _userAddress, _tweetText, false, block.timestamp);
    emit TweetCreated(tweet_count, _userAddress, _tweetText, false, block.timestamp);
  }

  function updateTweet(string memory _tweetText, uint _id) public {/*update the tweet*/
    Tweetanything memory _tweet = tweets[_id];
    _tweet.tweetText = _tweetText;
    tweets[_id] = _tweet;
    emit TweetUpdated(_id, _tweet.tweetText);
  }

  function deleteTweet(uint _id) public {/*delete a tweet*/
    Tweetanything memory _tweet = tweets[_id];
    _tweet.deleted = true;
    tweets[_id] = _tweet;
    emit TweetDeleted(_id, _tweet.deleted);
  }
}
