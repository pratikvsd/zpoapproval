sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	'sap/m/MessageToast',
	'sap/m/UploadCollectionParameter',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/ui/core/Fragment',
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, MessageToast, UploadCollectionParameter, Dialog, Button, Fragment, History) {
	"use strict";

	return Controller.extend("POApproval.ZPOApproval.controller.POApprovalDetail", {

		//initialize Model
		onInit: function (oEvent) {
			//	this._UserID = sap.ushell.Container.getService("UserInfo").getId();
			this._UserID = "PURCHASE1";
			//	this._UserID = "COCKPIT1_1";

			var that = this;

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("POApprovalDetail").attachPatternMatched(this._onEditMatched, this);

			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);

			if (this._UserID !== null) {
				that.getUserDeptByUserID(this._UserID);
			}

		},

		getMyPOList: function () {

			var oModel = this.getView().getModel();
			var oList1 = sap.ui.getCore().byId("__xmlview1--listPO");
			var oList2 = sap.ui.getCore().byId("__xmlview0--listPO");
			var oApproveButton = this.getView().byId("btnApprove");
			var oApproveReject = this.getView().byId("btnReject");
			var filters = [];

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			var oPOstatus = this.getView().byId("objcmp");
			filters.push(oUserID);

			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {

					oPOstatus.setText(oResponse.data.PO_Status);
					if (oPOstatus.getText() == "In Query") {
						oApproveButton.setEnabled(false);
						oApproveReject.setEnabled(false);
					} else if (oPOstatus.getText() == "In Approval") {
						oApproveButton.setEnabled(true);
						oApproveReject.setEnabled(true);
					}

					/*oPOstatus.setText(oResponse.data.PO_Status);
					if (oPOstatus.getText() == "In Query") {
						oApproveButton.setEnabled(false);
						oApproveReject.setEnabled(false);
					} else if (oPOstatus.getText() == "In Approval") {
						oApproveButton.setEnabled(true);
						oApproveReject.setEnabled(true);
					}*/

					//oUser_dept.setText(odata.results[0].User_Dept);

				},
				error: function () {
					//	MessageBox.error("error");
				}

			});

		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		RefreshMasterList: function () {
			debugger;
			var that = this;
			var oModel = this.getView().getModel();

			var oList1 = sap.ui.getCore().byId("__xmlview1--listPO");
			var oList2 = sap.ui.getCore().byId("__xmlview0--listPO");
		
			var filters = [];

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			filters.push(oUserID);
			var oModelData = new sap.ui.model.json.JSONModel();
			var POCoverNote = this.getView().byId("idFrame");
			var POQueryHistory = this.getView().byId("tblQueryHistory");
			var POQueryComments = this.getView().byId("tblComments");

			var oQueryButton = this.getView().byId("btnQuery");
			var oReviewButton = this.getView().byId("btnReview");
			var oApproveButton = this.getView().byId("btnApprove");
			var oApproveReject = this.getView().byId("btnReject");

			var Pocount;
			var txtPONOOB = this.getView().byId("objcmp");
			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {
					Pocount = odata.results.length;
					if (oList1 !== undefined) {
						if (Pocount > 0) {
							oModelData.setData(odata);
							oList1.setModel(oModelData);

						} else {
							oModelData.setData(odata);
							oList1.setModel(oModelData);
							txtPONOOB.setTitle("");
							
							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							oQueryButton.setEnabled(false);
							oReviewButton.setEnabled(false);
							oApproveButton.setEnabled(false);
							oApproveReject.setEnabled(false);

						}
					} else if (oList2 !== undefined) {
						if (Pocount > 0) {
							oModelData.setData(odata);
							oList2.setModel(oModelData);

						} else {

							oModelData.setData(odata);
							oList2.setModel(oModelData);
							txtPONOOB.setTitle("");

							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							oQueryButton.setEnabled(false);
							oReviewButton.setEnabled(false);
							oApproveButton.setEnabled(false);
							oApproveReject.setEnabled(false);

						}
					}

				},
				error: function () {
					//	MessageBox.error("error");
				},

			});

		},

		handleNavButtonPress: function (oEvent) {

			this.getRouter().navTo("FirstPage", {}, true);
		},

		_onEditMatched: function (oEvent) {

			var oParameters = oEvent.getParameters();

			//var oModel1 = this.getView().getModel();
			var oHtml = this.getView().byId("idFrame");
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			var that = this;

			var txtPONOOB = this.getView().byId("objcmp");
			var txtPO_StatusObject = this.getView().byId("objPrice");

			var oApproveButton = this.getView().byId("btnApprove");
			var oApproveReject = this.getView().byId("btnReject");

			if (oParameters.arguments.PO_No !== "" || oParameters.arguments.PO_No !== null) {

				this.PO_No = oParameters.arguments.PO_No;
				this.ListId = oParameters.arguments.oViewID;
				txtPONOOB.setTitle(this.PO_No);

				var oList1 = sap.ui.getCore().byId("__xmlview1--listPO");
				var oList2 = sap.ui.getCore().byId("__xmlview0--listPO");

				var sRead = "/SelectedPOContentSet(PoNo='" + this.PO_No + "')/$value";

				that.getMyPOList();

				oModel.read(sRead, {
					success: function (oData, oResponse) {

						if (oList1 !== undefined) {
							var aItems1 = oList1.getItems();
							if (aItems1.length <= 0) {
								oModel.setData(null);
							} else {
								var pdfURL = oResponse.requestUri;
								oHtml.setContent("<iframe src=" + pdfURL + " width='100%' height='600px'></iframe>");
							}

						} else if (oList2 !== undefined) {

							var aItems2 = oList2.getItems();
							if (aItems2.length <= 0) {
								oModel.setData(null);
							} else {
								var pdfURL = oResponse.requestUri;
								oHtml.setContent("<iframe src=" + pdfURL + " width='100%' height='600px'></iframe>");
							}
						}

					},
					error: function () {
						//	MessageBox.error("Cover Note Read Failed");
					}
				});

				oModel.read("/PurchaseOrderGeneralSet('" + this.PO_No + "')", {
					success: function (odata, oResponse) {

						txtPO_StatusObject.setText(oResponse.data.PO_Status);

						if (txtPO_StatusObject.getText() === "In Query") {
							oApproveButton.setEnabled(false);
							oApproveReject.setEnabled(false);
						} else if (txtPO_StatusObject.getText() === "In Approval") {
							oApproveButton.setEnabled(true);
							oApproveReject.setEnabled(true);
						}
					},

					error: function (e) {
						//	MessageBox.error("error");
					}

				});

			}

		},

		RefreshCommentTable: function () {
			var oModel = this.getView().getModel();
			var PO = this.getView().byId("objcmp").getTitle();

			var oTable = this.getView().byId("tblComments");
			var filters = [];

			var oPO = new sap.ui.model.Filter("PO", "EQ", PO);
			filters.push(oPO);

			oModel.read("/POCommentsSet", {
				filters: filters,
				success: function (odata, oResponse) {

					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oTable.setModel(oModelData);

				},
				error: function () {
					//	MessageBox.error("error");
				}
			});
		},
		RefreshQueryHistoryTable: function () {

			var oModel = this.getView().getModel();
			var POHistory = this.getView().byId("objcmp").getTitle();
			var oTableHistory = this.getView().byId("tblQueryHistory");
			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", POHistory);
			filters.push(oPOH);

			oModel.read("/POQueryHistorySet", {

				filters: filters,
				success: function (odata, oResponse) {

					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oTableHistory.setModel(oModelData);

				},
				error: function () {
					//	MessageBox.error("error");
				}
			});
		},

		//Upload Attachments
		onUploadComplete: function (oEvent) {
			var oData = this.getView().byId("UploadCollection").getModel("oModelAttachment").getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem = {};
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			oItem = {
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": sUploadedFile,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",

			};

			aItems.unshift(oItem);
			this.getView().byId("UploadCollection").getModel("oModelAttachment").setData({
				"items": aItems
			});
			// Sets the text to the label
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			// delay the success message for to notice onChange message
			setTimeout(function () {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},

		// Before Upload Attachments
		onBeforeUploadStarts: function (oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts event triggered.");
		},

		onUploadTerminated: function (oEvent) {
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},

		//Delete Attachment
		onFileDeleted: function (oEvent) {
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},

		deleteItemById: function (sItemToDeleteId) {
			var oData = this.getView().byId("UploadCollection").getModel("oModelAttachment").getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				};
			});
			this.getView().byId("UploadCollection").getModel("oModelAttachment").setData({
				"items": aItems
			});
			this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		getAttachmentTitleText: function () {
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		// Open Query Dialog//

		handleSelectDialogPress: function (oEvent) {
			var oModel = this.getView().getModel();
			var oButton = oEvent.getSource();

			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Query", this);
				this._oDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();

			var cmbUser = sap.ui.getCore().byId("cmbUser");
			var filters = [];

			var oUserName = new sap.ui.model.Filter("Bname", "sap.ui.model.FilterOperator.Contains", this._UserID);
			filters.push(oUserName);

			oModel.read("/UserSearchSet", {
				filters: filters,
				success: function (odata, oResponse) {

					var oModelDataUser = new sap.ui.model.json.JSONModel();
					oModelDataUser.setData(odata);
					cmbUser.setModel(oModelDataUser);
				},
				error: function () {
					MessageBox.error("error");
				},

			});

			var oPONo = this.getView().byId("objcmp").getTitle();
			var Title = "Purchase Order No: " + oPONo + " - Query";

			var oTitle = this._oDialog.setTitle(Title);

		},
		OnCancelQuery: function (oEvent) {
			this._oDialog.close();
			if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = null; // make it falsy so that it can be created next time
			}
		},

		_handleValueHelpUser: function (oEvent) {

			var oModel = this.getView().getModel();
			var oHelpUser = this._valueHelpDialogUser;
			var sInputValueUser = oEvent.getSource().getValue();

			this.inputUserId = oEvent.getSource().getId();
			// create value help dialog
			if (!oHelpUser) {
				oHelpUser = sap.ui.xmlfragment(
					"POApproval.ZPOApproval.fragments.ToUser", //id.fragments.file.name ---take id from manifest.json
					this
				);
				//	var oHelpUser = oHelpUser;
				//	var BName = sap.ushell.Container.getService("UserInfo").getId();
				//	var BName = "PURCHASE1";
				var filters = [];

				var oUserName = new sap.ui.model.Filter("Bname", "EQ", this._UserID);
				filters.push(oUserName);

				oModel.read("/UserSearchSet", {
					filters: filters,
					success: function (odata, oResponse) {

						var oModelDataUser = new sap.ui.model.json.JSONModel();
						oModelDataUser.setData(odata);
						oHelpUser.setModel(oModelDataUser);
					},
					error: function () {
						//	MessageBox.error("error");
					},

				});

				this.getView().addDependent(oHelpUser);

			}

			// create a filter for the binding
			oHelpUser.getBinding("items").filter([new sap.ui.model.Filter(
				"NameFirst",
				sap.ui.model.FilterOperator.Contains, sInputValueUser
			)]);

			// open value help dialog filtered by the input value
			oHelpUser.open(sInputValueUser);
			var oQueryText = sap.ui.getCore().byId("QUserid");
			oQueryText.setValue(null);
			var PQueryComments = sap.ui.getCore().byId("idQuery");
			PQueryComments.setValue(null);
		},
		_handleValueHelpSearchUser: function (evt) {
			var sValueUser = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"NameFirst",
				sap.ui.model.FilterOperator.Contains, sValueUser
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpCloseUser: function (evt) {
			//	var	 inputUserId= oEvent.getSource().getId();
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				//var UserInput = this.getView().byId(this.inputUserId);
				var UserInput = sap.ui.getCore().byId(this.inputUserId);
				UserInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*End Of Query Dialog*/

		/*Open Approve Dialog*/
		SelectDialogPressApprove: function (oEvent) {

			var oButton = oEvent.getSource();

			if (!this._PressoDialog) {
				this._PressoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Approve", this);
				this._PressoDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PressoDialog);
			this._PressoDialog.open();
			var PoApprovalComments = sap.ui.getCore().byId("idComments");
			PoApprovalComments.setValue(null);
			//To get the Value In Title Of Dialog

			var oPONo = this.getView().byId("objcmp").getTitle();
			var TitleApprove = "Purchase Order No: " + oPONo + " - Approve";

			var oTitle = this._PressoDialog.setTitle(TitleApprove);

		},

		OnCancelApprove: function (oEvent) {
			this._PressoDialog.close();
			if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = null; // make it falsy so that it can be created next time
			}
		},
		/*End of Approve Dialog*/

		/*Open Reject dialog*/

		SelectDialogPressReject: function (oEvent) {

			var oButton = oEvent.getSource();
			if (!this._RejectoDialog) {
				this._RejectoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Reject", this);
				this._RejectoDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._RejectoDialog);
			this._RejectoDialog.open();
			var PoRejectionComments = sap.ui.getCore().byId("idRejectionComments");
			PoRejectionComments.setValue(null);
			var oPONo = this.getView().byId("objcmp").getTitle();
			var Title = "Purchase Order No: " + oPONo + " - Reject";

			var oTitle = this._RejectoDialog.setTitle(Title);

		},

		OnCancelReject: function (oEvent) {
			this._RejectoDialog.close();
			if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = null; // make it falsy so that it can be created next time
			}
		},

		/*End Of Reject Dialog*/

		/*For Review Button*/

		handleDialogPressReview: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();

			var oButton = oEvent.getSource();
			var Dept = "";
			oModel.read("/ApproverDeptSet('" + this._UserID + "')", {
				success: function (odata, oResponse) {
					Dept = odata.Dept;
					that.getOpenReviewPOPUP(Dept);
					//	that.OnCancelReviewPOPUP(Dept);
				},

				error: function (e) {
					//	MessageBox.error("error");
				}

			});

		},
		/*	handleDialogPressReview: function (oEvent) {

				if (!this._ReviewoDialog) {
					this._ReviewoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Review", this);
					this._ReviewoDialog.setModel(this.getView().getModel());
				}

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._ReviewoDialog);
				this._ReviewoDialog.open();
				var PoReviewComments = sap.ui.getCore()("idReviewComments");
				PoReviewComments.set(null);
				var oPONo = this.getView().byId("objcmp").getTitle();
				var Title = "Purchase Order No: " + oPONo + " - Review";

				var oTitle = this._ReviewoDialog.setTitle(Title);

			},*/

		getOpenReviewPOPUP: function (Dept) {
			if (Dept === "REV1") {

				if (!this._ReviewoDialog) {
					this._ReviewoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Review", this);
					this._ReviewoDialog.setModel(this.getView().getModel());
				}

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._ReviewoDialog);
				this._ReviewoDialog.open();

				var oPONo = this.getView().byId("objcmp").getTitle();
				var Title = "Purchase Order No: " + oPONo + " - Review";
				var PoReviewComments = sap.ui.getCore().byId("idReviewComments");
				PoReviewComments.setValue(null);

				var oTitle = this._ReviewoDialog.setTitle(Title);

			} else if (Dept === "REV2") {
				var oModel = this.getView().getModel();

				if (!this.oDialogReview2) {
					this.oDialogReview2 = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Review2", this);
					this.oDialogReview2.setModel(this.getView().getModel());
				}

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oDialogReview2);
				this.oDialogReview2.open();

				var inputReview2 = sap.ui.getCore().byId("cmbUser2");

				var filters = [];

				var oUserName = new sap.ui.model.Filter("Bname", "sap.ui.model.FilterOperator.Contains", this._UserID);
				filters.push(oUserName);

				oModel.read("/UserSearchSet", {
					filters: filters,
					success: function (odata, oResponse) {

						var oModelDataUser = new sap.ui.model.json.JSONModel();
						oModelDataUser.setData(odata);
						inputReview2.setModel(oModelDataUser);
					},
					error: function () {
						//	MessageBox.error("error");
					},

				});

				var oPONo = this.getView().byId("objcmp").getTitle();
				var TitleNew = "Purchase Order No: " + oPONo + " - Review";
				var oTitleReview2 = this.oDialogReview2.setTitle(TitleNew);

				//	var oReview2 = sap.ui.getCore().byId("idReview2Comments");
				//	oReview2.setValue(null);

			}
		},

		OnCancelReview: function (oEvent) {

			this._ReviewoDialog.close();
			if (this._ReviewoDialog) {
				this._ReviewoDialog.destroy();
				this._ReviewoDialog = null; // make it falsy so that it can be created next time
			}
		},
		OnCancelReview2: function (oEvent) {
			this.oDialogReview2.close();
			if (this.oDialogReview2) {
				this.oDialogReview2.destroy();
				this.oDialogReview2 = null; // make it falsy so that it can be created next time
			}

		},

		_handleValueHelpReview2UserAssign: function (oEvent) {

			var oModel = this.getView().getModel();
			var oHelpUserAssign = this._valueHelpDialogUserAssign;
			//	var sInputValueUser = oEvent.getSource();

			this.inputUserId = oEvent.getSource().getId();
			// create value help dialog
			if (!oHelpUserAssign) {
				oHelpUserAssign = sap.ui.xmlfragment(
					"POApproval.ZPOApproval.fragments.AssignUser", //id.fragments.file.name ---take id from manifest.json
					this
				);

				var filters = [];

				var oUserName = new sap.ui.model.Filter("Bname", "EQ", this._UserID);
				filters.push(oUserName);

				oModel.read("/UserSearchSet", {
					filters: filters,
					success: function (odata, oResponse) {

						var oModelDataUser = new sap.ui.model.json.JSONModel();
						oModelDataUser.setData(odata);
						oHelpUserAssign.setModel(oModelDataUser);
					},
					error: function () {
						//	MessageBox.error("error");
					},

				});

				this.getView().addDependent(oHelpUserAssign);

			}

			// create a filter for the binding
			oHelpUserAssign.getBinding("items").filter([new sap.ui.model.Filter(
				"NameFirst"
				//	sap.ui.model.FilterOperator.Contains, sInputValueUser
			)]);

			// open value help dialog filtered by the input value
			oHelpUserAssign.open();

		},

		_handleValueHelpSearchUserAssign: function (evt) {
			var sValueUser = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"NameFirst",
				sap.ui.model.FilterOperator.Contains, sValueUser
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpCloseUserAssign: function (evt) {

			//	var	 inputUserId= oEvent.getSource().getId();
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem.length) {
				MessageToast.show("You have chosen " + oSelectedItem.map(function (oContext) {
					return oContext.getObject().Bname;
				}).join(", "));
			}
			evt.getSource().getBinding("items").filter([]);

			if (oSelectedItem) {
				//var UserInput = this.getView().byId(this.inputUserId);
				var UserInput = sap.ui.getCore().byId(this.inputUserId);
				UserInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},

		GetClock: function () {
			var result = "";

			var d = new Date();
			/*var nday = d.getDay(),
				nmonth = d.getMonth(),
				ndate = d.getDate(),
				nyear = d.getYear();*/
			var nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds(),
				ap;
			if (nhour === 0) {
				ap = " AM";
				nhour = 12;
			} else if (nhour < 12) {
				ap = " AM";
			} else if (nhour === 12) {
				ap = " PM";
			} else if (nhour > 12) {
				ap = " PM";
				nhour -= 12;
			}
			/*if (nyear < 1000) {
				nyear += 1900;
			}*/
			if (nmin <= 9) {
				nmin = "0" + nmin;
			}
			if (nsec <= 9) {
				nsec = "0" + nsec;
			}
			result = nhour + ":" + nmin + ":" + nsec;
			return result;

		},
		GetClock24hrs: function () {

			var result = "";

			var d = new Date();
			/*var nday = d.getDay(),
				nmonth = d.getMonth(),
				ndate = d.getDate(),
				nyear = d.getYear();*/
			var nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds(),
				ap;
			if (nhour === 0) {
				ap = " AM";
				nhour = 24;
			} else if (nhour < 24) {
				ap = " AM";
			} else if (nhour === 24) {
				ap = " PM";
			} else if (nhour > 24) {
				ap = " PM";
				nhour -= 24;
			}
			/*if (nyear < 1000) {
				nyear += 1900;
			}*/
			if (nmin <= 9) {
				nmin = "0" + nmin;
			}
			if (nsec <= 9) {
				nsec = "0" + nsec;
			}
			result = nhour + ":" + nmin + ":" + nsec;
			return result;

		},

		GetClockChanngeFormat: function () {
			var result = "";

			var d = new Date();
			/*var nday = d.getDay(),
				nmonth = d.getMonth(),
				ndate = d.getDate(),
				nyear = d.getYear();*/
			var nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds(),
				ap;
			if (nhour === 0) {
				ap = " AM";
				nhour = 12;
			} else if (nhour < 12) {
				ap = " AM";
			} else if (nhour === 12) {
				ap = " PM";
			} else if (nhour > 12) {
				ap = " PM";
				nhour -= 12;
			}
			/*if (nyear < 1000) {
				nyear += 1900;
			}*/
			if (nmin <= 9) {
				nmin = "0" + nmin;
			}
			if (nsec <= 9) {
				nsec = "0" + nsec;
			}
			result = "PT" + nhour + "H" + nmin + "M" + nsec + "S";
			return result;

		},

		_GetCuurentDate: function (CurrDate) {
			var currentDate = new Date();
			var day = currentDate.getDate();
			var month = currentDate.getMonth() + 1;
			var year = currentDate.getFullYear();
			if (day < 10) {
				day = "0" + parseInt(currentDate.getDate());
			}
			if (month < 10) {
				month = "0" + parseInt(currentDate.getMonth() + 1);
			}
			CurrDate = day + "-" + month + "-" + year;
			//	CurrDate = day + "-" + month + "-" + year;
			return CurrDate;
		},

		OnSubmitApproval: function (oEvent) {
			debugger;
			var that = this;
			that.RefreshMasterList();

			var oModel = this.getView().getModel();
			var po = this.getView().byId("objcmp").getTitle();
			var PoApprovalDate = that._GetCuurentDate();
			var PoApprovalTime = that.GetClock24hrs();
			var PoStatus = "A";
			var PoApprovalComments = sap.ui.getCore().byId("idComments");
			
			if (PoApprovalComments.getValue() === "") {
				MessageToast.show("Please Fill Comments");
				return false;
			} else {
				var oItems = {};
				var that = this;
				oItems.PO = po;
				oItems.UserName = this._UserID;
				oItems.POApprovalDate = PoApprovalDate;
				oItems.POApprovalTime = PoApprovalTime;
				oItems.POStatus = PoStatus;
				oItems.POApprovalComments = PoApprovalComments.getValue();

				oModel.setHeaders({
					"X-Requested-With": "X"
				});

			/*	oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {

						var smsg = "PO " + po + " has been Successfully Approved";
						that.OnCancelApprove();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {
									that.RefreshCommentTable();

									that.RefreshMasterList();
									//	that.onReset();
								}
							}
						});

					},
					error: function (oError) {
						//	MessageBox.error("Error : " + oError);
					}

				});*/
			}

		},

		OnSubmitReject: function (oEvent) {

			var oModel = this.getView().getModel();
			var that = this;
			var po = this.getView().byId("objcmp").getTitle();
			//	var UserNme = sap.ushell.Container.getService("UserInfo").getId();
			//	var UserNme = "PURCHASE1";
			var PoRejectionDate = that._GetCuurentDate();
			var PorejectionTime = that.GetClock24hrs();
			//	var PoRejetionTime = that.GetClockChanngeFormat();
			var PoStatus = "R";
			var PoRejectionComments = sap.ui.getCore().byId("idRejectionComments");

			var oList = sap.ui.getCore().byId("__xmlview0--listPO");

			if (PoRejectionComments.getValue() === "") {
				MessageToast.show(" Please Fill the Comments ");
				return false;
			} else {
				var oItems = {};
				var that = this;
				oItems.PO = po;
				oItems.UserName = this._UserID;
				oItems.PORejectionDate = PoRejectionDate;
				oItems.PORejectionTime = PorejectionTime;
				oItems.POStatus = PoStatus;
				oItems.PORejectionComments = PoRejectionComments.getValue();

				oModel.setHeaders({
					"X-Requested-With": "X"
				});

				oModel.create("/UserRejectionSet", oItems, {

					success: function (odata, oResponse) {

						var smsg = "PO " + po + " has been Successfully Rejected";
						that.OnCancelReject();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {
									that.RefreshCommentTable();
									that.RefreshMasterList();
									//	that.onReset();
								}
							}
						});

					},
					error: function (oError) {
						//	MessageBox.error("Error : " + oError);
					}

				});
			}

		},

		OnSubmitQuery: function (oEvent) {

			var oModel = this.getView().getModel();
			var that = this;
			var po = this.getView().byId("objcmp").getTitle();

			//	var PoQuerFrom = sap.ushell.Container.getService("UserInfo").getId();
			//	var PoQuerFrom = "PURCHASE1";
			//	var PoQuerTo = "PURCHASE2";
			var PoQuerTo = sap.ui.getCore().byId("cmbUser");
			var PoQueryDate = that._GetCuurentDate();
			var PoQueryTime = that.GetClock24hrs();
			//	var PoQueryTime = that.GetClockChanngeFormat();
			var PoQueryText = sap.ui.getCore().byId("idQuery");

			var oList = sap.ui.getCore().byId("__xmlview0--listPO");

			if (PoQueryText.getValue() === "" || PoQuerTo.getSelectedKey() === "") {
				MessageToast.show(" Please Fill the Query And Select the User ");
				return false;
			} else {

				var oItems = {};
				var that = this;
				oItems.PO_NO = po;
				oItems.Query_From = this._UserID;
				oItems.Query_To = PoQuerTo.getSelectedKey();
				oItems.Query_Date = PoQueryDate;
				oItems.Query_Time = PoQueryTime;
				oItems.Query_Text = PoQueryText.getValue();

				oModel.setHeaders({
					"X-Requested-With": "X"
				});

				oModel.create("/POQuerySet", oItems, {

					success: function (odata, oResponse) {

						var smsg = "Query for PO " + po + " has been Raised";
						that.OnCancelQuery();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {

									that.RefreshQueryHistoryTable();
									that.RefreshMasterList();
									//	that.onReset();
								}
							}
						});

					},
					error: function (oError) {
						//	MessageBox.error("Error : " + oError);
					}

				});
			}

		},

		/*	onHideButton: function () {
				var oApproveButton = this.getView().byId("btnApprove");
				var oApproveReject = this.getView().byId("btnReject");
				oApproveButton.setVisible(false);
				oApproveReject.setVisible(false);
			},*/

		onReset: function () {

			var oList = sap.ui.getCore().byId("__xmlview0--listPO");
			var aItems = oList.getItems();
			var po = this.getView().byId("objcmp");

			var PoReviewComments = sap.ui.getCore().byId("idReviewComments");
			var PoApprovalComments = sap.ui.getCore().byId("idComments");
			var PoRejectionComments = sap.ui.getCore().byId("idRejectionComments");
			var PQueryComments = sap.ui.getCore().byId("idQuery");
			var PQueryUserInput = sap.ui.getCore().byId("QUserid");

			PoReviewComments.setValue("");
			PoApprovalComments.setValue("");
			PoRejectionComments.setValue("");
			PQueryComments.setValue("");
			PQueryUserInput.setValue("");

		},

		OnSubmitReview: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();
			var po = this.getView().byId("objcmp").getTitle();
			var PoReveiwDate = that._GetCuurentDate();
			//	var PoReviewlDateTime = that.GetClock();
			var PoReviewTime = that.GetClock24hrs();
			var PoStatus = "REV";
			var PoReviewComments = sap.ui.getCore().byId("idReviewComments");

			if (PoReviewComments.getValue() === "") {
				MessageToast.show("Please Fill Comments");
				return false;
			} else {
				var oItems = {};
				var that = this;
				oItems.PO = po;
				oItems.UserName = this._UserID;
				oItems.POApprovalDate = PoReveiwDate;
				oItems.POApprovalTime = PoReviewTime;
				oItems.POStatus = PoStatus;
				oItems.POApprovalComments = PoReviewComments.getValue();

				oModel.setHeaders({
					"X-Requested-With": "X"
				});

				oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {

						var smsg = "PO " + po + " has been Reviewed";
						that.OnCancelReview();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {

									that.RefreshMasterList();
									//	that.onReset();
								}
							}
						});

					},
					error: function (oError) {
						//MessageBox.error("Error : " + oError);
					}

				});
			}

		},

		OnSubmitReview2: function (oEvent) {

			var that = this;

			var oModel = this.getView().getModel();

			var po = this.getView().byId("objcmp").getTitle();

			var PoReview2Comments = sap.ui.getCore().byId("idReview2Comments");

			if (PoReview2Comments.getValue() === "") {
				MessageToast.show("Please Fill Comments");
				return false;
			} else {
				var that = this;
				var oItems = {};
				oItems.POApprovalComments = PoReview2Comments.getValue();
				oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {},
					error: function (oError) {
						//MessageBox.error("Error : " + oError);
					}
				});
				var oItemsTable = [];

				var Review2Table = sap.ui.getCore().byId("tblUserReview2");
				var oModelItems = Review2Table.getModel();
				var aItems = Review2Table.getItems();

				if (aItems.length > 0) {
					for (var i = 0; i < aItems.length; i++) {
						var BNAME = oModelItems.getProperty("Bname", aItems[i].getBindingContext());
						var FIRSTNAME = oModelItems.getProperty("FirstName", aItems[i].getBindingContext());
						var LASTNAME = oModelItems.getProperty("LastName", aItems[i].getBindingContext());

						oItemsTable.BName = BNAME;
						oItemsTable.Name_First = FIRSTNAME;
						oItemsTable.Name_Last = LASTNAME;
						oModel.setHeaders({
							"X-Requested-With": "X"
						});

						oModel.create("/POFinanceReleaseApprovers", oItemsTable, {
							success: function (odata, oResponse) {
								if (i === aItems.length) {
									var smsg = "PO " + po + " has been Reviewed";
									that.OnCancelReview();
									MessageBox.confirm(smsg, {
										icon: sap.m.MessageBox.Icon.INFORMATION,
										title: "Confirm",
										actions: [sap.m.MessageBox.Action.OK],
										onClose: function (sAction) {
											if (sAction === "OK") {
												that.RefreshMasterList();
												//	that.onReset();
											}
										}
									});

								}

							},
							error: function (oError) {
								//MessageBox.error("Error : " + oError);
							}

						});
					}
				}

			}

		},

		getUserDeptByUserID: function (UserId) {

			var filters = [];
			var Pocount;
			var oUserID = new sap.ui.model.Filter("UserID", "EQ", UserId);
			filters.push(oUserID);
			//	  this._UserID
			var oModel = this.getView().getModel();
			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {
					Pocount = odata.results.length;
				},
				error: function () {
					//	MessageBox.error("error");
				}

			});
			//var oList = this.getView().byId("listPO");
			var oQueryButton = this.getView().byId("btnQuery");
			var oReviewbButton = this.getView().byId("btnReview");
			var oApproveButton = this.getView().byId("btnApprove");
			var oRejectButton = this.getView().byId("btnReject");

			oModel.read("/ApproverDeptSet('" + UserId + "')", {
				success: function (odata, oResponse) {

					if (odata.Dept === "PUR" && Pocount <= 0) {
						oQueryButton.setEnabled(false);
						oReviewbButton.setVisible(false);

						oApproveButton.setEnabled(false);
						oRejectButton.setEnabled(false);

						oApproveButton.setVisible(true);
						oRejectButton.setVisible(true);

					} else if (odata.Dept === "PUR" && Pocount > 0) {
						oQueryButton.setEnabled(true);
						oReviewbButton.setVisible(false);

						oApproveButton.setEnabled(true);
						oRejectButton.setEnabled(true);

						oApproveButton.setVisible(true);
						oRejectButton.setVisible(true);
					} else if ((odata.Dept === "REV1" && Pocount <= 0) || (odata.Dept === "REV2" && Pocount <= 0)) {
						//oQueryButton.setVisible(true);
						oReviewbButton.setVisible(true);

						oQueryButton.setEnabled(false);
						oReviewbButton.setEnabled(false);

						oApproveButton.setVisible(false);
						oRejectButton.setVisible(false);
					} else if ((odata.Dept === "REV1" || odata.Dept === "REV2") && Pocount > 0) {
						//oQueryButton.setVisible(true);
						oReviewbButton.setVisible(true);

						oQueryButton.setEnabled(true);
						oReviewbButton.setEnabled(true);

						oApproveButton.setVisible(false);
						oRejectButton.setVisible(false);
					}

				},

				error: function (e) {
					//	MessageBox.error("error");
				}

			});

		},

		handleIconTabBarSelect: function (oEvent) {
			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();

			var txtPO_No = this.getView().byId("PurOrdNo");
			var txtPODesc = this.getView().byId("PurOrdDesc");
			var txtPurOrdInt = this.getView().byId("PurOrdInt");
			var txtVendor = this.getView().byId("PurOrdVendor");
			var txtPlant = this.getView().byId("idPlant");

			var txtDocument_Type = this.getView().byId("PurDocType");
			var txtDocumentDate = this.getView().byId("PurOrdDt");
			var txtPurOrdSts = this.getView().byId("PurOrdSts");

			var filters = [];

			var sKey = oEvent.getParameter("key");
			if (sKey === "Attachments") {

			} else if (sKey === "QueryHistory") {
				//	var POHistory = this.getView().byId("objcmp").getTitle();
				var oTableHistory = this.getView().byId("tblQueryHistory");
				var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
				filters.push(oPOH);

				oModel.read("/POQueryHistorySet", {
					filters: filters,
					success: function (odata, oResponse) {
						if (PONo !== "") {

							var oModelData = new sap.ui.model.json.JSONModel();
							oModelData.setData(odata);
							oTableHistory.setModel(oModelData);

						} else {
							oTableHistory.setModel(null);
						}

					},
					error: function () {
						//	MessageBox.error("error");
					}
				});

			} else if (sKey === "Comments") {
				//	var PO = this.getView().byId("objcmp").getTitle();
				var oTable = this.getView().byId("tblComments");

				var oPO = new sap.ui.model.Filter("PO", "EQ", PONo);
				filters.push(oPO);

				oModel.read("/POCommentsSet", {
					filters: filters,
					success: function (odata, oResponse) {
						if (PONo !== "") {

							var oModelData = new sap.ui.model.json.JSONModel();
							oModelData.setData(odata);
							oTable.setModel(oModelData);

						} else {

							oTable.setModel(null);

						}

					},
					error: function () {
						//	MessageBox.error("error");
					}
				});

			} else if (sKey === "General") {

				var DocumentDate, day, month, year, final;
				var oApproveButton = this.getView().byId("btnApprove");
				var oApproveReject = this.getView().byId("btnReject");
				var POStatus = this.getView().byId("objPrice");
				oModel.read("/PurchaseOrderGeneralSet('" + this.PO_No + "')", {
					success: function (odata, oResponse) {

						if (PONo !== "") {
							txtPO_No.setText(oResponse.data.PO_No);
							txtPODesc.setText(oResponse.data.PO_Description);
							txtPurOrdInt.setText(oResponse.data.PO_Initiator);
							txtVendor.setText(oResponse.data.Vendor);
							txtPlant.setText(oResponse.data.Plant);
							txtDocument_Type.setText(oResponse.data.Document_Type);
							if (oResponse.data.Document_Date !== null) {
								DocumentDate = oResponse.data.Document_Date;
								year = DocumentDate.substring(0, 4);
								month = DocumentDate.substring(4, 6);
								day = DocumentDate.substring(6, 8);

								final = day + "-" + month + "-" + year;
								txtDocumentDate.setText(final);

							} else {
								txtDocumentDate.setText("");
							}

							txtPurOrdSts.setText(oResponse.data.PO_Status);

						} else {
							txtPO_No.setText("");
							txtPODesc.setText("");
							txtPurOrdInt.setText("");
							txtVendor.setText("");
							txtPlant.setText("");
							txtDocument_Type.setText("");
							txtDocumentDate.setText("");
							txtPurOrdSts.setText("");
						}

					},

					error: function (e) {
						//	MessageBox.error("error");
					}

				});

			}

		},

		handleSelectionFinish: function (oEvent) {

			var oModelItems = new sap.ui.model.json.JSONModel();
			var otableUser = sap.ui.getCore().byId("tblUserReview2");
			var oCmbKey = sap.ui.getCore().byId("cmbUser2");

			var selectedItems = oEvent.getParameter("selectedItems");
			var item = {};
			var values = "";
			for (var i = 0; i < selectedItems.length; i++) {
				var oText = selectedItems[i].getText();
				var oKey = selectedItems[i].getKey();

				var myFirstNamearray = [];
				myFirstNamearray = oText.toString().split(" ");

				if (values.results === undefined) {
					values = {
						results: []

					};
				}
				item = {
					"Bname": oKey,
					"UserName": oText,
					"FirstName": myFirstNamearray[0],
					"LastName": myFirstNamearray[1]

				};

				values.results.push(item);
				oModelItems.setData(values);
				otableUser.setModel(oModelItems);
			}
		}

	});

});