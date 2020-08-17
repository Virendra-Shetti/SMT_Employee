/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"SE/SMT_Employee/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});