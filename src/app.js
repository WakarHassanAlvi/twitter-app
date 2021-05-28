App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
      console.log(App.account)
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const tweetList = await $.getJSON('Tweetsomething.json')
      App.contracts.Tweetsomething = TruffleContract(tweetList)
      App.contracts.Tweetsomething.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.tweetList = await App.contracts.Tweetsomething.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      //$('#account').html(App.account)
  
      // Render Tweets
      await App.renderTweets()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderTweets: async () => {
      // Load the total tweet count from the blockchain
      const tweetCount = await App.tweetList.tweet_count()
      
      // Render out each tweet with a new tweet list item
      for (var i = 1; i <= tweetCount; i++) {
        // Fetch the tweet data from the blockchain
        const tweet = await App.tweetList.tweets(i)
        const tweetId = tweet[0].toNumber()
        const tweetAddress = tweet[1]
        const tweetContent = tweet[2]
        const tweetDeleted = tweet[3]
        const tweetTimestamp = tweet[4]

        //display only the tweets that are not deleted
        if(tweetDeleted == false)
        {
            console.log(tweetDeleted)

            let tweetItem = ""
            // Put the tweet in the correct list
            list_item = "<li class='list-group-item tweet-item'><p><b>"+tweetAddress+"</b></p><p>"+tweetContent+"</p>"
            //To check if the tweet matches the user blockchain address, if it does - only then add Delete and Update options
            if(tweetAddress==App.account)
            {
              operations = '<div id="btns'+tweetId+'"><button onclick="App.deleteTweet('+tweetId+')" type="button" class="btn btn-danger">Delete</button>'
              operations += '<button type="button" onClick="update_click(this.id)" class="btn btn-success" id="upd'+tweetId+'">Update</button></div>'
              updateForm = '<form onSubmit="App.updateTweet(this.id); return false;" id="updateForm'+tweetId+'" style="display: none;">'
              +'<input id="updTweet'+tweetId+'" type="text" class="form-control" placeholder="Update Tweet" required>'
              +'<button class="btn btn-primary mt-2 add-button" type="submit">Update Tweet</button>'
              +'</form></li>'

              tweetItem = list_item + operations + updateForm;
            }
            else
            {
              tweetItem = list_item + '</li>';
            }
            
            
            //tweetItem = tweetItem.hide().fadeIn(1000);
            $(".tweetList").append(tweetItem);//append it in the front-end class
            
        }
        
      }
    },
    
    /*call this function from front-end to create the tweet*/
    createTweet: async () => {
      App.setLoading(true)
      const content = $('#newTweet').val()
      const userAddress = App.account
      await App.tweetList.tweet(userAddress, content)//call smart contract function
      window.location.reload()
    },

    /*call this function from front-end to update the tweet*/
    updateTweet: async (formId) => {
        App.setLoading(true)
        const tweetId = Number(formId.replace('updateForm', ''))
        const content = $('#updTweet'+tweetId).val()
        //alert(tweetId)
        await App.tweetList.updateTweet(content, tweetId)//call smart contract function
        window.location.reload()
      },
      
    /*call this function from front-end to delete the tweet*/
    deleteTweet: async (id) => {
      App.setLoading(true)
      const tweetId = id
      await App.tweetList.deleteTweet(tweetId)//call smart contract function
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })