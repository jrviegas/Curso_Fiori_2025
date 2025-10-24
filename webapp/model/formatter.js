sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    var oDateFormat = DateFormat.getDateInstance({
        pattern: "dd/MM/yyyy"
    });

    function resolveDate(value) {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return value;
        }

        if (typeof value === "number") {
            var oFromNumber = new Date(value);
            return isNaN(oFromNumber.getTime()) ? null : oFromNumber;
        }

        if (typeof value === "string") {
            var sTrimmed = value.trim();

            if (!sTrimmed) {
                return null;
            }

            var aMatches = /Date\(([-+]?\d+)(?:[-+]\d{4})?\)/.exec(sTrimmed);
            if (aMatches && aMatches[1]) {
                var iMillis = parseInt(aMatches[1], 10);
                var oFromMatch = new Date(iMillis);
                return isNaN(oFromMatch.getTime()) ? null : oFromMatch;
            }

            var oFromString = new Date(sTrimmed);
            return isNaN(oFromString.getTime()) ? null : oFromString;
        }

        if (typeof value === "object" && typeof value.ms === "number") {
            var oFromMsProperty = new Date(value.ms);
            return isNaN(oFromMsProperty.getTime()) ? null : oFromMsProperty;
        }

        return null;
    }

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
            var oDate = resolveDate(value);

            if (!oDate) {
                return "";
            }

            return oDateFormat.format(oDate);
        }
    };
});
