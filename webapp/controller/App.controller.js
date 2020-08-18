sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("SE.SMT_Employee.controller.App", {
		onInit: function () {

		},
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},

		onPress: function (oEvent) {
			debugger;
			var oButton = oEvent.getSource();

			if (!this._oPopover) {
				Fragment.load({

					name: "SE.SMT_Employee.Fragment.notifyPop",
					controller: this
				}).then(function (oPopover) {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);

					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}

		}

	});
});