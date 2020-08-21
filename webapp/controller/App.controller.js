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
	handleChange: function () {
			debugger;
					var oFragId = this.createId("newsid");
			var currentDate = new Date();
			// this.getView().byId("datePick").getValue();
		sap.ui.core.Fragment.byId(oFragId, "datePick").setMinDate(currentDate);

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
		// onCancel: function () {
		// 	this._onAddFrag().close();
		// },
		arr: [],
		onPost: function () {
			debugger;

			var oFragId = this.createId("newsid");

			var activityName = sap.ui.core.Fragment.byId(oFragId, "name").getValue();
			var newsDescription = sap.ui.core.Fragment.byId(oFragId, "desc").getValue();
			var startDate = sap.ui.core.Fragment.byId(oFragId, "datePick").getValue();

			var time = sap.ui.core.Fragment.byId(oFragId, "time").getValue();

			if (activityName === "" && newsDescription === "" && startDate === "" && time === "") {

				sap.m.MessageToast.show("Please fill the blank");
			} else {
				var obj = {

					Name: activityName,
					News: newsDescription,
					sDate: startDate,

					Time: time
				};
				var oNewsModel = this.getOwnerComponent().getModel("newsData").getProperty("/data");
				oNewsModel.push(obj);
				this.getOwnerComponent().getModel("newsData").setProperty("/data", oNewsModel);

				sap.ui.core.Fragment.byId(oFragId, "name").setValue("");
				sap.ui.core.Fragment.byId(oFragId, "desc").setValue("");
				sap.ui.core.Fragment.byId(oFragId, "datePick").setValue("");

				sap.ui.core.Fragment.byId(oFragId, "time").setValue("");
					this._onAddFrag().close();
			}
		},
		onItemClose: function (oEvent) {
			var oItem = oEvent.getSource(),
				oList = oItem.getParent();

			oList.removeItem(oItem);
			// sap.m.MessageToast.show("Item closed: " + oItem.getTitle());
		},
		onItemNotifyClose: function (oEvent) {
			var oItem = oEvent.getSource(),
				oList = oItem.getParent();

			oList.removeItem(oItem);
			// sap.m.MessageToast.show("Item closed ");
		}

	});
});