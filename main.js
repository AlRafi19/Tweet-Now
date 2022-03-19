//console.log('Tweet me')

//console.log(dateFns.format(new Date(), 'h:ma'))


const formElm = document.querySelector('form')

const tweetInputElm = document.querySelector('.tweet-input')

const listGroupElm = document.querySelector('.list-group')

const filterElm = document.querySelector('#filter')

 let tweets= [] // Data Store
 

function init(){

    // Submitting Tweet 

    formElm.addEventListener('submit',(evt)=>{
        evt.preventDefault()
       const {tweet} =  receivetweet()
       const isError = validateTweet(tweet)
       if (isError){
           alert('Submit a Valid Tweet')
            return
       }
       const id = tweets.length
       const tweetNow = {
            time: getTime(),
           id:id,
           tweet: tweet 
       }
       // add tweet to data Store
       tweets.push(tweetNow)
     
       // Show tweet to UI
       addTweetToUI(id,tweet, tweetNow)
      
       // Adding Tweet to Local Storage
       addTweetToLocalStorage(tweetNow)

       resetTweetInput()


    })

    // For preventing data loss after browser load

    document.addEventListener('DOMContentLoaded',(e)=>{
        e.preventDefault()

        if (localStorage.getItem('tweets')){
            tweets = JSON.parse(localStorage.getItem('tweets'))
            remainAllTweetAfterReloadInUI(tweets)
        }
    })

    // Deleting Tweet from UI, Data Store And Local Storage

    listGroupElm.addEventListener('click', (evt)=>{
        if(evt.target.classList.contains('delete-tweet')){
          
        const id = getTweetID(evt.target)

           removeTweetFromUI(id)
           removeTweetFromDataStore(id)
           removeTweetFromLocalStorage(id)
        }

    })

    // Searching 
    filterElm.addEventListener('keyup', (evt) =>{
        
        const filterTweet = evt.target.value
 
        const outcome = tweets.filter((tweet)=>{

        return tweet.tweet.includes(filterTweet)
            
        })
        showFilteredTweetToUI(outcome)
       
    })


}
init()

function removeTweetFromLocalStorage(id){
 
  const tweets = JSON.parse(localStorage.getItem('tweets'))
  const updatedTweets=updatedTweetsAfterRemove(tweets,id)
  localStorage.setItem('tweets', JSON.stringify(updatedTweets))

}
function updatedTweetsAfterRemove(tweets,id){
    return tweets.filter(tweet => tweet.id !== id)
}
function showFilteredTweetToUI(outcome){
    listGroupElm.innerHTML = ''
    outcome.forEach(item =>{
        const listElm = `<li class="list-group-item item-${item.id} collection-item">
    <strong>${item.tweet}</strong> <small>Twitted at: &#128578 ${item.time}</small>  
    <i class="fa fa-trash delete-tweet float-right"></i>
  </li>`
  
  listGroupElm.insertAdjacentHTML('afterbegin',listElm) 
    
})

}

function removeTweetFromDataStore(id){
   
    const tweetsAfterDeleting = updatedTweetsAfterRemove(tweets,id)
    tweets = tweetsAfterDeleting
}

function removeTweetFromUI(id){
    document.querySelector(`.item-${id}`).remove()

}

function getTweetID(elm){
    const liElm = elm.parentElement
    return (Number(liElm.classList[1].split('-')[1]))
}



function remainAllTweetAfterReloadInUI(tweets){
    
    tweets.forEach((item)=>{
        const listElm = `<li class="list-group-item item-${item.id} collection-item">
        <strong>${item.tweet}</strong> <small>Twitted at: ${item.time}</small>  
        <i class="fa fa-trash delete-tweet float-right"></i>
      </li>`
      listGroupElm.insertAdjacentHTML('afterbegin',listElm)

    })

}


function addTweetToLocalStorage(tweetNow){
    let tweets
    if (localStorage.getItem('tweets')){
        tweets= JSON.parse(localStorage.getItem('tweets'))
        tweets.push(tweetNow)
        localStorage.setItem('tweets', JSON.stringify(tweets))
        
    }else{
        tweets = []
        tweets.push(tweetNow)
        localStorage.setItem('tweets', JSON.stringify(tweets))
    }
}

function receivetweet(){
    const tweet = tweetInputElm.value 
    return {
        tweet
    }
    
}

function resetTweetInput(){
    tweetInputElm.value = ''

}

function validateTweet(tweet){
    let isError = false
    if(!tweet || tweet.length >250 || tweet.length<0){
        isError = true
    }
    return isError

}

function addTweetToUI(id, tweet, tweetNow){
    const listElm = `<li class="list-group-item item-${id} collection-item">
    <strong>${tweet}</strong> <small>Twitted at: &#128578 ${tweetNow.time}</small>  
    <i class="fa fa-trash delete-tweet float-right"></i>
  </li>`
  listGroupElm.insertAdjacentHTML('afterbegin',listElm)

}

function getTime(){
    
    const today =  dateFns.format(new Date(), "y-MM-dddd h:ma")
    return today
    
}
