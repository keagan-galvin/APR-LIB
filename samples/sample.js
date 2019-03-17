var penGroups = [{
        title: 'Components',
        pens: [{
                title: 'Buttons',
                hash: 'bZdzgO'
            },
            {
                title: 'Card',
                hash: 'YgXRWd',
                height: '350px'
            },
            {
                title: 'Progress Bar',
                hash: 'aMOPYo'
            }
        ]
    },
    {
        title: 'FormHelpers',
        pens: [{
            title: 'Form',
            hash: 'eXpxQp'
        }]
    },
    {
        title: 'DialogService',
        pens: [{
                title: 'Custom Dialog',
                hash: 'LaxBgV'
            },
            {
                title: 'Confirmation Dialog',
                hash: 'LaxBgV'
            }
        ]
    },
    {
        title: 'Toaster',
        pens: [{
            title: 'Toast',
            hash: 'moRjNm'
        }]
    }
];

var main, nav;
document.addEventListener("DOMContentLoaded", function () {
    main = document.querySelector('main');
    nav = document.querySelector('nav');

    for (var i = 0; i < penGroups.length; i++) {
        var menuHTML = '';

        menuHTML = '<div class="menu">';
        menuHTML += '<div class="label">' + penGroups[i].title + '</div>';

        for (var ii = 0; ii < penGroups[i].pens.length; ii++)
            menuHTML += '<a href="#" onclick="SetPen(this)" pen-hash="' + penGroups[i].pens[ii].hash + '">' + penGroups[i].pens[ii].title + '</a>';

        menuHTML += '</div>';

        nav.insertAdjacentHTML('beforeend', menuHTML);
    }

    nav.querySelector('a').click();
});

function SetPen(target) {
    target = CommonHelpers.seekElementInBranch(target, "hasAttribute", "pen-hash");

    if (target) {
        console.log('setting pen!');

        var hash = target.getAttribute('pen-hash');
        var active = nav.querySelector('.active');

        if (active) active.classList.remove('active');
        if (target.classList) event.target.classList.add('active');

        var iframe = main.querySelector('iframe');
        iframe.src = "http://codepen.io/keagan-galvin/embed/" + hash + "/?theme-id=36268";
    }


}

var form = FormHelpers.Form(document.querySelector('.card'));
var select = form.field('State');


function getFormData() {

    // simulat long request
    var minTime = 1000;
    var now = new Date();

    form.progressBar.isLoading = true;

    HttpService.get('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_titlecase.json').then(
        response => {

            var span = new Date() - now;

            if (span >= minTime) set();
            else setTimeout(set, minTime - span);


            function set() {
                var options = [];

                for (var i = 0; i < response.data.length; i++) {
                    options.push({
                        text: response.data[i].name,
                        value: response.data[i].abbreviation
                    });
                }

                select.options = options;
            }
        },
        error => console.log(error));

}