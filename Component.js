sap.ui.define([
	'sap/ui/core/UIComponent'
], function(Component) {
	
	var N_MAX_MINS = 9; // max 4 characters are shown by NumericContent
	
	function getAbsoluteFilePath(sRelativeFilePath) {
			var oApplicationRoot = jQuery.sap.getModulePath("ui5con.flp.customtile");
			return oApplicationRoot + "/" + sRelativeFilePath;
	}
	
	function logParseError(sStartTime) {
		jQuery.sap.log.error("configured startTime '" + sStartTime + "' could not be parsed. Format should be '0:00'.", 
			null, "ui5con.flp.customtile");
	}
	
	function parseStartTime(sStartTime) {
		var aStartTime,
			nMins = N_MAX_MINS,
			nSecs = 0,
			nTempMins,
			nTempSecs;
			
		if (sStartTime) {
			aStartTime = /(\d):(\d\d)/.exec(sStartTime);
			if (aStartTime) {
				nTempMins = parseInt(aStartTime[1], 10);
				nTempSecs = parseInt(aStartTime[2], 10);
				
				if (isNaN(nTempMins) || isNaN(nTempSecs)) {
					logParseError(sStartTime);
				} else {
					// both values are fine
					nMins = nTempMins;
					nSecs = nTempSecs;
				}
			} else {
				logParseError(sStartTime);
			}
		}
		
		return {
			mins: nMins, 
			secs: nSecs
		};
	}
	
	return Component.extend("ui5con.flp.customtile.Component", {
		metadata: {
			manifest: "json"
		},
		
		createContent: function () {
			var oView = sap.ui.xmlview({
				viewName: "ui5con.flp.customtile.CustomTile"
			});
			
			// set the image dynamicly to avoid dependency to deployment location
			oView.byId("tile")
				.setBackgroundImage(
					getAbsoluteFilePath("imgs/ui5-logo-light-left.png")
				);
			
			return oView;
		},

		init: function () {
			Component.prototype.init.apply(this, arguments);
		},
		
		// Recommendation: Encapsulate reading of ComponentData in getters 
		// as the structure may change
		
		getStartTime: function () {
			var oComponentProperties = this.getComponentData().properties || {};
			var sStartTime = oComponentProperties.startTime;
			
			// note: checking for max values is up to the controller 
			return parseStartTime(sStartTime);
		},
		
		getTitle: function () {
			var oComponentProperties = this.getComponentData().properties || {};
			return oComponentProperties.title; 
		},
		
		getTargetUrl: function () {
			var oComponentProperties = this.getComponentData().properties || {};
			return oComponentProperties.navigation_target_url;
		},
		
		getMaxMins: function () {
			return N_MAX_MINS;
		}
	});
});