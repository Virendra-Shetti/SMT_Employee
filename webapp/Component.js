sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"SE/SMT_Employee/model/models",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function (UIComponent, Device, models, MessageToast, Fragment) {
	"use strict";

	return UIComponent.extend("SE.SMT_Employee.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!

			/**
			 * Add item to the header
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.addHeaderEndItem({
					icon: "sap-icon://bell",
					tooltip: "Notification",
					press: function (oEvent) {
						MessageToast.show("Hi chaitali");
					
					}
				}, true, true);
			});
			// rendererPromise.then(function (oRenderer) {

			// 	oRenderer.setHeaderTitle("Signiwis Employee Tool");
			// });
			// .........................................................................................................
			// /**
			//  * Add two buttons to the options bar (previous called action menu) in the Me Area.
			//  * The first button is only visible if the Home page of SAP Fiori launchpad is open.
			//  */
			// rendererPromise.then(function (oRenderer) {
			// 	oRenderer.addActionButton("sap.m.Button", {
			// 		id: "myHomeButton",
			// 		icon: "sap-icon://sys-help-2",
			// 		text: "Help for FLP page",
			// 		press: function () {
			// 			MessageToast.show("You pressed the button that opens a help page.");
			// 		}
			// 	}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.Home]);

			// 	/*
			// 	 * The second button is only visible when an app is open.
			// 	 */
			// 	oRenderer.addActionButton("sap.m.Button", {
			// 		id: "myAppButton",
			// 		icon: "sap-icon://sys-help",
			// 		text: "Help for App page",
			// 		press: function () {
			// 			MessageToast.show("You pressed the button that opens a help for apps page.");
			// 		}
			// 	}, true, false, [sap.ushell.renderers.fiori2.RendererExtensions.LaunchpadState.App]);
			// });
			// ...........................................................................................................			

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},

		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});