sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("SE.SMT_Employee.controller.App", {
		onInit: function () {

			this._showFormFragment("Display");
			this._showFormFragment("Display2");
		},
		onAfterRendering: function () {
			// $(".about_object_page_sub .work_frag").hide();
			// $("#about_object_page_sub #work_frag").hide();
			// $("#work_object_page_sub .about_frag").hide();

			var oModel = new sap.ui.model.json.JSONModel();
			this.getOwnerComponent().setModel(oModel, "newsData");

		},
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},
		onChangeProfile: function () {
			debugger;
			var that = this;
			if (!this.fixedDialog) {
				this.fixedDialog = new sap.m.Dialog({
					title: "Change Profile",
					titleAlignment: "Center",
					contentWidth: "47%",
					contentHeight: "77%",
					resizable: true,
					buttons: [new sap.m.Button({
							text: "Take Capture",
							press: function () {
								debugger;

								//		that._setImage();
								var oVbox = that.fixedDialog.getContent()[1],
									items = oVbox.getItems(),
									// snapID = "pic" + items.length,
									imagVal = document.getElementById("camera_play"),
									oCanvas = new sap.ui.core.HTML({
										content: "<canvas id='profile_snap' width='320px' height='320px' style='2px solid red'/> "
									});
								oVbox.addItem(oCanvas);
								oVbox.addStyleClass("sapUiLargeMarginTop");

								oCanvas.addEventDelegate({
									onAfterRendering: function () {
										var snapShotCanvas = document.getElementById("profile_snap"),
											oContext = snapShotCanvas.getContext("2d");
										oContext.drawImage(imagVal, 0, 0, snapShotCanvas.width, snapShotCanvas.height);

										debugger;
										$('#camera_play').hide();
										var oButtons = that.fixedDialog.getButtons();
										oButtons[0].setVisible(false);
										oButtons[1].setVisible(true);
										oButtons[2].setVisible(true);

										//		that._setImage();

									}
								});

							}
						}), new sap.m.Button({
							text: "Camera",
							visible: false,
							press: function () {
								that._setImage();
								that.onChangeProfile();
							}
						}),
						new sap.m.Button({
							text: "Upload",
							visible: false,
							press: function () {
								debugger;
								var profilePic = document.getElementById("profile_snap").toDataURL();
								that.getOwnerComponent().getModel("localModel").setProperty("/profilePic", profilePic);
								that.fixedDialog.close();
							}
						}),
						new sap.m.Button({
							text: "Cancel",
							press: function () {
								that.fixedDialog.close();
							}
						})
					],
					content: [new sap.ui.core.HTML({
							content: "<video id='camera_play' autoplay />"
						}),
						new sap.m.VBox({

							alignItems: "Center"
						})
					],

				});
				this.getView().addDependent(this.fixedDialog);
				this.fixedDialog.attachBeforeClose(this._setImage, this);
				this.fixedDialog.attachAfterOpen(this._onIntialdialogSetUp, this);
			}

			this.fixedDialog.open();

			//To Start the Camera streaming
			var handleSuccess = function (stream) {
				camera_play.srcObject = stream;
			};
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(handleSuccess);

		},
		_setImage: function () {
			//	$('#camera_play').show();
			// To stop the camera streaming
			var stream = camera_play.srcObject;
			var tracks = stream.getTracks();

			tracks.forEach(function (track) {
				track.stop();
			});
			camera_play.srcObject = null;

			$('#camera_play').show();
			this.fixedDialog.getContent()[1].removeAllItems();
			this.fixedDialog.getContent()[1].removeStyleClass("sapUiLargeMarginTop");

			var oButtons = this.fixedDialog.getButtons();
			oButtons[0].setVisible(true);
			oButtons[1].setVisible(false);
			oButtons[2].setVisible(false);

		},
		_formFragments: {},
		_showFormFragment: function (sFragmentName) {
			var oAboutSubPage = this.byId("about_object_page_sub"),
				// oFormFragmentAbout = this._formFragments["about" + sFragmentName],
				oWorkSubPage = this.byId("work_object_page_sub"),
				// oFormFragment = this._formFragments["work" + sFragmentName];
				oFormFragment = this._formFragments[sFragmentName];
			if (!oFormFragment) {
				// oFormFragmentAbout = sap.ui.xmlfragment(this.createId("about" + sFragmentName), "SE.SMT_Employee.Fragment." + sFragmentName);
				// oFormFragment = sap.ui.xmlfragment(this.createId("work" + sFragmentName), "SE.SMT_Employee.Fragment." + sFragmentName);
				oFormFragment = sap.ui.xmlfragment(this.createId(sFragmentName), "SE.SMT_Employee.Fragment." + sFragmentName);
				// this._formFragments["about" + sFragmentName] = oFormFragmentAbout;
				// this._formFragments["work" + sFragmentName] = oFormFragment;
				this._formFragments[sFragmentName] = oFormFragment;
			}
			debugger

			if ((sFragmentName === "Change") || (sFragmentName === "Display")) {
				oAboutSubPage.removeAllBlocks();
				oAboutSubPage.addBlock(oFormFragment);
			} else {
				oWorkSubPage.removeAllBlocks();
				oWorkSubPage.addBlock(oFormFragment);

			}

			// oWorkForm = sap.ui.core.Fragment.byId(this.createId("Display"), "about_display_frag");
			// oWorkForm.setVisible(false);

		},
		editOrSave: function (oEvent) {
			debugger;
			var oState = oEvent.getParameter("state");

			// Set the right form type
			this._showFormFragment(!oState ? "Change" : "Display");
			this._showFormFragment(!oState ? "Change2" : "Display2");
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
			sap.m.MessageToast.show("Item close: " + oItem.getTitle());
		}

	});
});