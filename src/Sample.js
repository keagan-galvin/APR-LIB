require('./lib/lib.js');

// console.log(HttpService);
// console.log(Toaster);
// console.log(DialogService);
 console.log(FormHelpers);
// console.log(CommonHelpers);
// console.log(ProgressBar);



setTimeout(() => {

    console.log(FormHelpers.Form(document.querySelector("#form")));

    setTimeout(() => {
        DialogService.ConfirmDialog({
            title: "Test Title",
            message: "Test Message!",
            width: '450px',
            useOverlayClose: false,
            confirmLabel: 'Yes, this works',
            cancelLabel: 'Nevermind'
        }).open();
    }, 1000);    
}, 2000);
