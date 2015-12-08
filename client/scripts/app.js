// YOUR CODE HERE:
var app = {
  allMessages: [],
  displayAllMessages: function() {
    for (var i = 0; i < this.allMessages.length; i++) {
      if (this.allMessages[i].displayTest === false) {
        var element = $(document.createElement('div'));
        element.text(_.escape(this.allMessages[i].username) + ': ' + _.escape(this.allMessages[i].text));
        $('.all-messages').append(element);
        this.allMessages[i].displayTest = true;
      }
    }
  },
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'order=-createdAt',
      success: function(data) {
        console.log('chatterbox: Message sent. Data: ', data);
        // loop through data and compare data on server to already existing array above
        // if allMessage.length = 0
        if (app.allMessages.length === 0) {
          app.allMessages = data.results;
        } else {
          for (i = 0; i < data.results.length; i++) {
            // also loop through allMesssage and check data.results[i].objectId === allMessages[i].objectId
            for (j = 0; j < app.allMessages.length; j++) {
              // app.allMessage [{objectId: asdjaklsdjlkasjd1239}, {}, {}] <- 'asdjaklsdjlkasjd1239'
              if (app.allMessages[j].objectId === data.results[i].objectId) {
                //adding property to results objects to determine if the message was displayed. will default to false
                data.results[i].displayTest = false;
                //if key is unique, push new message to allMessage array
                app.allMessages.unshift(data.results[i]);
              }
            }
          }
        }
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    })
  },
  send: function(obj) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(obj),
      success: function() {
        console.log("Success. The message was sent.")
      },
      error: function() {
        console.error("Message failed to send")
      }
    })
  },
  init: function() {
    setInterval(app.fetch.bind(app), 3000);
    setInterval(app.displayAllMessages.bind(app), 3000);
  },
  server: 'https://api.parse.com/1/classes/chatterbox'
};

$(document).ready(function() {
  //add click handler, on click, run send, passing in input message
  $('.send-button').on('click', function() {
    var messageObj = {
      username: $('.username-input').val(),
      text: $('.message-input').val()
    }
    app.send(messageObj);
  });
});
// $('message-input').val
// $('username-input').val



app.init();


/*app.allMessages.push({
  displayTest: false,
  text: "<script>alert('!!');</script>",
  username: "test"
});

createdAt: "2015-09-01T01:00:42.028Z"
displayTest: true
objectId: "hwhupXO0iX"
roomname: "4chan"
text: "trololo"
updatedAt: "2015-09-01T01:00:42.028Z"
username: "shawndrost"*/