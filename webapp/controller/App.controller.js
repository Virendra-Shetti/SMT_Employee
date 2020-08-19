sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("SE.SMT_Employee.controller.App", {
		onInit: function () {
			var oModel = new sap.ui.model.json.JSONModel();
			this.getOwnerComponent().setModel(oModel, "newsData");
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

		},
		_onAddFrag: function () {
			if (!this.onAddFrag) {
				var oId = this.createId("newsid");
				this.onAddFrag = new sap.ui.xmlfragment(oId, "SE.SMT_Employee.Fragment.newsfeed", this);
				this.getView().addDependent(this.onAddFrag);

			}
			return this.onAddFrag;
		},
		onAdd: function () {
			debugger;
			this._onAddFrag().open();
		},
		onCancel: function () {
			this._onAddFrag().close();
		},
		arr: [],
		onPost: function () {
			debugger;

			var oFragId = this.createId("newsid");

			var activityId = sap.ui.core.Fragment.byId(oFragId, "id").getValue();
			var activityName = sap.ui.core.Fragment.byId(oFragId, "name").getValue();
			var newsDescription = sap.ui.core.Fragment.byId(oFragId, "desc").getValue();
			var startDate = sap.ui.core.Fragment.byId(oFragId, "startdate").getValue();
			var endDate = sap.ui.core.Fragment.byId(oFragId, "enddate").getValue();
			var time = sap.ui.core.Fragment.byId(oFragId, "time").getValue();

			if (activityId === "" && activityName === "" && newsDescription === "" && startDate === "" && endDate === "" && time === "") {

				sap.m.MessageToast.show("Please fill the blank");
			} else {
				var obj = {
					Id: activityId,
					Name: activityName,
					News: newsDescription,
					sDate: startDate,
					eDate: endDate,
					Time: time
				};
				this.arr.push(obj);
				this.getOwnerComponent().getModel("newsData").setProperty("/data", this.arr);

				sap.ui.core.Fragment.byId(oFragId, "id").setValue("");
				sap.ui.core.Fragment.byId(oFragId, "name").setValue("");
				sap.ui.core.Fragment.byId(oFragId, "desc").setValue("");
				sap.ui.core.Fragment.byId(oFragId, "startdate").setValue("");
				sap.ui.core.Fragment().byId(oFragId, "enddate").setValue("");
				sap.ui.core.Fragment().byId(oFragId, "time").setValue("");
			}
		},
		onItemClose: function (oEvent) {
			var oItem = oEvent.getSource(),
				oList = oItem.getParent();

			oList.removeItem(oItem);
			sap.m.MessageToast.show("Item Closed: " + oItem.getTitle());
		}

	});
});