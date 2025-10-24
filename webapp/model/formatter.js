sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    var oDateFormat = DateFormat.getDateInstance({
        pattern: "dd/MM/yyyy"
    });

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
        },

        formatDate: function (value) {
            if (!value) {
                return "";
            }

            var oDate = value instanceof Date ? value : new Date(value);
            if (isNaN(oDate.getTime())) {
                return value;
            }

            return oDateFormat.format(oDate);
        }
    };
});
