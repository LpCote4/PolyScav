(() => {
  var now = Date.now();

  var f = (element, seconds, prefix) => {
    if (seconds <= 0) {
      element.innerHTML = "&nbsp;";
      return;
    }
    var days = (seconds / 86400) | 0;
    var hours = ((seconds % 86400) / 3600) | 0;
    var minutes = ((seconds % 3600) / 60) | 0;
    var seconds = seconds % 60;

    var day = element.getElementsByClassName("countdown-days")[0];
    day.getElementsByClassName("number")[0].textContent = days;

    var hour = element.getElementsByClassName("countdown-hours")[0];
    hour.getElementsByClassName("number")[0].textContent = hours;
    var minute = element.getElementsByClassName("countdown-minutes")[0];
    minute.getElementsByClassName("number")[0].textContent = minutes;

    var second = element.getElementsByClassName("countdown-seconds")[0];
    second.getElementsByClassName("number")[0].textContent = seconds;

    element.getElementsByClassName("countdown-context")[0].textContent = prefix;
  };

  setInterval(() => {
    var elapsed = ((Date.now() - now) / 1000) | 0;
    var elements = document.getElementsByClassName("ctfd-event-countdown");
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var seconds = document.getElementsByName("start_in")[0].content - elapsed;
      if (seconds > 0) {
        f(element, seconds, "Event starts in ");
      } else {
        seconds = document.getElementsByName("ends_in")[0].content - elapsed;
        f(element, seconds, "Event ends in ");
      }
    }
  }, 1000);
})();
