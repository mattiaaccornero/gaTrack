#gaTrack - Google Analytics Tracker (GA)

![Google Analytics Tracker](http://macco.me/res/data/imgs/plugin_gatrack.jpg "Google Analytics Tracker")

© 2009 Created by [Mattia Accornero](http://macco.me/ "Personal website") for Kora

===
Requires jQuery 1.2.x or higher (for cross-domain GAscript $.getScript)


###Usage:

####Normal use:
`$.gaTrack('UA-XXXXX-XX');`

####Advance use:
`$.gaTrack(
		'UA-XXXXX-XX',
		{
			download:	'/downloads/',
			extensions:	[
				'pdf','doc','xls','csv','jpg','gif', 'mp3', 'swf','txt','ppt','zip','gz','dmg','xml'		
			],
			cd_active: false,
			cd_domainname: "none"
		}
);`

####Getting tracker instance:
`$.gaTrackers['UA-XXXXX-XX']._trackPageview();`

