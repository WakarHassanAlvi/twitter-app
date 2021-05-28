const Tweetsomething = artifacts.require('./Tweetsomething.sol')

contract('Tweetsomething', (accounts) => {
    before(async() => {
        this.tweet = await Tweetsomething.deployed()
    })
    
    describe("Should deploy the contract", () => {
        it('it should deploy smart contract successfully', async () => {
            const address = await this.tweet.address
            /*all these checks to make sure smart contract was deployed ok*/
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        });
    });

    describe("Should display list of tweets", () => {
        it('it should fetch and list all tweets', async() => {
            const tweetCount = await this.tweet.tweet_count()
            const tweet_index = await this.tweet.tweets(tweetCount)
            assert.equal(tweet_index.id.toNumber(), tweetCount.toNumber())
            //assert.equal(tweet_index.content, "It\'s the 1st default tweet upon deployment!")
            assert.equal(tweetCount.toNumber(), 1)
        });
    });

    describe("Should Create a Tweet", () => {
        it('it should emit an event and create tweet', async() => {
            const result = await this.tweet.tweet('0xcfcf85e8a8cb1f58c11889f3833a56d19d54c342', 'A new tweet')
            const tweetCount = await this.tweet.tweet_count()
            assert.equal(tweetCount, 2)
            //console.log(result)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), 2)
            assert.equal(event.tweetText, 'A new tweet')
            assert.equal(event.userAddress, '0xcfcf85e8a8cb1f58c11889f3833a56d19d54c342')
            assert.equal(event.deleted, false)
        });
    });

    describe("Should update a tweet", () => {
        it('it should emit an event and update tweet', async() => {
            const result = await this.tweet.updateTweet('Its the 1st default tweet upon deployment!',1)
            const tweet = await this.tweet.tweets(1)
            //console.log(result)
            const event = result.logs[0].args
            assert.equal(event.tweetText, 'Its the 1st default tweet upon deployment!')
            assert.equal(event.id.toNumber(), 1)
        });
    });

    describe("Should delete a tweet", () => {
        it('it should amit an event and delete tweet', async() => {
            const result = await this.tweet.deleteTweet(1)
            const tweet = await this.tweet.tweets(1)
            assert.equal(tweet.deleted, true)
            //console.log(result)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), 1)
            assert.equal(event.deleted, true)
        });
    });
})