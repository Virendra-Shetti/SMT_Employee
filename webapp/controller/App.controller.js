sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("SE.SMT_Employee.controller.App", {
		onInit: function () {
			this._showFormFragment("Display");
			this._showFormFragment("Display2");

			var birthDate = new Date("01/25/1990");
			this.getOwnerComponent().getModel("localModel").setProperty("/EmpDetail/0/DOB", birthDate);
			this._formFragments["Display"].bindElement("localModel>/EmpDetail/0");

		},
		onExit: function () {

			// for (const x in this._formFragments) {
			// 	this._formFragments[x].destroy();
			// }

			this.__proto__._formFragments = {};
			if (document.getElementById("show_profile_pic")) {
				document.getElementById("show_profile_pic").remove();
				document.getElementById("profile_snap").remove();
				document.getElementById("imgupload").remove();
			}

			if (document.getElementById("camera_play")) {
				document.getElementById("camera_play").remove();
			}
		},
		onAfterRendering: function () {

			// $(".about_object_page_sub .work_frag").hide();
			// $("#about_object_page_sub #work_frag").hide();
			// $("#work_object_page_sub .about_frag").hide();

		},

		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
		},

		handleChange: function () {

			var oFragId = this.createId("newsid");
			var currentDate = new Date();
			// this.getView().byId("datePick").getValue();
			sap.ui.core.Fragment.byId(oFragId, "datePick").setMinDate(currentDate);
		},
		loadCanvas: function () {
			var oLocalModel = this.getOwnerComponent().getModel("localModel");
			var imgSrc = oLocalModel.getProperty("/galleryPic") || oLocalModel.getProperty("/profilePic") || oLocalModel.getProperty(
				"/addProfilePic");
			// imagVal = `<img src=${imgSrc} >`,
			var imageObj = document.getElementById("show_profile_pic");
			imageObj.src = imgSrc;

			var snapShotCanvas = document.getElementById("profile_snap"),
				oContext = snapShotCanvas.getContext("2d");
			oContext.drawImage(imageObj, 0, 0, snapShotCanvas.width, snapShotCanvas.height);
			$('#show_profile_pic').hide();
		},
		onChangeProfile: function (oEvent) {

			var that = this,
				oLocalModel = this.getOwnerComponent().getModel("localModel");
			var defalutProfilePic = oLocalModel.getProperty("/addProfilePic");

			oLocalModel.setProperty("/galleryPic", "");
			if (!this.fixedDialog) {
				this.fixedDialog = new sap.m.Dialog({
					title: "Change Profile",
					titleAlignment: "Center",
					contentWidth: "47%",
					contentHeight: "77%",
					resizable: true,
					buttons: [
						new sap.m.Button({
							text: "{i18n>back}",
							visible: false,
							press: function () {

								//keep it in other function (take picture also)

								that._setImage();

								that.fixedDialog.getContent()[0].setVisible(false);
								$('#camera_play').hide();

								that.fixedDialog.getContent()[2].setVisible(true);

								var oButtons = that.fixedDialog.getButtons();
								oButtons[0].setVisible(false);
								oButtons[1].setVisible(false);
								oButtons[2].setVisible(true);
								oButtons[3].setVisible(true);
								oButtons[4].setVisible(true);
								oButtons[5].setVisible(true);

							}
						}),
						new sap.m.Button({
							text: "{i18n>takePic}",
							visible: false,
							press: function () {

								//		that._setImage();
								// var oVbox = that.fixedDialog.getContent()[1],
								// items = oVbox.getItems(),
								//	// snapID = "pic" + items.length,
								// imagVal = document.getElementById("camera_play"),
								// oCanvas = new sap.ui.core.HTML({
								// 	content: "<canvas id='profile_snap' width='320px' height='320px' style='2px solid red'/> "
								// });
								// oVbox.addItem(oCanvas);
								// oVbox.addStyleClass("sapUiLargeMarginTop");

								// oCanvas.addEventDelegate({
								// 	onAfterRendering: function () {
								// 		var snapShotCanvas = document.getElementById("profile_snap"),
								// 			oContext = snapShotCanvas.getContext("2d");
								// 		oContext.drawImage(imagVal, 0, 0, snapShotCanvas.width, snapShotCanvas.height);

								// 		$('#camera_play').hide();
								// 		var oButtons = that.fixedDialog.getButtons();
								// 		oButtons[0].setVisible(false);
								// 		oButtons[1].setVisible(true);
								// 		oButtons[2].setVisible(true);

								// 		//		that._setImage();

								// 	}
								// });
								oLocalModel.setProperty("/galleryPic", " ");

								var imagVal = document.getElementById("camera_play");

								var snapShotCanvas = document.getElementById("profile_snap"),
									oContext = snapShotCanvas.getContext("2d");
								oContext.drawImage(imagVal, 0, 0, snapShotCanvas.width, snapShotCanvas.height);

								//keep it in other function (back also)
								//	that._setImage();
								that.fixedDialog.getContent()[0].setVisible(false);

								that.fixedDialog.getContent()[2].setVisible(true);

								var oButtons = that.fixedDialog.getButtons();
								oButtons[0].setVisible(false);
								oButtons[1].setVisible(false);
								oButtons[2].setVisible(true);
								oButtons[3].setVisible(true);
								oButtons[4].setVisible(true);
								oButtons[5].setVisible(true);

							}
						}), new sap.m.Button({
							text: "{i18n>removePhoto}",
							visible: true,
							press: function () {

								oLocalModel.setProperty("/profilePic", "");
								oLocalModel.setProperty("/galleryPic", "");
								that.fixedDialog.close();
							}
						}),
						new sap.m.Button({
							text: "{i18n>Camera}",
							visible: true,
							press: function () {
								//	that._setImage();
								//	that.onChangeProfile();
								that.fixedDialog.getContent()[0].setVisible(true);
								$('#camera_play').show();

								that.fixedDialog.getContent()[2].setVisible(false);

								var oButtons = that.fixedDialog.getButtons();
								oButtons[0].setVisible(true);
								oButtons[1].setVisible(true);
								oButtons[2].setVisible(false);
								oButtons[3].setVisible(false);
								oButtons[4].setVisible(false);
								oButtons[5].setVisible(false);

								//To Start the Camera streaming
								var handleSuccess = function (stream) {
									camera_play.srcObject = stream;
								};
								navigator.mediaDevices.getUserMedia({
									video: true
								}).then(handleSuccess);
							}
						}),
						new sap.m.Button({
							text: "{i18n>gallery}",
							visible: true,
							press: function () {

								$('#imgupload').trigger('click');

								$('#imgupload').on('input', function () {

									var oPromise = new Promise(function (resolve) {
										var $i = $('#imgupload'), // Put file input ID here
											input = $i[0], // Getting the element from jQuery

											file = input.files[0], // The file
											fr = new FileReader(); // FileReader instance
										fr.onload = function () {
											// Do stuff on onload, use fr.result for contents of file
											//	$('#file-content').append($('<div/>').html(fr.result))
											resolve(fr);

										};
										//fr.readAsText( file );
										fr.readAsDataURL(file);
									});

									oPromise.then(function (fr) {

										oLocalModel.setProperty("/galleryPic", fr.result);
										that.loadCanvas();
									});

								});
								// that._setImage();
								// that.onChangeProfile();
							}
						}),
						new sap.m.Button({
							text: "{i18n>Upload}",
							visible: true,
							press: function () {

								var profilePic = document.getElementById("profile_snap").toDataURL();
								oLocalModel.setProperty("/profilePic", profilePic);
								oLocalModel.setProperty("/galleryPic", "");
								that.fixedDialog.close();
							}
						}),

						new sap.m.Button({
							text: "{i18n>Cancel}",
							press: function () {
								that.fixedDialog.close();
							}
						})

					],
					content: [new sap.ui.core.HTML({
							visible: false,
							content: "<video id='camera_play' autoplay />"
						}),
						new sap.ui.core.HTML({
							visible: true,
							content: `<img id='show_profile_pic' src='${defalutProfilePic}' >`
						}),
						new sap.m.VBox({
							visible: true,
							alignItems: "Center",
							items: new sap.ui.core.HTML({
								content: "<canvas id='profile_snap' width='320px' height='320px' style='2px solid red'/> "
							}).addEventDelegate({
								onAfterRendering: function () {

									var onCamera = document.getElementById("camera_play");
									if (onCamera) {
										if (onCamera.style.display !== "none") {
											$('#camera_play').hide();
											that._setImage();
											return;
										}

									}
									that.loadCanvas();
									// $('#camera_play').hide();
									// var oButtons = that.fixedDialog.getButtons();
									// oButtons[0].setVisible(false);
									// oButtons[1].setVisible(true);
									// oButtons[2].setVisible(true);

								}
							})
						}).addStyleClass("sapUiLargeMarginTop"),

						new sap.ui.core.HTML({
							content: "<input type='file' id='imgupload' style='display:none'/> "
						})

					]

				});
				this.getView().addDependent(this.fixedDialog);
				//	this.fixedDialog.attachBeforeClose(this._setImage, this);
				//	this.fixedDialog.attachAfterOpen(this.loadCanvas(), this);
			}

			this.fixedDialog.open();

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

			// $('#camera_play').show();
			// this.fixedDialog.getContent()[1].removeAllItems();
			// this.fixedDialog.getContent()[1].removeStyleClass("sapUiLargeMarginTop");

			// var oButtons = this.fixedDialog.getButtons();
			// oButtons[0].setVisible(true);
			// oButtons[1].setVisible(false);
			// oButtons[2].setVisible(false);

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

			var oState = oEvent.getParameter("state");

			// Set the right form type
			// this._showFormFragment(!oState ? "Change" : "Display");
			// this._showFormFragment(!oState ? "Change2" : "Display2");

			//Binding change form

			if (oState) {
				var oLocalModel = this.getOwnerComponent().getModel("localModel"),
					empPayload = oLocalModel.getProperty("/EmpDetail/0"),
					// that = this,
					oFormContent = this._formFragments["Change"].getContent(),
					oVboxItems = oFormContent[11].getItems(),
					oName = oFormContent[2],
					oMob = oFormContent[4],
					oEmailId = oFormContent[6],
					oDob = oFormContent[8],
					oAddress1 = oVboxItems[0],
					oAddress2 = oVboxItems[1],
					oPin = oFormContent[13],
					oAdhar = oFormContent[15],
					oPan = oFormContent[17],

					nameRegx = /^[A-Za-z]+$/g,
					phoneRegx = /[6-9]{1}\d{9}/g,
					emailRegx = /\w+\@\w+\.(com|in|org|net)$/g,
					numberRegx = /^\d+$/,

					_forConditionTrue = function () {
						oName.setValueState("None");
						oMob.setValueState("None");
						oEmailId.setValueState("None");
						oDob.setValueState("None");
						oAddress1.setValueState("None");
						oAddress2.setValueState("None");
						oPin.setValueState("None");
						oAdhar.setValueState("None");
						oPan.setValueState("None");
					};

				//set the date picker for DOB
				if (!this.setDatePicker) {
					this.setDatePicker = 1;
					var curDate = new Date(),
						yMin = curDate.getFullYear() - 70,
						yMax = curDate.getFullYear() - 18;

					var maxDate = new Date(yMax, 11, 31),
						minDate = new Date(yMin, 0, 1);

					oDob.setMaxDate(maxDate);
					oDob.setMinDate(minDate);
				}

				if (!empPayload.empName) {
					_forConditionTrue();
					oName.setValueState("Error").focus();
					oName.setValueStateText("Enter Name");
					oLocalModel.setProperty("/switchState", false);
				} else if (!nameRegx.test(empPayload.empName)) {
					_forConditionTrue();
					oName.setValueState("Error").focus();
					oName.setValueStateText("Invalid Name");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.mob) {
					_forConditionTrue();
					oMob.setValueState("Error").focus();
					oMob.setValueStateText("Enter Phone Number");
					oLocalModel.setProperty("/switchState", false);
				} else if (!phoneRegx.test(empPayload.mob)) {
					_forConditionTrue();
					oMob.setValueState("Error").focus();
					oMob.setValueStateText("Contact Number Should Start With Either 6 or 7 or 8 or 9");
					oLocalModel.setProperty("/switchState", false);
				} else if (empPayload.mob.length < 10) {
					_forConditionTrue();
					oMob.setValueState("Error").focus();
					oMob.setValueStateText("Please Insert 10 Digit Mobile Number");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.mailId) {
					_forConditionTrue();
					oEmailId.setValueState("Error").focus();
					oEmailId.setValueStateText("Enter Email ID");
					oLocalModel.setProperty("/switchState", false);
				} else if (!emailRegx.test(empPayload.mailId)) {
					_forConditionTrue();
					oEmailId.setValueState("Error").focus();
					oEmailId.setValueStateText("Invalid Email ID");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.DOB) {
					_forConditionTrue();
					oDob.setValueState("Error").focus();
					oDob.setValueStateText("Enter Birth Date");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.DOB) {
					_forConditionTrue();
					oDob.setValueState("Error").focus();
					oDob.setValueStateText("Enter Birth Date");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.Address1) {
					_forConditionTrue();
					oAddress1.setValueState("Error").focus();
					oAddress1.setValueStateText("Enter Address");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.Address2) {
					_forConditionTrue();
					oAddress2.setValueState("Error").focus();
					oAddress2.setValueStateText("Enter Address");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.pinCode) {
					_forConditionTrue();
					oPin.setValueState("Error").focus();
					oPin.setValueStateText("Enter Pin Code");
					oLocalModel.setProperty("/switchState", false);
				} else if (!numberRegx.test(empPayload.pinCode)) {
					_forConditionTrue();
					oPin.setValueState("Error").focus();
					oPin.setValueStateText("Invalid Pin Code");
					oLocalModel.setProperty("/switchState", false);
				} else if (empPayload.pinCode.length < 6) {
					_forConditionTrue();
					oPin.setValueState("Error").focus();
					oPin.setValueStateText("Enter 6 Digit Pin Code");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.adhar) {
					_forConditionTrue();
					oAdhar.setValueState("Error").focus();
					oAdhar.setValueStateText("Enter Adhar Number");
					oLocalModel.setProperty("/switchState", false);
				} else if (empPayload.adhar.length < 12) {
					_forConditionTrue();

					oAdhar.setValueState("Error").focus();
					oAdhar.setValueStateText("Enter 12 Digit Adhar Number");
					oLocalModel.setProperty("/switchState", false);
				} else if (!numberRegx.test(empPayload.adhar)) {
					_forConditionTrue();
					oAdhar.setValueState("Error").focus();
					oAdhar.setValueStateText("Invalid Adhar Number");
					oLocalModel.setProperty("/switchState", false);
				} else if (!empPayload.pan) {
					_forConditionTrue();
					oPan.setValueState("Error").focus();
					oPan.setValueStateText("Enter  PAN Number");
					oLocalModel.setProperty("/switchState", false);
				} else if (empPayload.pan.length < 8) {
					_forConditionTrue();
					oPan.setValueState("Error").focus();
					oPan.setValueStateText("Enter 8 Digit PAN Number");
					oLocalModel.setProperty("/switchState", false);
				} else {
					_forConditionTrue();

					this._showFormFragment("Display");
					this._showFormFragment("Display2");

				}

			} else {
				this._showFormFragment("Change");
				this._showFormFragment("Change2");
				this._formFragments["Change"].bindElement("localModel>/EmpDetail/0");
			}

		},
		onPress: function (oEvent) {

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

			this._onAddFrag().open();
		},
		// onCancel: function () {
		// 	this._onAddFrag().close();
		// },
		arr: [],
		onPost: function () {

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