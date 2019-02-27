var penGroups = [{
    title: 'HTML Components',
    pens: [{
        title: 'Component #1',
        hash: 'ywNzwJ'
    }]
}];


document.addEventListener("DOMContentLoaded", function () {
    var main = document.querySelector('main');
    var nav = document.querySelector('nav');

    for (var i = 0; i < penGroups.length; i++) {
        var menuHTML = '', penCardsHTML = '';

        menuHTML = '<div class="menu">';
        menuHTML += '<div class="label">' + penGroups[i].title + '</div>';

        for (var ii = 0; ii < penGroups[i].pens.length; ii++) {
            menuHTML += '<a href="#' + penGroups[i].pens[ii].hash + '">' + penGroups[i].pens[ii].title + '</a>';

            penCardsHTML += '<div class="card pen-card">';

            penCardsHTML += '<div id="' + penGroups[i].pens[ii].hash + '" class="card-toolbars">' +
                '<div class="card-title">' +
                '<h3 class="label">' + penGroups[i].pens[ii].title + '</h3>' +
                '</div></div>';

            penCardsHTML += '<p class="codepen" ' +
                'data-height="358" ' +
                'data-theme-id="dark" ' +
                'data-default-tab="html,result" ' +
                'data-user="keagan-galvin" ' +
                'data-slug-hash="' + penGroups[i].pens[ii].hash + '" ' +
                'style="height: 358px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" ' +
                'data-pen-title="' + penGroups[i].pens[ii].title + '" >' +
                '<span>See the Pen <a href="https://codepen.io/keagan-galvin/pen/' + penGroups[i].pens[ii].hash + '/">' + penGroups[i].pens[ii].title + '</a> by keagan-galvin (<a href="https://codepen.io/keagan-galvin">@keagan-galvin</a>) on <a href="https://codepen.io">CodePen</a>.</span>' +
                '</p>';

            penCardsHTML += '</div>';
        }

        menuHTML += '</div>';

        nav.insertAdjacentHTML('beforeend', menuHTML);
        main.insertAdjacentHTML('beforeend', penCardsHTML);
    }
});