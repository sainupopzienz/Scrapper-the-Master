function includeHTML() {
  var elements, i, element, file, xhttp;
  elements = document.getElementsByTagName("*");
  for (i = 0; i < elements.length; i++) {
    element = elements[i];
    file = element.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            element.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            element.innerHTML = "Page not found.";
          }
          element.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

$(window).on("load", function () {
  includeHTML();
  $(".loader_outer").fadeOut(function () {
    // initializeDropdown();
  });
});

// // Set the launch date and time
// const launchDate = new Date("February 1, 2025 00:00:00").getTime();

// // Update the countdown every second
// const countdownTimer = setInterval(function () {
//   const now = new Date().getTime();
//   const timeLeft = launchDate - now;

//   // Calculate days, hours, minutes, and seconds
//   const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
//   const hours = Math.floor(
//     (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

//   // Display the result
//   document.getElementById(
//     "countdown"
//   ).innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

//   // If the countdown is finished
//   if (timeLeft < 0) {
//     clearInterval(countdownTimer);
//     document.getElementById("countdown").innerHTML = "We're live now!";
//   }
// }, 1000);

// function initializeDropdown() {
//   debugger;
//   var dropdownMenu = document.querySelector("#dropdownMenu");
//   var dropdownToggle = document.querySelector(".dropdown-toggle");

//   if (dropdownMenu && dropdownToggle) {
//     console.log("Dropdown menu and toggle button found");

//     dropdownToggle.addEventListener("click", function (e) {
//       e.stopPropagation(); // Prevent the click from propagating to the document
//       console.log("Dropdown toggle button clicked");
//     });

//     document.addEventListener("click", function (e) {
//       if (
//         !dropdownMenu.contains(e.target) &&
//         !dropdownToggle.contains(e.target)
//       ) {
//         console.log("Clicked outside, closing dropdown");
//       }
//     });

//     dropdownMenu.addEventListener("click", function (e) {
//       e.stopPropagation(); // Prevent the click from propagating to the document
//       console.log("Clicked inside dropdown menu, preventing close");
//     });
//   } else {
//     console.error("Dropdown menu or toggle button not found");
//   }
// }
