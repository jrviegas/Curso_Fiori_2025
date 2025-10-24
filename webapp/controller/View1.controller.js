sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("zped.controller.View1", {
        formatter: formatter,
        onInit: function () {
        },
        onAfterRendering: function () {
            this._autoResizePedidoColumns();
        },
        _autoResizePedidoColumns: function () {
            var oTable = this.byId("idPedidoTable");

            if (!oTable) {
                return;
            }

            var fnResizeColumns = function () {
                oTable.getColumns().forEach(function (oColumn, iIndex) {
                    oTable.autoResizeColumn(iIndex);
                });
                this._updateValorPedidoTotal(oTable);
            }.bind(this);

            if (this._fnPedidoRowsUpdatedHandler) {
                oTable.detachRowsUpdated(this._fnPedidoRowsUpdatedHandler);
            }

            this._fnPedidoRowsUpdatedHandler = fnResizeColumns;
            oTable.attachRowsUpdated(this._fnPedidoRowsUpdatedHandler);

            fnResizeColumns();
        },
        _updateValorPedidoTotal: function (oTable) {
            var oFooterText = this.byId("idValorPedidoFooterText");

            if (!oFooterText) {
                return;
            }

            var oBinding = oTable.getBinding("rows");

            if (!oBinding) {
                oFooterText.setText("Total: " + this.formatter.formatCurrency(0));
                return;
            }

            var aContexts = oBinding.getContexts(0, oBinding.getLength && oBinding.getLength());

            if (!aContexts || !aContexts.length) {
                if (oBinding.getCurrentContexts) {
                    aContexts = oBinding.getCurrentContexts();
                }
            }

            var fTotal = (aContexts || []).reduce(function (fSum, oContext) {
                var vValor = oContext.getProperty("ValorPedido");
                var fValor = Number(vValor);

                if (!isFinite(fValor) && typeof vValor === "string") {
                    var sSanitized = vValor.replace(/\./g, "").replace(",", ".");
                    fValor = Number(sSanitized);
                }

                return isFinite(fValor) ? fSum + fValor : fSum;
            }, 0);

            var sFormattedTotal = this.formatter.formatCurrency(fTotal);

            oFooterText.setText("Total: " + (sFormattedTotal || "0"));
        },
        onHelloWorldButtonPress: function(){
            alert("Hello World !!!");
        }
    });
});
