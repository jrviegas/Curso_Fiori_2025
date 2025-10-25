sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "../model/formatter"
], function (Controller, History, formatter) {
    "use strict";

    return Controller.extend("zped.controller.PedidoDetalhe", {
        formatter: formatter,
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();

            oRouter.getRoute("PedidoDetalhe").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            var sNumeroPedido = oEvent.getParameter("arguments").NumeroPedido;

            if (!sNumeroPedido) {
                this.getView().unbindElement();
                this.getView().setBusy(false);
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var sKey = oModel.createKey("PedidoSet", {
                NumeroPedido: sNumeroPedido
            });

            if (!sKey) {
                this.getView().setBusy(false);
                return;
            }

            this.getView().setBusy(true);
            this.getView().bindElement({
                path: "/" + sKey,
                parameters: {
                    expand: "PedidoItemSet"
                },
                events: {
                    dataRequested: function () {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
            }
        }
    });
});
