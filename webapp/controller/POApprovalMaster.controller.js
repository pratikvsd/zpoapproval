sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'POApproval/ZPOApproval/utils/Formatter',
	'sap/ui/model/Filter',
	'sap/m/MessageToast',
	"sap/m/MessageBox",
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/routing/History"
], function (Controller, Formatter, Filter, MessageToast, MessageBox, JSONModel, History) {
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
			this._UserID = "PURCHASE2";

		},

		onBeforeRendering: function () {
		
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZVECV_PURCHASE_ORDER_APPROVAL_SRV/", true);
			this.getView().setModel(oModel);

			var oList = this.getView().byId("listPO");
			var filters = [];

			var oUserID = new sap.ui.model.Filter("UserID", "EQ", this._UserID);
			filters.push(oUserID);

			oModel.read("/MyPOListSet", {
				filters: filters,
				success: function (odata, oResponse) {
					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(odata);
					oList.setModel(oModelData);
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
			});
		},

		onSelectionChange: function (e) {

			var PoNo = e.getParameters().listItem.getTitle();
			var PoStatus = e.getParameters().listItem.getFirstStatus().getText();
			var postatus = "";
			if (PoStatus === "In Query") {
				postatus = "Q";
			} else if (PoStatus === "In Approval") {
				postatus = "A";
			}

			this.getRouter().navTo("POApprovalDetail", {
				PO_No: PoNo,
				PO_Status: postatus
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
			var postatus = "";
			if (objEdit.PO_Status === "In Query") {
				postatus = "Q";
			} else if (objEdit.PO_Status === "In Approval") {
				postatus = "A";
			}
			this.getRouter().navTo("POApprovalDetail", {
				PO_No: objEdit.PO_No,
				PO_Status: postatus
			});

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

			if (!this._oDialogFilter) {
				this._oDialogFilter = sap.ui.xmlfragment("POApproval.ZPOApproval.fragments.Filter", this);
				this._oDialogFilter.setModel(this.getView().getModel());
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogFilter);
			this._oDialogFilter.open();

		},

		handleConfirm: function (oEvent) {
			var query = oEvent.getSource().getSelectedFilterItems();
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