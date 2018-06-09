//custom sorting
function comparator(key, a, b) {
    if (a[key] > b[key]) return 1;
    if (a[key] < b[key]) return -1;
    return 0;
}

//check if specific array has specific item
function hasInside(array, item) {
    return array.includes(item);
}

//check if element has specific class
function hasClass(element, classSearched) {
    return (' ' + element.className + ' ').indexOf(' ' + classSearched + ' ') > -1;
}

//set cookie (used to save favorite heroes)
function setCookie(name, value, expirationDays) {
    var date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = " expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
}

function arrayContainsArray(superset, subset) {
    return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    });
}

//get cookie (used to get favorite heroes from cookie)
function getCookie(cookieName) {
    var name = cookieName + "=";
    var cookieArray = document.cookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

//get heroes info from json
getHeroes = function (url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    request.open('GET', url);
    request.send();
}
getHeroes('heroes.json', getHeroesCallback);

//main function, processes all data from json
function getHeroesCallback(data) {

    //data
    var heroes = JSON.parse(data);

    //render hero portraits in alphabetical order in three groups by their attribute
    heroes = heroes.sort(comparator.bind(null, 'localized_name'));

    var txt_str = '';
    var txt_agi = '';
    var txt_int = '';

    for (i in heroes) {
        var item = '<div data-id="' + heroes[i].id +
            '" class="hero"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/' +
            heroes[i].name.substr(14, heroes[i].name.length) + '_lg.png"><i class="favorite-star fas fa-star"></i><i class="favorite-star far fa-star"></i></div>';
        if (heroes[i].attribute == 'str') {
            txt_str += item;
        } else if (heroes[i].attribute == 'agi') {
            txt_agi += item;
        } else {
            txt_int += item;
        }
    }
    document.getElementById("demo_str").innerHTML = txt_str;
    document.getElementById("demo_agi").innerHTML = txt_agi;
    document.getElementById("demo_int").innerHTML = txt_int;

    //favorite heroes processing, if cookie exists, get values from it and add css class to favorite heroes in list
    var favorites = [];
    var totalFavorites;
    var totalFavoritesSpan = document.getElementById("total-favorites");
    var items = document.querySelectorAll(".hero");

    if (getCookie("favs")) {
        favorites = JSON.parse(getCookie("favs"));
        for (var i = 0; i < items.length; i++) {
            var id = items[i].getAttribute("data-id");
            if (hasInside(favorites, id)) {
                items[i].classList.add("favorite");
            }
        }
        totalFavorites = favorites.length;
        // console.log(totalFavorites);
        totalFavoritesSpan.innerHTML = totalFavorites;
    }

    //update favorites and cookie on hero clicking
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', showHeroes, false);
        items[i].addEventListener('mouseover', showHeroIdentity, false);
    }

    var selectors = document.getElementsByClassName("selector");
    var favoritesToggled = false;
    var featuresSelected = [];

    for (var i = 0; i < selectors.length; i++) {
        selectors[i].addEventListener('click', selectFilters, false);
        selectors[i].style = "background-position: " + Math.floor(Math.random() * 200) + "px " + Math.floor(Math.random() * 200) + "px";
    }

    function selectFilters() {

        var value = this.getAttribute("data-value");

        if (hasClass(this, "selected")) {
            var index = featuresSelected.indexOf(value);
            if (this.getAttribute("data-value") == "favorites") {
                favoritesToggled = false;
            } else {
                featuresSelected.splice(index, 1);
            }
            this.classList.remove("selected");
        } else {
            if (this.getAttribute("data-value") == "favorites") {
                favoritesToggled = true;
            } else {
                featuresSelected.push(value);
            }
            this.classList.add("selected");
        }

        showHeroes();

    }

    function showHeroes() {

        var affected = [];

        for (var i = 0; i < heroes.length; i++) {
            if (
                (favoritesToggled == false || hasInside(favorites, heroes[i].id.toString())) &&
                ((featuresSelected.length == 0) || (heroes[i].hasOwnProperty("features") && arrayContainsArray(heroes[i].features, featuresSelected)))
            ) {
                affected.push(heroes[i].id);
            }
        }

        //get rendered hero-items, check their ids and add respective classes depending if id is in the affected array
        for (var i = 0; i < items.length; i++) {
            var id = items[i].getAttribute("data-id");
            if (hasInside(affected, parseInt(id))) {
                items[i].classList.remove("darken");
                items[i].classList.add("lighten");
            } else {
                items[i].classList.remove("lighten");
                items[i].classList.add("darken");
            }
        }
    }

    var heroHover = document.getElementById("herohover");
    var heroHoverName = document.getElementById("herohover_name");
    var heroHoverAttribute = document.getElementById("herohover_attr");
    var heroHoverImage = document.getElementById("herohover_img");
    var heroHoverRoles = document.getElementById("herohover_roles");

    function showHeroIdentity() {

        var systemName, name, attribute, features;
        var id = this.getAttribute("data-id");

        if (hasInside(favorites, id)) {
            // console.log('has to be fav');
            heroHover.classList.add("favorite");
        } else {
            heroHover.classList.remove("favorite");
        }

        for (var i = 0; i < heroes.length; i++) {
            if (heroes[i].id == id) {

                systemName = heroes[i].name;
                name = heroes[i].localized_name;
                attribute = heroes[i].attribute;
                features = heroes[i].features;
            }
        }
        heroHoverName.innerHTML = name;
        heroHover.setAttribute("data-id", id);
        heroHoverAttribute.setAttribute("src", "img/hero_" + attribute + ".png")
        
        var rolesText = '';
        for (var i = 0; i < features.length; i++) {
            switch (features[i]) {
                case "carry":
                case "mid":
                case "offlane":
                case "support":
                case "jungler":
                    rolesText += '<i class="fa fa-role fa-role-' + features[i] + '"></i>';
                    break;
            }
        }
        heroHoverImage.src = "http://cdn.dota2.com/apps/dota2/images/heroes/" + systemName.substr(14, systemName.length) + "_lg.png";
        heroHoverRoles.innerHTML = rolesText;

        var top = this.offsetTop;
        var left = this.offsetLeft;
        moveHeroHover(top, left);
        
    }

    function moveHeroHover(top, left) {
        heroHover.style.left = left - 90 + 48.5 + 'px';
        heroHover.style.top = top - 45 + 27 + 'px';
    }

    heroHover.addEventListener('mouseleave', function () {
        this.style.left = '-100%';
        this.style.top = '-100%';
    }, false);

    heroHover.addEventListener('click', function () {

        var id = this.getAttribute("data-id");

        if (!hasInside(favorites, id)) {
            favorites.push(id);
            for (var i = 0; i < items.length; i++) {
                if (items[i].getAttribute("data-id") == id) {
                    items[i].classList.add("favorite");
                    this.classList.add("favorite");
                }
            }
        } else {
            var index = favorites.indexOf(id);
            favorites.splice(index, 1);
            for (var i = 0; i < items.length; i++) {
                if (items[i].getAttribute("data-id") == id) {
                    items[i].classList.remove("favorite");
                    this.classList.remove("favorite");
                }
            }
        }
        totalFavorites = favorites.length;
        totalFavoritesSpan.innerHTML = totalFavorites;
        var favoritesCookie = JSON.stringify(favorites);
        setCookie("favs", favoritesCookie, 3650);
        showHeroes();

    }, false);

}