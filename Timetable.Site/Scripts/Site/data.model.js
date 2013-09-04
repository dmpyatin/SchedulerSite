function showError(msg) {
    $.jGrowl("<b><span style='color: #F20;'>" + msg + "</span></b>", { header: "<b><span style='color: #F20;'>Ошибка</span></b>", position: "center" });
}

function dataModel() {
    var self = this;

    self.isLoading = ko.observable(false);

    self.isLoading.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if(newValue == true)
                $("#progressbar").removeClass("hide");
            else
                $("#progressbar").addClass("hide");
        }
    });

    self.loadData = function (arg) {
    

        ko.dependentObservable(function () {

            self.isLoading(true);

            if(pathPrefix.length > 0)
                if (pathPrefix[pathPrefix.length-1] !== "/")
                    pathPrefix += "/";

            $.ajax({
                type: 'GET',
                url: pathPrefix + 'api/v1.0/' + arg.address,
                data: arg.params,
                success: function (data) {
                    if (arg.onbefore !== undefined)
                        arg.onbefore();

                    if (arg.obj !== undefined) {
                        arg.obj([]);
                        $.each(data, function (index, item) {

                            arg.obj.push(item);

                        });
                    }

                    if (arg.onsuccess !== undefined)
                        arg.onsuccess(data);

                    self.isLoading(false);
                },
                error: function (x, h, r) {
                    if (arg.onerror !== undefined)
                        arg.onerror(x, h, r);
                    //else
                        //self.showError("Возникла ошибка!");

                    self.isLoading(false);
                }
            });

            if (arg.after !== undefined)
                arg.after();

        }, this);
    };

    self.sendData = function (arg) {

        self.isLoading(true);

        if (arg.onbefore !== undefined)
            arg.onbefore(obj);

        $.ajax({
            type: 'POST',
            url: '/api/v1.0/' + arg.address,
            data: arg.params,
            success: function (data) {

                if (arg.onsuccess !== undefined)
                    arg.onsuccess(data);

                self.isLoading(false);
            },
            error: function () {
                //showError("Не удается подключиться к базе данных");

                self.isLoading(false);
            }
        });
    };

    self.loadDataFromController = function (arg) {
        ko.dependentObservable(function () {

            self.isLoading(true);

            $.ajax({
                type: 'GET',
                url: arg.address,
                data: arg.params,
                success: function (data) {
                    if (arg.onbefore !== undefined)
                        arg.onbefore();

                    if (arg.obj !== undefined) {
                        arg.obj([]);
                        $.each(data, function (index, item) {

                            arg.obj.push(item);

                        });
                    }

                    if (arg.onsuccess !== undefined)
                        arg.onsuccess(data);

                    self.isLoading(false);
                },
                error: function (x, h, r) {
                    if (arg.onerror !== undefined)
                        arg.onerror(x, h, r);
                    //else
                    //self.showError("Возникла ошибка!");

                    self.isLoading(false);
                }
            });

            if (arg.after !== undefined)
                arg.after();

        }, this);
    };


    self.sendDataToController = function (arg) {

        self.isLoading(true);

        if (arg.onbefore !== undefined)
            arg.onbefore(obj);

        $.ajax({
            type: 'POST',
            url: arg.address,
            data: arg.params,
            success: function (data) {

                if (arg.onsuccess !== undefined)
                    arg.onsuccess(data);

                self.isLoading(false);
            },
            error: function () {
                if (arg.onerror !== undefined)
                    arg.onerror(x, h, r);
                //else
                //self.showError("Возникла ошибка!");

                self.isLoading(false);
            }
        });
    };

    self.postify = function (value) {
        var result = {};

        var buildResult = function (object, prefix) {
            for (var key in object) {

                var postKey = isFinite(key)
                    ? (prefix != "" ? prefix : "") + "[" + key + "]"
                    : (prefix != "" ? prefix + "." : "") + key;

                switch (typeof (object[key])) {
                    case "number": case "string": case "boolean":
                        result[postKey] = object[key];
                        break;

                    case "object":
                        if (object[key].toUTCString)
                            result[postKey] = object[key].toUTCString().replace("UTC", "GMT");
                        else {
                            buildResult(object[key], postKey != "" ? postKey : key);
                        }
                }
            }
        };

        buildResult(value, "");

        return result;
    };
};