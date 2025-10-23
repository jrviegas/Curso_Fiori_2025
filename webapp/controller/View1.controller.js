sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("zped.controller.View1", {
        formatter: formatter,
        onInit: function () {

        },
        onHelloWorldButtonPress: function(){
            alert("Hello World !!!");
        }
    });
});
