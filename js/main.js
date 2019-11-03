window.addEventListener('scroll', function(e){
    var navbar = document.getElementsByTagName('nav')[0];
    var scroll = window.scrollY;
    if (scroll > 0) {
        navbar.classList.add("top-nav-collapse");
    } else {
        navbar.classList.remove("top-nav-collapse");        
    }
});

var navbarCollapse = true;
document.querySelector("button.toggler").addEventListener('click', function(e){
    if (navbarCollapse) {
        document.querySelector("nav.nav .items").classList.remove("collapse");
        this.classList.add("collapse");
    } else {
        document.querySelector("nav.nav .items").classList.add("collapse");
        this.classList.remove("collapse");
    }
    navbarCollapse = !navbarCollapse;
});


document.querySelectorAll('a.page-scroll').forEach(function(element){
    element.addEventListener('click', function(e){
        navPageScroll(this.href);
        e.preventDefault();
    });
});



function navPageScroll(target) {
    var target = target.split('#')[1];
    var targetEl = document.getElementById(target);
    var destination = targetEl.offsetTop;
    if (destination < targetEl.parentElement.offsetTop) destination = targetEl.parentElement.offsetTop + 30;

    window.location.hash = target;
    window.scrollTo({
        'behavior': 'smooth',
        'left': 0,
        'top': destination - 90
    });
}


document.addEventListener("DOMContentLoaded", function(e){
    setTimeout(function(){
        if (window.location.hash != '') navPageScroll(window.location.hash);
    }, 500);
});


document.addEventListener("scroll", function(e){
    var menuItems = document.querySelectorAll('nav.nav .item');
    menuItems.forEach(function(e){
        e.classList.remove("active");
    });

    menuItems.forEach(function(e){
        var eChild = e.querySelector('a.page-scroll');
        var el = eChild.innerHTML.toLowerCase()
        var elem = document.querySelector('#' + el);
        var bounding = elem.getBoundingClientRect();

        // console.log(el + " " + window.innerHeight + "  -  "  + bounding.top + "  -  "  + elem.parentElement.clientHeight);
    
        if (bounding.top <= 100  && bounding.top >= (130 - elem.parentElement.clientHeight)) {
            e.classList.add("active");
            return;
        }
    });
});