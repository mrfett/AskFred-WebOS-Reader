var midwest = "http://askfred.net/rss/future.php?sec_id=7";
var greatLakes = "http://askfred.net/rss/future.php?sec_id=4";
var nyc = "http://askfred.net/rss/future.php?sec_id=5";
var midAtlantic = "http://askfred.net/rss/future.php?sec_id=6";
var national = "http://askfred.net/rss/future.php?sec_id=12";
var nonUS = "http://askfred.net/rss/future.php?sec_id=12";
var northAtlantic = "http://askfred.net/rss/future.php?sec_id=8";
var pacificCoast = "http://askfred.net/rss/future.php?sec_id=2";
var pacificNorthwest = "http://askfred.net/rss/future.php?sec_id=1";
var rockyMountain = "http://askfred.net/rss/future.php?sec_id=9";
var southEast = "http://askfred.net/rss/future.php?sec_id=10";
var southWest = "http://askfred.net/rss/future.php?sec_id=11";
var all = "http://askfred.net/rss/future.php";
console.info('******* Variables Loaded');

var url = all;

function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}


MainAssistant.prototype.popupHandler = function(command) {
	console.info('+++++ Command is: ' + command);
	switch(command)
	{
		case 'cat-all':
			this.url = all;
			console.info('======= SELECTED ALL');
		break;
		case 'cat-midwest':
			url = midwest;
			console.info('======= SELECTED MIDWEST');
		break;
		case 'cat-nyc':
			url = nyc;
			console.info('======= SELECTED NYC');
		break;
		// case 'cat-unfiled':
			// this.controller.get('message').update('Unfiled selected')
		// break;
		default:
			Mojo.Controller.errorDialog("Got command " + event.command);
			console.info('XXXXXX NOTHING SELECTED');
		break;
	}

	
	// url = midwest;
	this.getRss(url);
}



MainAssistant.prototype.getRss = function(currentUrl) {
	
	$('rssText').update("Downloading xml...");
	
	var request = new Ajax.Request(currentUrl, {
		method: 'get',
		evalJSON: 'force', //to enforce parsing JSON if there is JSON response
		onCreate: function(){console.info('******* onCreate happened')},
		onLoading: function(){console.info('******* onLoading happened')},
		onLoaded: function(){console.info('******* onLodaed happened')},
		onSuccess: function(){console.info('******* onComplete happened')},
		onComplete: this.gotResults.bind(this),
		onFailure: this.failure.bind(this)
	});
}

MainAssistant.prototype.gotResults = function(transport) {
	// Use responseText, not responseXML!! try: reponseJSON 
	var xmlstring = transport.responseText;	
	
	$('rssText').update(xmlstring);

	// Convert the string to an XML object
	var xmlobject = (new DOMParser()).parseFromString(xmlstring, "text/xml");
	
	var items = xmlobject.getElementsByTagName("item");
	
	var titles = xmlobject.getElementsByTagName("title");
	
	var output = "<dl>";

	for (i = 0; i < items.length; i++) {
		var title = items[i].getElementsByTagName("title")[0].firstChild.textContent;
		var link = items[i].getElementsByTagName("link")[0].firstChild.textContent;
		var description = items[i].getElementsByTagName("description")[0].firstChild.textContent;
		
		output += '<dt>' + title + '</dt>';
		output += '<dd>' + description + '<a href="' + link + '" title="' + title + '">View on askfred</a></dd>';
	}
	output += "</dl>";
	
	$('rssText').update(output);
}

MainAssistant.prototype.failure = function() {
	$('rssText').update('Failure getting rss feed at "' + this.url + '"');
}

MainAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
	$('rssText').update("testing.....");
	this.getRss(url);
	//this.setupMenu();
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	this.controller.setupWidget(Mojo.Menu.viewMenu,
	  	this.attributes = {
	    	spacerHeight: 20,
	    	menuClass: 'no-fade',
		},
		this.model = {
			visible: true,
			items: [
	        	{width: Mojo.Environment.DeviceInfo.screenWidth, command: "one", items: [
	        		{label: "Upcoming", width: Mojo.Environment.DeviceInfo.screenWidth / 2, command: "upcoming"},
        			{label: "Region", width: Mojo.Environment.DeviceInfo.screenWidth / 2, command: "changeRegion"}
        		]}
	        ]
		}
	);
	/* add event handlers to listen to events from widgets */
}


MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
	this.controller.handleCommand = function(event) {
		console.info('xxxx Expecting: ' + event.type + " xxxx");
		console.info('xxxx To equal: ' + Mojo.Event.command + " xxxx");
		console.info('xxxx Command is:' + event.command);
		if (event.type === Mojo.Event.command) {
	    	switch (event.command) {
	      		case "changeRegion":
					console.info('xxxx Change Region has been chosen xxxx');
					this.popupSubmenu({
				      onChoose: MainAssistant.prototype.popupHandler,
				      // placeNear: event.target,
				      items: [
				        {label: 'All Regions', command: 'all'},
				        {label: 'Midwest', command: 'midwest'},
				        {label: 'Great Lakes', command: 'greatLakes'},
				        {label: 'Metropolitan NYC', command: 'nyc'},
				        {label: 'Mid-Atlantic', command: 'midatlantic'},
				        {label: 'USA', command: 'national'},
				        {label: 'Non-USA', command: 'nonUS'},
				        {label: 'North-Atlantic', command: 'northAtlantic'},
				        {label: 'Pacific Coast', command: 'pacificCoast'},
				        {label: 'Pacific Northwest', command: 'pacificNorthwest'},
				        {label: 'Rocky Mountain', command: 'rockyMountain'},
				        {label: 'Southeast', command: 'southEast'},
				        {label: 'Southwest', command: 'southWest'},
				      ]
				    });
					break;
	        	default:
	        		console.info('xxxx Default Switch xxxx');
					break;
	      	}
	  	}
	};
	
	MainAssistant.prototype.popupHandler = function(command) {
		console.info("++++ Command is: " + command);
		switch(command) {
			case "all":
				url = all;
				break;
			case "midwest":
				url=midwest;
				break;
			case "greatLakes":
				url=greatLakes;
				break;
			case "nyc":
				url=nyc;
				break;
			case "midAtlantic":
				url = midAtlantic;
				break;
			case "national":
				url = national;
				break;
			case "nonUS":
				url = nonUS;
				break;
			case "northAtlantic":
				url = northAtlantic;
				break;
			case "pacificCoast":
				url = pacificCoast;
				break;
			case "pacificNorthwest":
				url = pacificNorthwest;
				break;
			case "rockyMountain":
				url = rockyMountain;
				break;
			case "southEast":
				url = southEast;
				break;
			case "southWest":
				url = southWest;
				break;
			default:
				url = all;
				console.info("---- No case matched");
				break;				
		};
		console.info("---- Variable loaded:" + url);
		Mojo.Menu.viewMenu.model = {
			visible: true,
			items: [
	        	{width: Mojo.Environment.DeviceInfo.screenWidth, command: "one", items: [
	        		{label: "Upcoming", width: Mojo.Environment.DeviceInfo.screenWidth / 2, command: "upcoming"},
        			{label: command, width: Mojo.Environment.DeviceInfo.screenWidth / 2, command: "changeRegion"}
        		]}
	        ]
		}
		this.controller.modelChanged(Mojo.Menu.viewMenu.model);
		this.getRss(url);
	};
		
}

MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
