//  Back to top button

// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 56 || document.documentElement.scrollTop > 56) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// button on scroll function that does not cut off div

function scrollToSection(id) {
    const element = document.getElementById(id);
    const offset = 200; // Adjust this value based on navbar height
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
    });
}

