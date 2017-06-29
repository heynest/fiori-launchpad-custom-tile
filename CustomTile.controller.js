sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	var N_MAX_MINS;
	var oModel;
	
	/**
	 * Sets the new countdown and ensures that only values are set which are in range;
	 */ 
	function setCountdown(nMins, nSecs) {
		nSecs = Math.max(nSecs, 0);
		nSecs = Math.min(nSecs, 59);
		nMins = Math.max(nMins, 0);
		if (nMins >= N_MAX_MINS) {
			nMins = N_MAX_MINS;
			nSecs = 0; // do not exeed maximum
		}
		
		oModel.setProperty("/mins", nMins);
		oModel.setProperty("/secs", nSecs);
	}
	
	function countDown() {
		var nMins = oModel.getProperty("/mins");
		var nSecs = oModel.getProperty("/secs");
		
		if (nSecs <= 0 && nMins > 0) {
			nSecs = 59;
			nMins -= 1;
		} else {
			nSecs -= 1;
		}
		
		setCountdown(nMins, nSecs);
	}
	
	function addMins(nAddedMins) {
		var nMins = oModel.getProperty("/mins"), 
			nSecs = oModel.getProperty("/secs");
		
		nAddedMins = nAddedMins || 1;
		setCountdown(nMins + nAddedMins, nSecs);
	}

	return Controller.extend("ui5con.flp.customtile.CustomTile", {

		onInit: function() {
			var oComponent = this.getOwnerComponent(),
				oStartTime = oComponent.getStartTime();
				
			// set "globals"
			N_MAX_MINS = oComponent.getMaxMins();
			oModel = new JSONModel({
				mins: 0,
				secs: 0,
				title: oComponent.getTitle() || "ui5con",
				targetUrl: oComponent.getTargetUrl()
			});
			
			// use setCountDown before the model is set, so no invalid times
			// are ever visble to the user
			setCountdown(oStartTime.mins, oStartTime.secs);
			oComponent.setModel(oModel);
			
			// decrease countdown every second
			setInterval(countDown, 1000);
		},

		onTilePressed: function() {
			// var sTargetUrl = oEvent.getSource().data("href");
			addMins(1);
		}
	});

});