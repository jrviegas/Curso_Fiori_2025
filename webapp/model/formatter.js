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

            var oDate;
            if (value instanceof Date) {
                oDate = value;
            } else if (typeof value === 'string') {
                oDate = new Date(value);
            } else {
                return value;
            }

            if (isNaN(oDate.getTime())) {
                return value;
            }

            return oDateFormat.format(new Date(oDate));
        }
    };
});
