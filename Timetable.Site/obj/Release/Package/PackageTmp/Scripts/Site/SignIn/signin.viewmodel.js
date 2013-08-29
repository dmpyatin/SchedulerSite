var dModel;

function signInViewModel() {
    var self = this;

    self.validationState = ko.observable(false);
    self.signName = ko.observable();
    self.signPassword = ko.observable();


    self.init = function () {
        $('#modalDialog').modal('show');
    }
    self.signName.subscribe(function (newValue) {
        $('#signInError').addClass('hide');
    });

    self.signPassword.subscribe(function (newValue) {
        $('#signInError').addClass('hide');
    });

   
    self.SignIn = function (returnUrl) {

        var SignInModel = {
            UserName: self.signName(),
            Password: self.signPassword(),
            RememberMe: false,
        };

        $.ajax({
            url: "SignIn/Index",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ model: SignInModel }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                if (responseText == "False") {
                    $('#signInError').removeClass('hide');
                } else {
                    var Url = "http://" + document.location.host + returnUrl;
                    document.location.href = Url;
                }
            },
            error: function () {

            }
        });   
    }
}

$(function () {
    signInViewModel = new signInViewModel();
    dModel = new dataModel();

    signInViewModel.init();

    ko.applyBindings(signInViewModel);
});