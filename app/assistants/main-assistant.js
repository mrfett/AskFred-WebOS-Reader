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

MainAssistant.prototype.setupCommandMenu = function() {
	this.controller.setupWidget(Mojo.Menu.viewMenu, undefined, 
	                                   		{items:	[{label:'Results', submenu:'type-menu'},
											    	 {label:$L('Change Region'), submenu:'category-menu'}]});

	this.categoryMenuModel = { onChoose: MainAssistant.prototype.popupHandler, items: [
		{label: $L('All'), command:'cat-all'}, 
        {label: $L('Midwest'), command:'cat-midwest'}, 
        {label: $L('New York City'), command:'cat-nyc'}, 
        {label: $L('Mid Atlantic'), command:'cat-midatlantic'},
		// {label: $L('Mid Atlantic'), command:'cat-national'},
		// {label: $L('Non-US'), command:'cat-nonus'},
		// {label: $L('North Atlantic'), command:'cat-northatlantic'},
		// {label: $L('Pacific Coast'), command:'cat-pacificcoast'},
		// {label: $L('Rocky Mountain'), command:'cat-rockymountain'},
		// {label: $L('South East'), command:'cat-southeast'},
		// {label: $L('South West'), command:'cat-southwest'},
	]};

	this.typeMenuModel = { label: $L('Type'), items: [
		{label: 'Upcoming Events', command: 'upcoming'},
		{label: 'Results', command: 'results'}
	]};
	
	this.controller.setupWidget('category-menu', Mojo.Event.command, this.categoryMenuModel);
	this.controller.setupWidget('type-menu', Mojo.Event.command, this.typeMenuModel);	
}

// MainAssistant.prototype.handleCommand = function() {
	// console.info('+++++ Expecting: ' + event.type + ' +++++');
	// console.info('+++++ To equal: ' + Mojo.Event.command + ' +++++')
	// console.info('+++++ Command: ' + event.command + '  +++++');
	// // if(event.type === Mojo.Event.command) {
	// if(event.type === 'mojo-tap') {
		// switch(event.command)
		// {
			// case 'cat-all':
				// this.url = all;
				// console.info('======= SELECTED ALL');
			// break;
			// case 'cat-midwest':
				// url = midwest;
				// console.info('======= SELECTED MIDWEST');
			// break;
			// case 'cat-nyc':
				// url = nyc;
				// console.info('======= SELECTED NYC');
			// break;
			// // case 'cat-unfiled':
				// // this.controller.get('message').update('Unfiled selected')
			// // break;
			// default:
				// Mojo.Controller.errorDialog("Got command " + event.command);
				// console.info('XXXXXX NOTHING SELECTED');
			// break;
		// }
	// }
// 	
	// // url = midwest;
	// this.getRss(url);
// }


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
	
	$('rssText').update("Getting xml...");
	
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
	this.setupCommandMenu();
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
