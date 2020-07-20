sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'POApproval/ZPOApproval/utils/Formatter',
	'sap/ui/model/Filter',
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel',
		"sap/ui/core/routing/History"
], function (Controller, Formatter, Filter, MessageToast, MessageBox, JSONModel,History) {
	"use strict";

	return Controller.extend("POApproval.ZPOApproval.controller.POApprovalMaster", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		onInit: function () {
			var that = this;
			
		//	this._UserID = sap.ushell.Container.getService("UserInfo").getId();
		this._UserID = "PURCHASE1";
	//		this._UserID = "COCKPIT2_1";
			
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);

			var oList = this.getView().byId("listPO");
			var filters = [];

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			var oUser_dept = this.getView().byId("lblUser_dept");
			filters.push(oUserID);

			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {
					var aItems = oList.getItems();
					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oList.setModel(oModelData);
					//oUser_dept.setText(odata.results[0].User_Dept);

				},
				error: function () {
					//	MessageBox.error("error");
				}

			});

			oList.attachUpdateFinished(function (oEvent) {

				var aItems = oEvent.getSource().getItems();
				if (aItems.length > 0) {
					oEvent.getSource().getItems()[0].setSelected(true);
					oEvent.getSource().getItems()[0].firePress();
				} 

				//	oEvent.getSource().getItems()[0].getSelectedItem(true);

				/*var OUserDept = oUser_dept.getText();
				var oQueryButton1 = sap.ui.getCore().byId("__xmlview1--btnQuery");
				var oQueryButton2 = sap.ui.getCore().byId("__xmlview0--btnQuery");

				var oReviewbButton1 = sap.ui.getCore().byId("__xmlview1--btnReview");
				var oReviewbButton2 = sap.ui.getCore().byId("__xmlview0--btnReview");

				var oApproveButton1 = sap.ui.getCore().byId("__xmlview1--btnApprove");
				var oApproveButton2 = sap.ui.getCore().byId("__xmlview0--btnApprove");

				var oRejectButton1 = sap.ui.getCore().byId("__xmlview1--btnReject");
				var oRejectButton2 = sap.ui.getCore().byId("__xmlview0--btnReject");
*/
				/*	if (OUserDept === "PUR") {
						if (oReviewbButton1 !== undefined && oApproveButton1 !== undefined && oRejectButton1 !== undefined) {
							oReviewbButton1.setVisible(false);
							oApproveButton1.setVisible(true);
							oRejectButton1.setVisible(true);
						} else if (oReviewbButton2 !== undefined && oApproveButton2 !== undefined && oRejectButton2 !== undefined) {
							oReviewbButton2.setVisible(false);
							oApproveButton2.setVisible(true);
							oRejectButton2.setVisible(true);
						}
					} else if (OUserDept === "REV1" || OUserDept === "REV2") {
						if (oReviewbButton1 !== undefined && oApproveButton1 !== undefined && oRejectButton1 !== undefined) {
							oReviewbButton1.setVisible(true);
							oApproveButton1.setVisible(false);
							oRejectButton1.setVisible(false);
						} else if (oReviewbButton2 !== undefined && oApproveButton2 !== undefined && oRejectButton2 !== undefined) {
							oReviewbButton2.setVisible(true);
							oApproveButton2.setVisible(false);
							oRejectButton2.setVisible(false);
						}
					}*/

			});

		},
		
	

		onSelectionChange: function (e) {
			var oList = this.getView().byId("listPO");

			var PoNo = e.getParameters().listItem.getTitle();
			//	var oViewID = this.getView().byId("listPO").sId;

			this.getRouter().navTo("POApprovalDetail", {
				PO_No: PoNo,
				//	oViewID: oViewID
			});

			if (this._prevSelect) {
				this._prevSelect.$().css('background-color', '');

			}
			var item = e.getParameter('listItem');
			item.$().css('background-color', '#D3D3D3');

			this._prevSelect = item;

		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onListItemPress: function (oEvent) {

			var objEdit = oEvent.getSource().getBindingContext().getObject();
			this.getRouter().navTo("POApprovalDetail", {
				PO_No: objEdit.PO_No
			});
			/*	if (objEdit.PO_Status == "In Approval") {
					oApproveButton.setVisible(true);
					oApproveReject.setVisible(true);
				} else if(objEdit.PO_Status == "In Query") {
							oApproveButton.setVisible(false);
					oApproveReject.setVisible(false);
				}*/

		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			var oFilter = new sap.ui.model.Filter({
				// two filters
				filters: [
					new sap.ui.model.Filter("PO_No", sap.ui.model.FilterOperator.Contains, sQuery), // filter for value 1
				]
			});
			var oBinding = this.byId("listPO").getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},

		handleOpenDialog: function (oEvent) {

			var oButton = oEvent.getSource();
			if (!this._oDialogFilter) {
				this._oDialogFilter = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Filter", this);
				this._oDialogFilter.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogFilter);
			this._oDialogFilter.open();

		},

		handleConfirm: function (oEvent) {
			var oModel = this.getView().getModel();
			var that = this;
			var query = oEvent.getSource().getSelectedFilterItems();
			var oList = this.byId("listPO");
			var oBinding = this.byId("listPO").getBinding("items");
			if (query.length > 0) {
				var oFilter = new sap.ui.model.Filter({
					filters: [
						new sap.ui.model.Filter("PO_Status", sap.ui.model.FilterOperator.EQ, query[0].getText()), // filter for value 1
					]
				});
				oBinding.filter(oFilter);
			} else {
				oBinding.filter([]);
			}
		},

		

		/*		handleConfirm: function (oEvent) {
					var oView = this.getView();
					var oList = oView.byId("listPO");
					var mParams = oEvent.getParameters();
					var oBinding = oList.getBinding("items");
					var aFilters = [];
					
					for (var i = 0, l = mParams.filterItems.length; i < l; i++) {
						var oItem = mParams.filterItems[i];
						var aSplit = oItem.getKey().split("___");
						var sPath = aSplit[0];
						var vOperator = aSplit[1];
						var vValue1 = aSplit[2];
						var vValue2 = aSplit[3];
						var oFilter = new sap.ui.model.Filter(sPath, vOperator, vValue1, vValue2);
						aFilters.push(oFilter);
					}
					oBinding.filter(aFilters);
				},*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf POApproval.ZPOApproval.view.POApprovalMaster
		 */
		//	onExit: function() {
		//
		//	}

	});

});