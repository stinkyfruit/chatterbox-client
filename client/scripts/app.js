// YOUR CODE HERE:
var app = {
  messageStorage: {},
  roomStorage: {},
  displayAllMessages: function() {
    for (var key in this.messageStorage) {
        var element = $(document.createElement('div'));
        var $username = $(document.createElement('span'))
          .addClass(_.escape(this.messageStorage[key].username))
//          .addClass('username')
          .text(_.escape(this.messageStorage[key].username + ': '));
        var $message = $(document.createElement('span'))
          .addClass(_.escape(this.messageStorage[key].username))
          .text(_.escape(this.messageStorage[key].text));
        element.append($username).append($message);
        $('.all-messages').append(element);
      }
  },
  fetch: function(typeOfRequest, queries) {
    $.ajax({
      url: this.server,
      type: typeOfRequest,
      data: queries,
      success: function(data) {
        // loop through data and compare data on server to already existing object above
        for (var i = 0; i < data.results.length; i++) {
          if (!app.messageStorage[data.results[i].objectId]) {
            app.messageStorage[data.results[i].objectId] = data.results[i];
            // roomStorage[roomName] = roomName
            app.roomStorage[data.results[i].roomname] = data.results[i].roomname;
            //queue up this message to be displayed
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
    // get most recent 100 messages
    this.fetch('GET', 'order=-createdAt');

    setTimeout(function() {
      $('span').on("click", function(){
    // $('.theusername') <- array of all span tags with that username as a class
        console.log($(this)[0]);
        // "kat username"
        var currentClassname = $(this)[0].className;
        $('.'+currentClassname)
        .addClass('bold');

    })}, 4000);

    setTimeout(function(){for(var key in app.roomStorage) {
      var option = $(document.createElement('option'));
      option.val(_.escape(key));
      option.text(_.escape(key));
      $('.room-dropdown').append(option);
    }}, 2000);
    // every 3 seconds or sooner we check for the most recent 10 messages
    // setInterval(app.fetch.bind(app, 'GET', 'order=-createdAt'), 3000);
    setTimeout(app.displayAllMessages.bind(app), 3000);

  },
  server: 'https://api.parse.com/1/classes/chatterbox',
  // queue: {
  //   storage: {},
  //   start: 0,
  //   end: 0,

  //   enqueue: function(value) {

  //     storage[end++] = value;
  //   },

  //   dequeue: function() {

  //     someInstance.size() && start++;
  //     var result = storage[start];

  //     delete storage[start];

  //     return result;
  //   },

  //   size: function() {

  //     return end - start;
  //   }
  // }
};

$(document).ready(function() {
  //add click handler, on click, run send, passing in input message
  $('.send-button').on('click', function() {
    var messageObj = {
      username: $('.username-input').val(),
      text: $('.message-input').val(),
      roomname: $('.room-dropdown').val()
    }
    app.send(messageObj);
  });

  $('.room-dropdown').change(function(){
    $('.all-messages').empty();
    //loop through our allMessages object to display messages with roomID which equals value of dropdown
    if ($(this).val() === 'new-room') {
      var roomName = prompt('Enter a room name?');
      var option = $(document.createElement('option'));
      option.val(_.escape(roomName));
      option.text(_.escape(roomName));
      $('.room-dropdown').append(option);
      $('.room-dropdown').val(roomName);
    }
    for(var key in app.messageStorage) {
      if(app.messageStorage[key].roomname === $(this).val()) {
        var element = $(document.createElement('div'));
        element.text(_.escape(app.messageStorage[key].username) + ': ' + _.escape(app.messageStorage[key].text));
        $('.all-messages').append(element);
      }
    }
  });


});
// $('message-input').val
// $('username-input').val



app.init();

//create a drowdown in HTML with values of the Room ID in message objects for the dropdown list
//when a certain room ID is selected, change the displayed messages to filter to that room



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