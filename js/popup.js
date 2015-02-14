var intervalTime = 1000;

function updateMessages(){
  var messages = chrome.extension.getBackgroundPage().messages;

  $("#list").empty();
  messages.forEach(function(message){
    $("#list").append(
      $('<tr>').append(
        $('<td>').addClass('time').attr("nowrap",'').append(
          $('<div/>').html(moment(message.date).format('YYYY-MM-DD'))
        )
      ).append(
        $('<td>').addClass("title").attr("nowrap",'').append(
          $('<div/>').html(message.name)
        )
      ).append(
        $('<td>').addClass("msg").attr("nowrap",'').append(
          $('<div/>').html(message.msg).append(
            $('<span/>').addClass("from-now").html(moment(message.date).fromNow())
          )
        )
      )
    )
  });
}

// 定周期でPopupを更新する
$(document).ready(function() {
  updateMessages();
  setInterval(updateMessages,intervalTime);
});
