sap.ui.define([], function () {
    "use strict";

    return {
        formatCurrency: function (value) {
            if (value === undefined || value === null || value === "") {
                return "";
            }

            var number = Number(value);
            if (!isFinite(number)) {
                return value;
            }

            return number.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }
    };
});
