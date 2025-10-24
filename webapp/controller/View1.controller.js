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
            this._updateValorPedidoTotal();
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

                this._updateValorPedidoTotal();
            }.bind(this);

            if (this._fnPedidoRowsUpdatedHandler) {
                oTable.detachRowsUpdated(this._fnPedidoRowsUpdatedHandler);
            }

            this._fnPedidoRowsUpdatedHandler = fnResizeColumns;
            oTable.attachRowsUpdated(this._fnPedidoRowsUpdatedHandler);

            fnResizeColumns();
        },
        _updateValorPedidoTotal: function () {
            var oTable = this.byId("idPedidoTable");
            var oTotalText = this.byId("idValorPedidoTotalText");

            if (!oTable || !oTotalText) {
                return;
            }

            var oBinding = oTable.getBinding("rows");
            var fTotal = 0;

            if (!oBinding) {
                oTotalText.setText("Total: " + this.formatter.formatCurrency(0));
                return;
            }

            var aContexts = [];
            var iLength = typeof oBinding.getLength === "function" ? oBinding.getLength() : 0;

            if (iLength > 0 && typeof oBinding.getContexts === "function") {
                aContexts = oBinding.getContexts(0, iLength);
            }

            if ((!aContexts || !aContexts.length) && typeof oBinding.getCurrentContexts === "function") {
                aContexts = oBinding.getCurrentContexts();
            }

            fTotal = (aContexts || []).reduce(function (fSum, oContext) {
                var vValor = oContext.getProperty("ValorPedido");
                var fValor = Number(vValor);

                if (!isFinite(fValor) && typeof vValor === "string") {
                    var sSanitized = vValor.replace(/\./g, "").replace(",", ".");
                    fValor = Number(sSanitized);
                }

                return isFinite(fValor) ? fSum + fValor : fSum;
            }, 0);

            var sFormattedTotal = this.formatter.formatCurrency(fTotal);

            if (!sFormattedTotal) {
                sFormattedTotal = this.formatter.formatCurrency(0);
            }

            oTotalText.setText("Total: " + sFormattedTotal);
        },
        onHelloWorldButtonPress: function(){
            alert("Hello World !!!");
        }
    });
});
