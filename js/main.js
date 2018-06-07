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

//function to set cookie (used to save favorite heroes)
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

//function to get cookie (used to get favorite heroes from cookie)
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

//main function, processes all data from json
function mycallback(data) {

    //data
    var heroes = JSON.parse(data);

    //render hero portraits in alphabetical order in three groups by their attribute
    heroes = heroes.sort(comparator.bind(null, 'localized_name'));

    var txt_str = '';
    var txt_agi = '';
    var txt_int = '';
    for (i in heroes) {
        var item = '<div data-id="' + heroes[i].id +
            '" data-toggle="tooltip" data-placement="bottom" title="' +
            heroes[i].localized_name + '" class="hero"><img src="http://cdn.dota2.com/apps/dota2/images/heroes/' +
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
        console.log(totalFavorites);
        totalFavoritesSpan.innerHTML = totalFavorites;
    }

    //update favorites and cookie on hero clicking
    //todo visualize number of favorite heroes
    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', function () {
            var id = this.getAttribute("data-id");
            if (!hasInside(favorites, id)) {
                favorites.push(id);
                this.classList.add("favorite");
            } else {
                var index = favorites.indexOf(id);
                favorites.splice(index, 1);
                this.classList.remove("favorite");
            }
            totalFavorites = favorites.length;
            totalFavoritesSpan.innerHTML = totalFavorites;
            var favoritesCookie = JSON.stringify(favorites);
            setCookie("favs", favoritesCookie, 365);
        }, false);
        items[i].addEventListener('click', selectHeroes, false);
    }

    var selectors = document.getElementsByClassName("selector");
    for (var i = 0; i < selectors.length; i++) {
        selectors[i].addEventListener('click', selectHeroes, false);
    }

    //default values
    var roleSelected = 'all';
    var damageSelected = 'all';
    var rangeSelected = 'all';
    // var aoesplashSelected = 'all';
    // var roamerSelected = 'all';
    // var initiatorSelected = 'all';
    // var disablerSelected = 'all';
    // var nukerSelected = 'all';
    // var saverSelected = 'all';
    // var pusherSelected = 'all';
    // var durableSelected = 'all';
    var favoritesSelected = false;

    var specialsSelected = [];

    function selectHeroes() {

        var attribute = this.getAttribute("data-select");
        var value = this.getAttribute("data-value");
        var alreadySelected;

        if (hasClass(this, "selected")) {
            console.log("already selected");
            alreadySelected = true;
        }
        var clickedGroup = document.querySelectorAll('[data-select="' + attribute + '"]');
        for (var i = 0; i < clickedGroup.length; i++) {
            // console.log(clickedGroup[i].getAttribute("data-select"));
            if (!(clickedGroup[i].getAttribute("data-select") == 'specials')) {
                clickedGroup[i].classList.remove("selected");
            }
        }
        switch (this.getAttribute("data-select")) {
            case 'role':
                if (alreadySelected) {
                    roleSelected = 'all';
                    this.classList.remove("selected");
                } else {
                    roleSelected = value;
                    this.classList.add("selected");
                }
                break;
            case 'damage':
                if (alreadySelected) {
                    damageSelected = 'all';
                    this.classList.remove("selected");
                } else {
                    damageSelected = value;
                    this.classList.add("selected");
                }
                break;
            case 'range':
                if (alreadySelected) {
                    rangeSelected = 'all';
                    this.classList.remove("selected");
                } else {
                    rangeSelected = value;
                    this.classList.add("selected");
                }
                break;
            case 'favorites':
                if (alreadySelected) {
                    favoritesSelected = false;
                    this.classList.remove("selected");
                } else {
                    favoritesSelected = value;
                    this.classList.add("selected");
                }
                break;
                // case 'aoesplash':
                //     if (alreadySelected) {
                //         aoesplashSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         aoesplashSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'roamer':
                //     if (alreadySelected) {
                //         roamerSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         roamerSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'initiator':
                //     if (alreadySelected) {
                //         initiatorSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         initiatorSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'disabler':
                //     if (alreadySelected) {
                //         disablerSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         disablerSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'nuker':
                //     if (alreadySelected) {
                //         nukerSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         nukerSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'pusher':
                //     if (alreadySelected) {
                //         pusherSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         pusherSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'durable':
                //     if (alreadySelected) {
                //         durableSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         durableSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;
                // case 'saver':
                //     if (alreadySelected) {
                //         saverSelected = 'all';
                //         // this.classList.remove("selected");
                //     } else {
                //         saverSelected = value;
                //         this.classList.add("selected");
                //     }
                //     break;

            case 'specials':
                console.log('before: [' + specialsSelected + ']');
                if (alreadySelected) {
                    console.log('removing from specialsSelected');
                    var index = specialsSelected.indexOf(value);
                    specialsSelected.splice(index, 1);
                    this.classList.remove("selected");
                } else {
                    console.log('adding to specialsSelected');
                    console.log(typeof (value));
                    specialsSelected.push(value);
                    this.classList.add("selected");
                }
                console.log('after: [' + specialsSelected + ']');
                break;
        }

        //todo attribute == specials, value == roamer/pusher/disabler etc.



        var affected = [];
        // for (var i = 0; i < heroes.length; i++) {
        //     if (
        //         (roleSelected == 'all' || hasInside(heroes[i].roles, parseInt(roleSelected))) &&
        //         (rangeSelected == 'all' || hasInside(heroes[i].range, parseInt(rangeSelected))) &&
        //         (damageSelected == 'all' || hasInside(heroes[i].damage, parseInt(damageSelected))) &&
        //         (aoesplashSelected == 'all' || heroes[i].aoesplash) &&
        //         (roamerSelected == 'all' || heroes[i].roamer) &&
        //         (initiatorSelected == 'all' || heroes[i].initiator) &&
        //         (disablerSelected == 'all' || heroes[i].disabler) &&
        //         (nukerSelected == 'all' || heroes[i].nuker) &&
        //         (pusherSelected == 'all' || heroes[i].pusher) &&
        //         (durableSelected == 'all' || heroes[i].durable) &&
        //         (saverSelected == 'all' || heroes[i].saver) &&
        //         (favoritesSelected == false || hasInside(favorites, heroes[i].id.toString()))
        //     ) {
        for (var i = 0; i < heroes.length; i++) {
            if (
                (roleSelected == 'all' || hasInside(heroes[i].roles, parseInt(roleSelected))) &&
                (rangeSelected == 'all' || hasInside(heroes[i].range, parseInt(rangeSelected))) &&
                (damageSelected == 'all' || hasInside(heroes[i].damage, parseInt(damageSelected))) &&
                (favoritesSelected == false || hasInside(favorites, heroes[i].id.toString())) &&
                ((specialsSelected.length == 0) || ( heroes[i].hasOwnProperty("specials") && arrayContainsArray(heroes[i].specials, specialsSelected) ) )
            ) { 
                // console.log(heroes[i].localized_name + ' ' + heroes[i].specials);

                // console.log(heroes[i].hasOwnProperty("specials"));

                // if (heroes[i].hasOwnProperty("specials") ) {
                //     console.log(specialsSelected);
                //     console.log(heroes[i].specials);


                //     if (arrayContainsArray(heroes[i].specials, specialsSelected)) {
                //         affected.push(heroes[i].id);
                //     }

                // } else {
                    affected.push(heroes[i].id);
                // }
            }
        }

        //get rendered hero-items, check their ids and add respective classes depending if id is in the affected array
        for (var i = 0; i < items.length; i++) {
            var id = items[i].getAttribute("data-id");
            if (hasInside(affected, parseInt(id))) {
                if (hasClass(items[i], "darken")) {
                    items[i].classList.remove("darken");
                }
                items[i].classList.add("lighten");
            } else {
                if (hasClass(items[i], "lighten")) {
                    items[i].classList.remove("lighten");
                }
                items[i].classList.add("darken");
            }
        }
    }
}

getHeroes('heroes.json', mycallback); //passing mycallback as a method





// var filter = {
//     address: 'USA',
//     name: 'Mark'
// };
// var users = [{
//         name: 'John',
//         email: 'johnson@mail.com',
//         age: 25,
//         address: ['Canada', 'England']
//     },
//     {
//         name: 'Tom',
//         email: 'tom@mail.com',
//         age: 35,
//         address: ['USA', 'Canada', 'England']
//     },
//     {
//         name: 'Mark',
//         email: 'mark@mail.com',
//         age: 28,
//         address: ['Canada', 'Ua']
//     },
//     {
//         name: 'Mark',
//         email: 'mark@mail.com',
//         age: 28,
//         address: ['USA', 'England', 'Ua']
//     }
// ];

// myFilter = function (item) {
//     for (var key in filter) {
//         if (item[key] === undefined || item[key] != filter[key])
//             return false;
//     }
//     return true;
// }

// users = users.filter(myFilter);

// console.log(users)



/*
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
// function arrayContainsArray(superset, subset) {
//     return subset.every(function (value) {
//         return (superset.indexOf(value) >= 0);
//     });
// }

// var array1 = ['A', 'B', 'C', 'D', 'E'];
// var array2 = ['B', 'C', 'E'];
// var array3 = ['B', 'C', 'Z'];
// var array4 = ['Z'];


// console.log(arrayContainsArray(array1, array2));