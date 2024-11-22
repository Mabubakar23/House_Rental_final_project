$('#checkin').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    startDate: new Date() // Disable past dates
});

$('#checkout').datepicker({
    format: 'yyyy-mm-dd',
    autoclose: true,
    startDate: new Date()
});


function myFunction() {
    var input, filter, cards, title, i, txtValue;
    input = document.getElementById("where");
    filter = input.value.toUpperCase();
    cards = document.querySelectorAll("#houseSea .card-house"); // Select all cards
    
    for (i = 0; i < cards.length; i++) {
        title = cards[i].querySelector(".card-title"); // Select the h5 element with class card-title
        if (title) {
            txtValue = title.textContent || title.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                cards[i].parentElement.style.display = ""; // Show the card column
            } else {
                cards[i].parentElement.style.display = "none"; // Hide the card column
            }
        }
    }
}

