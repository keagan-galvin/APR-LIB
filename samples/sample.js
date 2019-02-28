var penGroups = [{
    title: 'Components',
    pens: [{
            title: 'Buttons',
            hash: 'bZdzgO',
            height: '657px'
        },
        {
            title: 'Card',
            hash: 'YgXRWd',
            height: '350px'
        },
        {
            title: 'Progress Bar',
            hash: 'aMOPYo',
            height: '475px'
        }
    ]
}];


document.addEventListener("DOMContentLoaded", function () {
    var main = document.querySelector('main');
    var nav = document.querySelector('nav');

    for (var i = 0; i < penGroups.length; i++) {
        var menuHTML = '',
            penCardsHTML = '';

        menuHTML = '<div class="menu">';
        menuHTML += '<div class="label">' + penGroups[i].title + '</div>';

        for (var ii = 0; ii < penGroups[i].pens.length; ii++) {
            menuHTML += '<a href="#' + penGroups[i].pens[ii].hash + '">' + penGroups[i].pens[ii].title + '</a>';

            penCardsHTML += '<div id="' + penGroups[i].pens[ii].hash + '" class="pen-card">';

            penCardsHTML += '<p class="codepen" ' +
                'data-height="' + ((penGroups[i].pens[ii].height) ? penGroups[i].pens[ii].height : '350px') + '" ' +
                'data-theme-id="0" ' +
                'data-default-tab="result" ' +
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