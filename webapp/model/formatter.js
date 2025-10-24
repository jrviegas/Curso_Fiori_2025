sap.ui.define([], function () {
    "use strict";

    function resolveDate(vValue) {
        if (vValue == null) {
            return null;
        }

        if (vValue instanceof Date) {
            return isNaN(vValue.getTime()) ? null : vValue;
        }

        if (typeof vValue === "string") {
            var sTrimmed = vValue.trim();

            if (!sTrimmed) {
                return null;
            }

            var aMatch = /Date\(([-+]?\d+)(?:[-+]\d{4})?\)/.exec(sTrimmed);
            if (aMatch && aMatch[1]) {
                var iMillis = parseInt(aMatch[1], 10);
                if (!isNaN(iMillis)) {
                    return new Date(iMillis);
                }
            }

            var iParsed = Date.parse(sTrimmed);
            if (!isNaN(iParsed)) {
                return new Date(iParsed);
            }

            return null;
        }

        if (typeof vValue === "number") {
            var oFromNumber = new Date(vValue);
            return isNaN(oFromNumber.getTime()) ? null : oFromNumber;
        }

        if (typeof vValue === "object") {
            if (typeof vValue.ms === "number") {
                var oFromMs = new Date(vValue.ms);
                return isNaN(oFromMs.getTime()) ? null : oFromMs;
            }

            if (typeof vValue.value !== "undefined") {
                return resolveDate(vValue.value);
            }

            if (typeof vValue.valueOf === "function") {
                var vConverted = vValue.valueOf();
                if (vConverted !== vValue) {
                    return resolveDate(vConverted);
                }
            }
        }

        return null;
    }

    function toDDMMYYYY(oDate) {
        var iDay = oDate.getDate();
        var iMonth = oDate.getMonth() + 1;
        var iYear = oDate.getFullYear();

        var sDay = iDay < 10 ? "0" + iDay : String(iDay);
        var sMonth = iMonth < 10 ? "0" + iMonth : String(iMonth);

        return sDay + "/" + sMonth + "/" + iYear;
    }

    function toNumber(value) {
        if (typeof value === "number") {
            return value;
        }

        if (typeof value === "string") {
            var sTrimmed = value.trim();

            if (!sTrimmed) {
                return NaN;
            }

            var sNormalized = sTrimmed
                .replace(/\./g, "") // remove thousands separators
                .replace(",", ".")
                .replace(/[^\d.-]/g, "");

            return Number(sNormalized);
        }

        if (value && typeof value.valueOf === "function") {
            var vValueOf = value.valueOf();
            if (vValueOf !== value) {
                return toNumber(vValueOf);
            }
        }

        return Number(value);
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

            try {
                return toDDMMYYYY(oDate);
            } catch (oError) {
                if (typeof sap !== "undefined" && sap && sap.base && sap.base.Log) {
                    sap.base.Log.warning("formatter.formatDate fallback for value: " + value, oError, "zped.model.formatter");
                }
                return "";
            }
        },

        determineValorPedidoState: function (value) {
            var fValor = toNumber(value);

            if (!isFinite(fValor)) {
                return "None";
            }

            if (fValor > 400) {
                return "Success";
            }

            if (fValor < 400) {
                return "Error";
            }

            return "Neutral";
        }
    };
});
