sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "../model/formatter"
], function (Controller, UIComponent, formatter) {
    "use strict";

    return Controller.extend("zped.controller.View1", {
        formatter: formatter,
        onInit: function () {
        },
        onAfterRendering: function () {
            this._attachPedidoTableUpdates();
            this._updateValorPedidoTotal();
        },
        _attachPedidoTableUpdates: function () {
            var oTable = this.byId("idPedidoTable");

            if (!oTable || typeof oTable.attachUpdateFinished !== "function") {
                return;
            }

            if (this._fnPedidoUpdateFinishedHandler && typeof oTable.detachUpdateFinished === "function") {
                oTable.detachUpdateFinished(this._fnPedidoUpdateFinishedHandler);
            }

            this._fnPedidoUpdateFinishedHandler = function () {
                this._updateValorPedidoTotal();
            }.bind(this);

            oTable.attachUpdateFinished(this._fnPedidoUpdateFinishedHandler);
        },
        _updateValorPedidoTotal: function () {
            var oTable = this.byId("idPedidoTable");
            var oTotalText = this.byId("idValorPedidoTotalText");

            if (!oTable || !oTotalText) {
                return;
            }

            var oBinding = oTable.getBinding("items");
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
        onPedidoLinkPress: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource && oSource.getBindingContext();

            if (!oContext && oSource && typeof oSource.getParent === "function") {
                var oParent = oSource.getParent();

                if (oParent && typeof oParent.getBindingContext === "function") {
                    oContext = oParent.getBindingContext();
                }
            }

            if (!oContext) {
                return;
            }

            this._navToPedidoDetalhe(oContext);
        },
        onPedidoItemPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem");
            var oContext = oItem && typeof oItem.getBindingContext === "function" ? oItem.getBindingContext() : null;
            this._navToPedidoDetalhe(oContext);
        },
        _navToPedidoDetalhe: function (oContext) {
            if (!oContext) {
                return;
            }

            var sNumeroPedido = oContext.getProperty("NumeroPedido");

            if (!sNumeroPedido) {
                return;
            }

            var oRouter = UIComponent.getRouterFor(this);

            if (!oRouter) {
                return;
            }

            oRouter.navTo("PedidoDetalhe", {
                NumeroPedido: encodeURIComponent(String(sNumeroPedido).trim())
            });
        },
        onHelloWorldButtonPress: function(){
            alert("Hello World !!!");
        }
    });
});
