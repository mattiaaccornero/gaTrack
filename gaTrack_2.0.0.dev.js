// gaTrack - Google Analytics Tracker (GA)
// (c)2009 Created by Mattia Accornero for Kora
//
// Requires jQuery 1.2.x or higher (for cross-domain GAscript $.getScript)
//
// Usage:
// 
// Normal use:
// $.gaTrack('UA-XXXXX-XX');
// 
// Advance use:
// $.gaTrack(
//		'UA-XXXXX-XX',
//		{
//			download:	'/downloads/',
//			extensions:	[
//				'pdf','doc','xls','csv','jpg','gif', 'mp3', 'swf','txt','ppt','zip','gz','dmg','xml'		
//			],
//			cd_active: false,
//			cd_domainname: "none"
//		}
// );
//
// Getting tracker instance:
// $.gaTrackers['UA-XXXXX-XX']._trackPageview();


(function ($) {
    $.gaTrackers = {};
    $.gaTrack = function (code, opts) {

        opts = jQuery.extend({
            external: '/external/',
            mailto: '/mailto/',
            download: '/downloadtracking/',
            extensions: [
					'pdf', 'doc', 'xls', 'csv', 'swf', 'txt', 'ppt', 'zip', 'gz', 'dmg', 'xml'
			],
            cd_active: false, //use if you want to active tracking between different domains (cross-domain)
            cd_domainname: "none" //set the domainname (cross-domain use)
        }, opts);

        // add tracking code to the current page
        function addTracking() {
            var pageTracker = _gat._getTracker(code);
            if (opts.cd_active) {
                pageTracker._setDomainName(opts.cd_domainname);
                if (opts.cd_domainname == "none") {
                    pageTracker._setAllowLinker(true);
                } else if (opts.cd_domainname.substr(0, 1) == ".") {
                    pageTracker._setAllowHash(false);
                };
            };
            pageTracker._initData();
            pageTracker._setLocalRemoteServerMode();
            pageTracker._setSiteSpeedSampleRate(100);
            pageTracker._trackPageview();

            // examine every link in the page
            $('a').each(function () {
                var _self = $(this);
                var u = _self.attr('href');
                var isDownload = false;
                var isMailto = false;
                var isExternal = false;

                if (typeof (u) != 'undefined') {
                    if (u.indexOf("?") != -1) {
                        uext = u.substring(0, u.lastIndexOf("?"));
                    } else {
                        uext = u;
                    };

                    if (uext.indexOf('://') == -1 && uext.indexOf('mailto:') != 0) {
                        var ext = uext.split('.')[uext.split('.').length - 1];
                        var exts = opts.extensions;

                        //check extensions
                        for (i = 0; i < exts.length; i++) {
                            if (ext == exts[i]) {
                                _self.click(function () {
                                    pageTracker._trackPageview(opts.download + cleanURL(_self.attr('href')));
                                    /*console.log(opts.download + cleanURL(_self.attr('href')));
                                    return false;*/
                                });
                                isDownload = true;
                                break;
                            };
                        };
                    }
                    else {
                        if (uext.indexOf('mailto:') == 0) {
                            _self.click(function () {
                                pageTracker._trackPageview(opts.mailto + cleanURL(_self.attr('href').substring(7, _self.attr('href').length)));
                                /*console.log(opts.mailto + cleanURL(_self.attr('href').substring(7, _self.attr('href').length)));
                                return false;*/
                            });
                            isMailto = true;
                        }
                        else {
                            var regex = /([^:\/]+)*(?::\/\/)*([^:\/]+)(:[0-9]+)*\/?/i;
                            var linkparts = regex.exec(uext);
                            var urlparts = regex.exec(location.href);
                            if (linkparts[2] != urlparts[2]) {
                                _self.click(function () {
                                    pageTracker._trackPageview(opts.external + cleanURL(_self.attr('href')));
                                    /*console.log(opts.external + cleanURL(_self.attr('href')));
                                    return false;*/
                                });
                                isExternal = true;
                            }
                        }
                    }

                    if (!isDownload && !isExternal && !isMailto && opts.cd_active && (opts.cd_domainname == "none")) {
                        $(this).click(function () {
                            pageTracker._link(u);
                            return false;
                        });
                    };

                };
            });
            $.gaTrackers[code] = pageTracker;
        };
        function cleanURL(link_href) {
            if (link_href.substring(0, 1) == '/') {
                return link_href.substring(1, link_href.length);
            } else {
                return link_href;
            }
        };
        // include the external GA script in try/catch to play nice
        function initGA() {
            try {
                // determine whether to include the normal or SSL version
                var gaURL = (location.href.indexOf('https') == 0 ? 'https://' : 'http://');
                gaURL += 'stats.g.doubleclick.net/dc.js';

                // include the script
                $.getScript(gaURL, function () {
                    addTracking();
                });
            } catch (err) {
                // log any failure
                console.log('Failed to load Google Analytics:' + err);
            };
        };

        initGA();
    };
})(jQuery);
