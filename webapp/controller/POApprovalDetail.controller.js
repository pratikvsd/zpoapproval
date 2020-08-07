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

		onInit: function (oEvent) {
			this._UserID = sap.ushell.Container.getService("UserInfo").getId();
		//	this._UserID = "COCKPIT2_1";
			var that = this;
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);
			if (this._UserID !== null) {
				that.getUserDeptByUserID(this._UserID);
			}

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("POApprovalDetail").attachPatternMatched(this._onEditMatched, this);

			var oUploadCollection = this.getView().byId('UploadCollection');
			oUploadCollection.setUploadUrl("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/POAttachmentsSet");

			/*	var ImageDMS = this.getView().byId('imgDMS');
				ImageDMS.setSrc(window.location.protocol + window.location.hostname + ":" + window.location.port +
					"/sap/bc/ui5_ui5/sap/zpoapproval/Images/dms.JPG");*/
		},

		/*	onBeforeRendering: function () {

				var that = this;
				var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
				this.getView().setModel(oModel);

				if (this._UserID !== null) {
					that.getUserDeptByUserID(this._UserID);
				}
			},*/

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		RefreshMasterList: function () {

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

			var oPoReleasebutton = this.getView().byId("btnApproveRelese");

			var PurchaseNo = this.getView().byId("PurOrdNo");
			var PODescription = this.getView().byId("PurOrdDesc");
			var POOrderInti = this.getView().byId("PurOrdInt");

			var vendor = this.getView().byId("PurOrdVendor");
			var Plant = this.getView().byId("idPlant");
			var DocType = this.getView().byId("PurDocType");

			var orderdate = this.getView().byId("PurOrdDt");
			var PoStatus = this.getView().byId("PurOrdSts");

			var Attachments = this.getView().byId("UploadCollection");
			var attachmentTitle = this.getView().byId("attachmentTitle");

			var oHtml = this.getView().byId("idFrame");

			var that = this;

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
							oHtml.setVisible(true);
							that.handleIconTabBarSelect();

						} else {
							oModelData.setData(odata);
							oList1.setModel(oModelData);
							txtPONOOB.setTitle("");

							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							Plant.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							oQueryButton.setEnabled(false);
							oReviewButton.setEnabled(false);
							oApproveButton.setEnabled(false);
							oApproveReject.setEnabled(false);
							oPoReleasebutton.setEnabled(false);
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");

							Attachments.setModel(null);

						}
					} else if (oList2 !== undefined) {
						if (Pocount > 0) {

							oModelData.setData(odata);
							oList2.setModel(oModelData);
							oHtml.setVisible(true);
							that.handleIconTabBarSelect();

						} else {
							oModelData.setData(odata);
							oList2.setModel(oModelData);
							txtPONOOB.setTitle("");

							POCoverNote.setContent(null);
							POQueryHistory.setModel(null);
							POQueryComments.setModel(null);
							PurchaseNo.setText("");
							PODescription.setText("");
							POOrderInti.setText("");
							vendor.setText("");
							Plant.setText("");
							DocType.setText("");
							orderdate.setText("");
							PoStatus.setText("");
							oQueryButton.setEnabled(false);
							oReviewButton.setEnabled(false);
							oApproveButton.setEnabled(false);
							oApproveReject.setEnabled(false);
							oPoReleasebutton.setEnabled(false);
							Attachments.setUploadEnabled(false);
							attachmentTitle.setText("Uploaded(" + 0 + ") ");

							Attachments.setModel(null);

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

			var that = this;
			var oParameters = oEvent.getParameters();

			var txtPONOOB = this.getView().byId("objcmp");
			var txtPO_Status = this.getView().byId("objPrice");

			var oApproveButton = this.getView().byId("btnApprove");
			var oApproveReject = this.getView().byId("btnReject");
			var oApproveButtonRelease = this.getView().byId("btnApproveRelese");
			var oReviewbButton = this.getView().byId("btnReview");


			//	var oSelection = this.getView().byId("idSelection");

			if (oParameters.arguments.PO_No !== "" || oParameters.arguments.PO_No !== null) {

				this.PO_No = oParameters.arguments.PO_No;
				this.POStatus = oParameters.arguments.PO_Status;
				//	this.Selction = oParameters.arguments.Selection;

				txtPONOOB.setTitle(this.PO_No);
				txtPO_Status.setText(this.POStatus);
				//	oSelection.setText(this.Selction);

				if (txtPO_Status.getText() === "Q") {
					oApproveButton.setEnabled(false);
					oApproveButtonRelease.setEnabled(false);
					oApproveReject.setEnabled(false);
				oReviewbButton.setEnabled(false); 


				} else if (txtPO_Status.getText() === "A") {
					oApproveButton.setEnabled(true);
					oApproveButtonRelease.setEnabled(true);
					oApproveReject.setEnabled(true);
						oReviewbButton.setEnabled(true); 

				}
				that.handleIconTabBarSelect();
				//	that.OnPressCoverNote();

			}

		},

		//Upload Attachments
		onUploadComplete: function (oEvent) {
			//var oModel = this.getView().getModel();
			//	this.getView().getModel().refresh();
			//var Attachments = this.getView().byId("UploadCollection");
			var that = this;
			that.OnPressAttachments();
		},

		// Before Upload Attachments
		onBeforeUploadStarts: function (oEvent) {

			var Attachments = this.getView().byId("UploadCollection");

			var PO = this.getView().byId("objcmp").getTitle();
			// Header Slug

			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

			var oCustomerHeaderPONo = new sap.m.UploadCollectionParameter({
				name: "PO_NO",
				value: PO
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderPONo);

			var oModel = this.getView().getModel();
			oModel.refreshSecurityToken();
			var oHeaders = oModel.oHeaders;

			var sToken = oHeaders['x-csrf-token'];
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: sToken
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderToken);
			Attachments.setBusy(true);

		},

		onFilenameLengthExceed: function (oEvent) {
			var smsg = "Filename Length should be less than 35 characters";
			MessageBox.confirm(smsg, {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Confirm",
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function (sAction) {
					if (sAction === "OK") {}
				}
			});
		},

		/*	onPressFileName: function (oEvent) {

			var Attchments = this.getView().byId("UploadCollection");
			var aSelectedItems = Attchments.getItems();
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					if (Attchments.getItems()[i].getDocumentId() === oEvent.getSource().getDocumentId()) {
						oEvent.getSource().setSelected(true);
						Attchments.downloadItem(aSelectedItems[i], false);
						break;
					}
				}
			}
		},
*/
		//Delete Attachment
		onFileDeleted: function (oEvent) {

			var documnentId = oEvent.getParameter("documentId");
			this.deleteItemById(documnentId);
		},

		deleteItemById: function (sItemToDeleteId) {

			var that = this;
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);

			var oPONo = this.getView().byId("objcmp").getTitle();

			oModel.setHeaders({
				"X-Requested-With": "X",
				"DocumentID": sItemToDeleteId
			});

			oModel.remove("/POAttachmentsSet('" + oPONo + "')", {

				method: "DELETE",
				success: function (odata, oResponse) {
					MessageBox.success("Attachment Deleted Successfully", {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						title: "Success",
						onClose: function (oAction) {
							that.OnPressAttachments();
						}
					});

				},

				error: function (err) {
					MessageBox.error("error");
				}
			});

			//	this.getView().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		getAttachmentTitleText: function () {
			var aItems = this.getView().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},

		// Open Query Dialog//

		handleSelectDialogPress: function (oEvent) {
			var oModel = this.getView().getModel();

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

			cmbUser.setFilterFunction(function (sTerm, oItem) {
				// A case-insensitive 'string contains' filter
				var sItemText = oItem.getText().toLowerCase(),
					sSearchTerm = sTerm.toLowerCase();

				return sItemText.indexOf(sSearchTerm) > -1;
			});

		},
		OnCancelQuery: function (oEvent) {
			this._oDialog.close();
			if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = null; // make it falsy so that it can be created next time
			}
		},

		/*	_handleValueHelpUser: function (oEvent) {

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
			},*/
		/*End Of Query Dialog*/

		/*Open Approve Dialog*/
		SelectDialogPressApprove: function (oEvent) {

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
			this._PressoDialog.setTitle(TitleApprove);
		},

		OnCancelApprove: function (oEvent) {
			this._PressoDialog.close();
			if (this._PressoDialog) {
				this._PressoDialog.destroy();
				this._PressoDialog = null; // make it falsy so that it can be created next time
			}
		},
		/*End of Approve Dialog*/

		/*Open Reject dialog*/

		SelectDialogPressReject: function (oEvent) {

			var Attachments = this.getView().byId("UploadCollection");
			var aSelectedItems = Attachments.getItems();
			if (aSelectedItems.length > 0) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					if (Attachments.getItems()[i].getSelected() === false) {
						var smsg = "Please view all attachments before Approve/Reject";
						MessageBox.information(smsg);
						return false;
					}
				}
			}

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
			this._RejectoDialog.setTitle(Title);

		},

		OnCancelReject: function (oEvent) {
			this._RejectoDialog.close();
			if (this._RejectoDialog) {
				this._RejectoDialog.destroy();
				this._RejectoDialog = null; // make it falsy so that it can be created next time
			}
		},

		/*End Of Reject Dialog*/

		/*For Review Button*/

		handleDialogPressReview: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();

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

		getOpenReviewPOPUP: function (Dept) {
			var oPONo = this.getView().byId("objcmp").getTitle();

			if (Dept === "REV1") {

				if (!this._ReviewoDialog) {
					this._ReviewoDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Review", this);
					this._ReviewoDialog.setModel(this.getView().getModel());
				}

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._ReviewoDialog);
				this._ReviewoDialog.open();

				var Title = "Purchase Order No: " + oPONo + " - Review";
				var PoReviewComments = sap.ui.getCore().byId("idReviewComments");
				PoReviewComments.setValue(null);

				this._ReviewoDialog.setTitle(Title);

			} else if (Dept === "REV2") {
				var oModel = this.getView().getModel();

				if (!this.oDialogReview2) {
					this.oDialogReview2 = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Review2", this);
					this.oDialogReview2.setModel(this.getView().getModel());
				}

				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oDialogReview2);
				this.oDialogReview2.open();

				var inputReview2 = sap.ui.getCore().byId("cmbUserR");

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

				var TitleNew = "Purchase Order No: " + oPONo + " - Review";
				this.oDialogReview2.setTitle(TitleNew);

				inputReview2.setFilterFunction(function (sTerm, oItem) {
					// A case-insensitive 'string contains' filter
					var sItemText = oItem.getText().toLowerCase(),
						sSearchTerm = sTerm.toLowerCase();

					return sItemText.indexOf(sSearchTerm) > -1;
				});

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

		SelectDialogPressPORelease: function (oEvent) {

			if (!this._PressPOReleaseDialog) {
				this._PressPOReleaseDialog = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.PORelease", this);
				this._PressPOReleaseDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PressPOReleaseDialog);
			this._PressPOReleaseDialog.open();
			var PoApprovalComments = sap.ui.getCore().byId("idCommentsPORelase");
			PoApprovalComments.setValue(null);
			//To get the Value In Title Of Dialog

			var oPONo = this.getView().byId("objcmp").getTitle();
			var TitleApprove = "Purchase Order No: " + oPONo + " - Approve";

			this._PressPOReleaseDialog.setTitle(TitleApprove);

		},
		OnCancelPORelease: function (oEvent) {
			this._PressPOReleaseDialog.close();
			if (this._PressPOReleaseDialog) {
				this._PressPOReleaseDialog.destroy();
				this._PressPOReleaseDialog = null; // make it falsy so that it can be created next time
			}

		},

		GetClock24hrs: function () {

			var result = "";
			var d = new Date();
			//	var nhour = 25,
			var nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds(),
				ap;
			if (nhour === 0) {
				ap = " AM";
				nhour = 24;
			} else if (nhour < 24) {
				ap = " PM";
			} else if (nhour === 24) {
				ap = " PM";
			} else if (nhour > 24) {
				ap = " AM";
				nhour = nhour - 24;
			}

			if (nhour <= 9) {
				nhour = "0" + nhour;
			}
			if (nmin <= 9) {
				nmin = "0" + nmin;
			}
			if (nsec <= 9) {
				nsec = "0" + nsec;
			}
			result = nhour + ":" + nmin + ":" + nsec;
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

			var that = this;
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

				oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {

						var smsg = "PO " + po + " has been Successfully Approved";
						that.OnCancelApprove();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {

									that.RefreshMasterList();

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

		OnSubmitPORelease: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();
			var po = this.getView().byId("objcmp").getTitle();
			var PoReleaseDate = that._GetCuurentDate();
			var PoReleaseTime = that.GetClock24hrs();
			var PoStatus = "REL";
			var PReleaseComments = sap.ui.getCore().byId("idCommentsPORelase");

			if (PReleaseComments.getValue() === "") {
				MessageToast.show("Please Fill Comments");
				return false;
			} else {
				var oItems = {};
				var that = this;
				oItems.PO = po;
				oItems.UserName = this._UserID;
				oItems.POApprovalDate = PoReleaseDate;
				oItems.POApprovalTime = PoReleaseTime;
				oItems.POStatus = PoStatus;
				oItems.POApprovalComments = PReleaseComments.getValue();

				oModel.setHeaders({
					"X-Requested-With": "X"
				});

				oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {

						var smsg = "PO " + po + " has been Successfully Approved";
						that.OnCancelPORelease();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {

									that.RefreshMasterList();

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

		OnSubmitReject: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();

			var oButton = oEvent.getSource();
			var Dept = "";
			oModel.read("/ApproverDeptSet('" + this._UserID + "')", {
				success: function (odata, oResponse) {
					Dept = odata.Dept;

					that.OnRejectReview2POPUP(Dept);
					//	that.OnCancelReviewPOPUP(Dept);
				},

				error: function (e) {
					//	MessageBox.error("error");
				}

			});

		},

		OnRejectReview2POPUP: function (Dept) {

			var oModel = this.getView().getModel();
			var that = this;
			var po = this.getView().byId("objcmp").getTitle();

			var PoRejectionDate = that._GetCuurentDate();
			var PorejectionTime = that.GetClock24hrs();
			var PoStatus = "R";
			var PoStatusReview2 = "REJ_REV";
			var PoRejectionComments = sap.ui.getCore().byId("idRejectionComments");
			if (Dept === "PUR" || Dept === "REV1") {

				if (PoRejectionComments.getValue() === "") {
					MessageToast.show(" Please Fill the Comments ");
					return false;
				} else {
					var oItems = {};
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

										that.RefreshMasterList();

									}
								}
							});

						},
						error: function (oError) {
							//	MessageBox.error("Error : " + oError);
						}

					});
				}

			} else if (Dept === "REV2") {

				if (PoRejectionComments.getValue() === "") {
					MessageToast.show(" Please Fill the Comments ");
					return false;
				} else {
					var oItemsR = {};
					oItemsR.PO = po;
					oItemsR.UserName = this._UserID;
					oItemsR.PORejectionDate = PoRejectionDate;
					oItemsR.PORejectionTime = PorejectionTime;
					oItemsR.POStatus = PoStatusReview2;
					oItemsR.PORejectionComments = PoRejectionComments.getValue();

					oModel.setHeaders({
						"X-Requested-With": "X"
					});

					oModel.create("/UserRejectionSet", oItemsR, {
						success: function (odata, oResponse) {
							var smsg = "PO " + po + " has been Successfully Rejected";
							that.OnCancelReject();
							MessageBox.confirm(smsg, {
								icon: sap.m.MessageBox.Icon.INFORMATION,
								title: "Confirm",
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (sAction) {
									if (sAction === "OK") {
										that.RefreshMasterList();
									}
								}
							});

						},
						error: function (oError) {
							//	MessageBox.error("Error : " + oError);
						}

					});
				}
			}

		},

		OnSubmitQuery: function (oEvent) {

			var oModel = this.getView().getModel();
			var that = this;
			var po = this.getView().byId("objcmp").getTitle();

			//	var PoQuerFrom = sap.ushell.Container.getService("UserInfo").getId();
			//	var PoQuerFrom = "PURCHASE1";  substring
			//	var PoQuerTo = "PURCHASE2";
			var PoQuerTo = sap.ui.getCore().byId("cmbUser").getValue();

			var searchtext1 = '(';
			var searchtext2 = ')';
			var pos1 = PoQuerTo.indexOf(searchtext1);
			var pos2 = PoQuerTo.indexOf(searchtext2);
			var POQueyToGetValue = PoQuerTo.substring(pos1 + 1, pos2);
			//	var POQueryBname = PoQuerTo.getValue().substring(0,29);

			var PoQueryDate = that._GetCuurentDate();
			var PoQueryTime = that.GetClock24hrs();
			//	var PoQueryTime = that.GetClockChanngeFormat();
			var PoQueryText = sap.ui.getCore().byId("idQuery");

			var oList = sap.ui.getCore().byId("__xmlview0--listPO");

			if (PoQueryText.getValue() === "" || PoQuerTo === "") {
				MessageToast.show(" Please Fill the Query And Select the User ");
				return false;
			} else {

				var oItems = {};

				oItems.PO_NO = po;
				oItems.Query_From = this._UserID;
				oItems.Query_To = POQueyToGetValue;
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

									that.RefreshMasterList();

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
			var oTable = sap.ui.getCore().byId("tblUserReview2");
			var oModel = this.getView().getModel();
			var oModelItems = oTable.getModel();
			var po = this.getView().byId("objcmp").getTitle();

			var oItems = {};
			var PoReveiwDate = that._GetCuurentDate();
			//	var PoReviewlDateTime = that.GetClock();
			var PoReviewTime = that.GetClock24hrs();
			var PoStatus = "REV";
			var PoReview2Comments = sap.ui.getCore().byId("idReview2Comments");
			var PoReview2USer = sap.ui.getCore().byId("cmbUserR");

			oModel.setUseBatch(true);
			var aItems = oTable.getItems();

			if (PoReview2Comments.getValue() === "" || PoReview2USer.getTokens().length === 0) {
				MessageToast.show(" Please Fill the Comment And Select the User ");
				return false;
			} else {
				for (var i = 0; i < aItems.length; i++) {
					var BNAME = oModelItems.getProperty("Bname", aItems[i].getBindingContext());

					var batchChanges = [];
					var oItemsTable = {};
					oItemsTable.PO = po;
					oItemsTable.BName = BNAME;
					oItemsTable.Name_First = "";
					oItemsTable.Name_Last = "";

					batchChanges.push(oModel.createBatchOperation("POFinanceReleaseApproversSet", "POST", oItemsTable));
					oModel.addBatchChangeOperations(batchChanges);

					oModel.submitBatch(function (data) {

					}, function (err) {

					});

				}

				oItems.PO = po;
				oItems.UserName = this._UserID;
				oItems.POApprovalDate = PoReveiwDate;
				oItems.POApprovalTime = PoReviewTime;
				oItems.POStatus = PoStatus;
				oItems.POApprovalComments = PoReview2Comments.getValue();
				oModel.create("/UserApprovalSet", oItems, {
					success: function (odata, oResponse) {

						var smsg = "PO " + po + " has been Reviewed";
						that.OnCancelReview2();
						MessageBox.confirm(smsg, {
							icon: sap.m.MessageBox.Icon.INFORMATION,
							title: "Confirm",
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (sAction) {
								if (sAction === "OK") {
									that.RefreshMasterList();

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

		getUserDeptByUserID: function (UserId) {

			var filters = [];
			var Pocount;
			var that = this;
			var oUserID = new sap.ui.model.Filter("UserID", "EQ", UserId);
			filters.push(oUserID);
			var oModel = this.getView().getModel();
			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {
					Pocount = odata.results.length;
					that.getButtonsAsperDept(Pocount, UserId);
				},
				error: function () {
					//	MessageBox.error("error");
				}

			});
		},

		getButtonsAsperDept: function (Pocount, UserId) {

			var oModel = this.getView().getModel();
			var filters = [];
			var oUserID = new sap.ui.model.Filter("UserID", "EQ", UserId);
			filters.push(oUserID);
			//	  this._UserID

			var oQueryButton = this.getView().byId("btnQuery");
			var oReviewbButton = this.getView().byId("btnReview");
			var oApproveButton = this.getView().byId("btnApprove");
			var oRejectButton = this.getView().byId("btnReject");
			var oApproveButtonRelease = this.getView().byId("btnApproveRelese");

			oModel.read("/ApproverDeptSet('" + UserId + "')", {
				success: function (odata, oResponse) {

					if (odata.Dept === "PUR" && Pocount <= 0) {
						oQueryButton.setEnabled(false);
						oApproveButton.setEnabled(false);
						oRejectButton.setEnabled(false);

						oReviewbButton.setVisible(false);
						//	oApproveButtonRelease.setVisible(false);

						oApproveButton.setVisible(true);
						oRejectButton.setVisible(true);

					} else if (odata.Dept === "PUR" && Pocount > 0) {
						//	oQueryButton.setEnabled(true);
						//	oApproveButton.setEnabled(true);
						//	oRejectButton.setEnabled(true);

						oReviewbButton.setVisible(false);

						oApproveButton.setVisible(true);
						oRejectButton.setVisible(true);
					} else if (odata.Dept === "REV1" && Pocount <= 0) {
						//oQueryButton.setVisible(true);
						oReviewbButton.setVisible(true);
						oApproveButton.setVisible(false);
						oRejectButton.setVisible(false);

						oQueryButton.setEnabled(false);
						oReviewbButton.setEnabled(false);

					} else if (odata.Dept === "REV2" && Pocount <= 0) {
						//oQueryButton.setVisible(true);
						oReviewbButton.setVisible(true);
						oApproveButton.setVisible(false);
						oRejectButton.setVisible(true);
						oApproveButtonRelease.setVisible(true);

						oQueryButton.setEnabled(false);
						oReviewbButton.setEnabled(false);
						oApproveButtonRelease.setEnabled(false);

						oApproveButton.setEnabled(false);
						oRejectButton.setEnabled(false);
					} else if (odata.Dept === "REV1" && Pocount > 0) {
						//oQueryButton.setVisible(true);
						oReviewbButton.setVisible(true);

						oQueryButton.setEnabled(true);
						oReviewbButton.setEnabled(true);

						oApproveButton.setVisible(false);
						oRejectButton.setVisible(false);
					} else if (odata.Dept === "REV2" && Pocount > 0) {
						//oQueryButton.setVisible(true);
						oReviewbButton.setVisible(true);
						oApproveButton.setVisible(false);
						oRejectButton.setVisible(true);
						oApproveButtonRelease.setVisible(true);

						oQueryButton.setEnabled(true);
					//	oReviewbButton.setEnabled(true);
					//	oApproveButton.setEnabled(true);
					//	oRejectButton.setEnabled(true);

					}

				},

				error: function (e) {
					//	MessageBox.error("error");
				}

			});
		},

		handleIconTabBarSelect: function () {

			var that = this;
			var iconTab = this.getView().byId("idIconTabBarNoIcons");
			if (iconTab.getSelectedKey() === "CoverNote") {
				that.OnPressCoverNote();
			} else if (iconTab.getSelectedKey() === "Attachments") {
				that.OnPressAttachments();

			} else if (iconTab.getSelectedKey() === "QueryHistory") {
				that.OnPressQueryHistory();
			} else if (iconTab.getSelectedKey() === "Comments") {
				that.OnPressPOComment();
			} else if (iconTab.getSelectedKey() === "General") {
				that.OnPressGeneralTab();
			}

		},

		/*	handleSelectionFinish: function (oEvent) {

				var oModelItems = new sap.ui.model.json.JSONModel();
				var otableUser = sap.ui.getCore().byId("tblUserReview2");
				var oCmbKey = sap.ui.getCore().byId("cmbUser2");

				var oModel = this.getView().getModel();
				var oModelDataUser = new sap.ui.model.json.JSONModel();
				var SearchText = oEvent.getSource().getValue();

				var filters = [];
				if (SearchText.length >= 3) {
					var oBname = new sap.ui.model.Filter("Bname", "EQ", SearchText);
					filters.push(oBname);

					oModel.read("/UserSearchSet", {
						filters: filters,
						success: function (odata, oResponse) {

							oModelDataUser.setData(odata);
							oCmbKey.setModel(oModelDataUser);
							oCmbKey.bindAggregation("suggestionItems", {
								path: "/results",
								template: new sap.ui.core.Item({
									text: "{NameFirst} {NameLast}({Bname})",
								})
							});
						},
						error: function () {
							MessageBox.error("error");
						},

					});

				}

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
			},*/

		OnPressCoverNote: function () {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oHtml = this.getView().byId("idFrame");
			//	oHtml.setVisible(true);
			var sRead = "/SelectedPOContentSet('" + PONo + "')/$value";
		//	oModel.defaultHttpClient.enableJsonpCallback = true;
			oModel.read(sRead,{
				success: function (oData, oResponse) {
					if (oResponse.body !== "") {
						var pdfURL = oResponse.requestUri;
						oHtml.setContent("<iframe src=" + pdfURL + " width='100%' height='600px'></iframe>");
						oHtml.setVisible(true);
					} else {
						//	oHtml.setVisible(false);
					}
				},
				error: function () {
					//	MessageBox.error("Cover Note Read Failed");
				}
			});
		},
		OnPressAttachments: function () {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var that = this;
			var Attachments = this.getView().byId("UploadCollection");
			var OUserId = this._UserID;
			var oText, oDocumentDate, day, month, year, Hours, Minutes, Seconds, final;
			var attachmentTitle = this.getView().byId("attachmentTitle");
			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
			filters.push(oPOH);
			Attachments.setBusy(true);

			if (PONo !== "") {
				oModel.read("/POAttachmentsSet", {
					filters: filters,
					success: function (odata, oResponse) {
						var oModelData = new sap.ui.model.json.JSONModel();
						oModelData.setData(odata);
						Attachments.setModel(oModelData);
						Attachments.setBusy(false);

						if (Attachments.getItems().length > 0) {
							for (var i = 0; i < Attachments.getItems().length; i++) {
								if (Attachments.getItems()[i].getAttributes()[0].getTitle() === OUserId) {
									Attachments.getItems()[i].setEnableDelete(true);
								} else {
									Attachments.getItems()[i].setEnableDelete(false);
								}
								// Attachments.getItems()[i].getStatuses()[0].getText();
								oText = Attachments.getItems()[i].getStatuses()[0].getText().substring(0, 13);
								year = Attachments.getItems()[i].getStatuses()[0].getText().substring(13, 17);
								month = Attachments.getItems()[i].getStatuses()[0].getText().substring(17, 19);
								day = Attachments.getItems()[i].getStatuses()[0].getText().substring(19, 21);

								Hours = Attachments.getItems()[i].getStatuses()[0].getText().substring(21, 24);
								Minutes = Attachments.getItems()[i].getStatuses()[0].getText().substring(24, 26);
								Seconds = Attachments.getItems()[i].getStatuses()[0].getText().substring(26, 28);

								final = oText + day + "-" + month + "-" + year + " " + Hours + ":" + Minutes + ":" + Seconds;
								Attachments.getItems()[i].getStatuses()[0].setText(final);
							}
						}
						attachmentTitle.setText(that.getAttachmentTitleText());

					},
					error: function () {
						//	MessageBox.error("error");
					}
				});
			} else {
				Attachments.setModel(null);
				Attachments.setBusy(false);
				Attachments.setUploadEnabled(false);

				attachmentTitle.setText("Uploaded(" + 0 + ") ");

			}

		},
		OnPressQueryHistory: function () {

			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oTableHistory = this.getView().byId("tblQueryHistory");

			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO_NO", "EQ", PONo);
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
		OnPressPOComment: function () {
			var oModel = this.getView().getModel();
			var PONo = this.getView().byId("objcmp").getTitle();
			var oTable = this.getView().byId("tblComments");

			var filters = [];

			var oPOH = new sap.ui.model.Filter("PO", "EQ", PONo);
			filters.push(oPOH);
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
		OnPressGeneralTab: function () {

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

			var DocumentDate, day, month, year, final;

			oModel.read("/PurchaseOrderGeneralSet(PO_NO='" + PONo + "')", {
				success: function (odata, oResponse) {

					txtPO_No.setText(odata.PO_NO);
					txtPODesc.setText(odata.PO_Description);
					txtPurOrdInt.setText(odata.PO_Initiator);
					txtVendor.setText(odata.Vendor);
					txtPlant.setText(odata.Plant);
					txtDocument_Type.setText(odata.Document_Type);
					txtPurOrdSts.setText(odata.PO_Status);
					if (odata.Document_Date !== null) {
						DocumentDate = odata.Document_Date;
						year = DocumentDate.substring(0, 4);
						month = DocumentDate.substring(4, 6);
						day = DocumentDate.substring(6, 8);

						final = day + "-" + month + "-" + year;
						txtDocumentDate.setText(final);

					} else {
						txtDocumentDate.setText("");
					}

				},

				error: function (e) {
					//	MessageBox.error("error");
				}

			});
		},

		OnSelectUser: function (oEvent) {

			var oModel = this.getView().getModel();
			var oModelDataUser = new sap.ui.model.json.JSONModel();
			var SearchText = oEvent.getSource().getValue();
			var cmbUser = sap.ui.getCore().byId("cmbUser");
			var filters = [];
			if (SearchText.length >= 3) {
				var oBname = new sap.ui.model.Filter("Bname", "EQ", SearchText);
				filters.push(oBname);

				oModel.read("/UserSearchSet", {
					filters: filters,
					success: function (odata, oResponse) {

						oModelDataUser.setData(odata);
						cmbUser.setModel(oModelDataUser);
						//	cmbUser.bindAggregation("suggestionItems", "/results");
						cmbUser.bindAggregation("suggestionItems", {
							path: "/results",
							template: new sap.ui.core.Item({
								text: "{NameFirst} {NameLast}({Bname})",
								//	key : "{Bname}"
							})
						});
					},
					error: function () {
						MessageBox.error("error");
					},

				});

			}

		},

		OnSelectUserReviwe2: function (oEvent) {

			var that = this;
			var oModel = this.getView().getModel();
			var oModelDataUser = new sap.ui.model.json.JSONModel();
			var SearchText = oEvent.getSource().getValue();

			var cmbUserR = sap.ui.getCore().byId("cmbUserR");

			var otableUser = sap.ui.getCore().byId("tblUserReview2");
			//	var selectedItems = cmbUserR.getTokens()
			var item = {};
			var values = "";

			var filters = [];
			if (SearchText.length >= 3) {
				var oBname = new sap.ui.model.Filter("Bname", "EQ", SearchText);
				filters.push(oBname);

				oModel.read("/UserSearchSet", {
					filters: filters,
					success: function (odata, oResponse) {

						oModelDataUser.setData(odata);
						cmbUserR.setModel(oModelDataUser);
						cmbUserR.bindAggregation("suggestionItems", {
							path: "/results",
							template: new sap.ui.core.Item({
								text: "{NameFirst} {NameLast}({Bname})",

							})

						});
						//	that.GetUserSelectedItems(cmbUserR.getSuggestionItems());

					},
					error: function () {
						MessageBox.error("error");
					},

				});

				/*						cmbUserR.setFilterFunction(function (sTerm, oItem) {
								// A case-insensitive 'string contains' filter
								var sItemText = oItem.getText().toLowerCase(),
									sSearchTerm = sTerm.toLowerCase();

								return sItemText.indexOf(sSearchTerm) > -1;
							});
				*/
			}

		},
		GetUserSelectedItems: function (oEvent) {

			var oModelDataUser = new sap.ui.model.json.JSONModel();
			var cmbUserR = sap.ui.getCore().byId("cmbUserR");
			var selectedItems = cmbUserR.getTokens();

			var otableUser = sap.ui.getCore().byId("tblUserReview2");
			//	var selectedItems = cmbUserR.getTokens()
			var item = {};
			var values = "";
			if (selectedItems.length > 0) {
				for (var i = 0; i < selectedItems.length; i++) {
					var oText = selectedItems[i].getText();

					var myFirstNamearray = [];
					myFirstNamearray = oText.toString().split("(");
					//	var myNamearray =myFirstNamearray[0].split(" ");

					var searchtext1 = '(';
					var searchtext2 = ')';
					var pos1 = oText.indexOf(searchtext1);
					var pos2 = oText.indexOf(searchtext2);
					var POQueyToGetValue = oText.substring(pos1 + 1, pos2);

					if (values.results === undefined) {
						values = {
							results: []

						};
					}
					item = {
						"Bname": POQueyToGetValue,
						"UserName": myFirstNamearray[0],
						//	"FirstName": myNamearray[0],
						//	"LastName": myNamearray[1]

					};

					values.results.push(item);
					oModelDataUser.setData(values);
					otableUser.setModel(oModelDataUser);
				}
			} else {
				otableUser.setModel(null);
			}

			/*	var oModelDataUser = new sap.ui.model.json.JSONModel();
					var cmbUserR = sap.ui.getCore().byId("cmbUserR");
				var selectedItems = oEvent.getParameter("selectedItem").getText();

				var otableUser = sap.ui.getCore().byId("tblUserReview2");
				//	var selectedItems = cmbUserR.getTokens()
				var item = {};
				var values = "";
					var myFirstNamearray = [];
					myFirstNamearray = selectedItems.toString().split("(");
					
						var searchtext1 = '(';
					var searchtext2 = ')';
					var pos1 = selectedItems.indexOf(searchtext1);
					var pos2 = selectedItems.indexOf(searchtext2);
					var POQueyToGetValue = selectedItems.substring(pos1 + 1, pos2);
					
						if (values.results === undefined) {
						values = {
							results: []

						};
					}
					item = {
						"Bname": POQueyToGetValue,
						"UserName": myFirstNamearray[0],
					//	"FirstName": myNamearray[0],
					//	"LastName": myNamearray[1]

					};

					values.results.push(item);
					oModelDataUser.setData(values);
					otableUser.setModel(oModelDataUser);*/

			/*	if(selectedItems.length > 0){
						for (var i = 0; i < selectedItems.length; i++) {
					var oText = selectedItems[i].getText();

					var myFirstNamearray = [];
					myFirstNamearray = oText.toString().split("(");
				//	var myNamearray =myFirstNamearray[0].split(" ");
				
					
					var searchtext1 = '(';
					var searchtext2 = ')';
					var pos1 = oText.indexOf(searchtext1);
					var pos2 = oText.indexOf(searchtext2);
					var POQueyToGetValue = oText.substring(pos1 + 1, pos2);

					if (values.results === undefined) {
						values = {
							results: []

						};
					}
					item = {
						"Bname": POQueyToGetValue,
						"UserName": myFirstNamearray[0],
					//	"FirstName": myNamearray[0],
					//	"LastName": myNamearray[1]

					};

					values.results.push(item);
					oModelDataUser.setData(values);
					otableUser.setModel(oModelDataUser);
				}
				}else{
					otableUser.setModel(null);
				}
			*/
		}

	});

});