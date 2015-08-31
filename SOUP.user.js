// ==UserScript==
// @name        Stack Overflow Unofficial Patch
// @namespace   https://github.com/vyznev/
// @description Miscellaneous client-side fixes for bugs on Stack Exchange sites
// @author      Ilmari Karonen
// @version     1.34.0
// @copyright   2014-2015, Ilmari Karonen (http://stackapps.com/users/10283/ilmari-karonen)
// @license     ISC; http://opensource.org/licenses/ISC
// @match       *://*.stackexchange.com/*
// @match       *://*.stackoverflow.com/*
// @match       *://*.superuser.com/*
// @match       *://*.serverfault.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.askubuntu.com/*
// @homepageURL http://stackapps.com/questions/4486/stack-overflow-unofficial-patch
// @updateURL   https://github.com/vyznev/soup/raw/master/SOUP.meta.js
// @downloadURL https://github.com/vyznev/soup/raw/master/SOUP.user.js
// @icon        https://github.com/vyznev/soup/raw/master/icon/SOUP_icon_128.png
// @grant       none
// @run-at      document-start
// ==/UserScript==


// Copyright (C) 2014 Ilmari Karonen and other contributors
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

// In addition to the license granted above, I, Ilmari Karonen, to the extent I
// am authorized to do so, and subject to the disclaimer stated above, hereby
// grant Stack Exchange, Inc. permission to make use of this software in any
// way they see fit, including but not limited to incorporating all or parts of
// it within the Stack Exchange codebase, with or without credit to myself.
// This permission grant does not extend to any code written by third parties,
// unless said parties also agree to it.


( function () {  // start of anonymous wrapper function (needed to restrict variable scope on Opera)

// Opera does not support @match, so re-check that we're on an SE site before doing anything
var include_re = /(^|\.)((stack(exchange|overflow|apps)|superuser|serverfault|askubuntu)\.com|mathoverflow\.net)$/;
if ( ! include_re.test( location.hostname ) ) return;

var fixes = {};

//
// CSS-only fixes (injected *before* site CSS!):
//
fixes.mse215473 = {
	title:	"Add a non-breaking space to “reopen (1)” and its ilk",
	url:	"http://meta.stackexchange.com/q/215473",
	css:	".post-menu > a { white-space: nowrap }" +
		".post-menu > .lsep:after { content: ' '; font-size: 0px }"
};
fixes.mse114109 = {
	title:	"Background in OP's user name can obscure text in multiline comments",
	url:	"http://meta.stackexchange.com/q/114109",
	// NOTE 2014-11-26: this has been mostly fixed by increasing line-height in comments; remove this fix?
	css:	".comment-copy { position: relative }"
};
fixes.mse143973 = {
	title:	"Images can be pushed outside the boundaries of a post by using nested lists",
	url:	"http://meta.stackexchange.com/q/143973",
	credit:	"animuson",
	// "body" added to increase selector precedence above conflicting SE style
	css:	"body .post-text img, body .wmd-preview img { max-width: 100% }"
};
fixes.mse145819 = {
	title:	"<hr/>'s do not get rendered in deleted answers",
	url:	"http://meta.stackexchange.com/q/145819",
	css:	".wmd-preview hr { background-color: #ddd; color: #ddd }" +
		".deleted-answer .post-text hr, .deleted-answer .wmd-preview hr " +
		"{ background-color: #c3c3c3; color: #c3c3c3 }"
};
fixes.mse108046 = {
	title:	"Mouse cursor doesn't change to pointer when hovering “full site” on mobile",
	url:	"http://meta.stackexchange.com/q/108046",
	// NOTE 2014-11-26: this is also partially fixed, but e.g. comment delete links still have the wrong cursor
	css:	"a[onclick], a:not([name]) { cursor: pointer }"
};
// The following fix is mostly made redundant by mse217779, but is included for
// users with site JS disabled, and to mitigate the loading delay of the JS
// component of mse217779:
fixes.mse110566 = {
	title:	"Does the spoiler markdown work on images?",
	url:	"http://meta.stackexchange.com/q/110566",
	// NOTE 2014-11-26: this is fixed on some sites, but still broken e.g. on SO
	css:	".spoiler:not(:hover) img { visibility: hidden }"
};
fixes.mse58760 = {
	title:	"<kbd> (yes, still <kbd>) doesn't play nice with lists",
	url:	"http://meta.stackexchange.com/q/58760",
	credit:	"Krazer",
	// NOTE 2014-11-26: the main issue seems to have been fixed, but the secondary width/white-space issues still exist; report as new bug?
	// "body" added to increase selector precedence above conflicting SE style
	css:	"body kbd { display: inline-block; max-width: 100%; white-space: normal }"
};
fixes.mse203405 = {
	title:	"Excerpt of privilege is below privilege instead of in front",
	url:	"http://meta.stackexchange.com/q/203405",
	css:	".privileges-page #privilege-table { display: table }" +
		".privileges-page .privilege-table-row { display: table-row }" +
		".privileges-page .privilege-table-row div:not(.checkmark)" +
		" { display: table-cell; padding: 1em 0.2em }"
}
fixes.mse210165 = {
	title:	"Extra blue line appearing in the top bar (Firefox only)",
	url:	"http://meta.stackexchange.com/q/210165",
	css:	".topbar .hidden-text { display: none }" +
		".topbar .topbar-icon, .topbar .profile-me { color: #e0e0e0 }"
};
fixes.mse154788 = {
	title:	"Why are comments overlapping the sidebar?",
	url:	"http://meta.stackexchange.com/q/154788",
	// XXX: padding added to work around issue with spurious scroll bars in Chrome; see http://meta.stackexchange.com/q/240352
	css:	".comment-body { max-width: 628px; padding: 0 2px 2px 0; overflow: auto; overflow-y: hidden; word-wrap: break-word }"
};
fixes.mse214830 = {
	title:	"Selecting text in profile activity comments causes unexpected clipping",
	url:	"http://meta.stackexchange.com/q/214830",
	css:	"span.comments { padding-bottom: 0 }"
};
fixes.mse230392 = {
	title:	"Layout bug while viewing vote count in Meta Stackexchange",
	url:	"http://meta.stackexchange.com/q/230392",
	css:	"div.vote-count-separator { margin: 5px auto }"
};
fixes.physics5773 = {
	title:	"Bounty icon is poorly placed",
	url:	"http://meta.physics.stackexchange.com/q/5773",
	css:	".vote .bounty-award-container { margin: 13px 0; text-align: center }" +
		".vote .bounty-award, span.bounty-award { margin: 0; display: inline-block; padding: 0.2em 0.5em }"
};
fixes.mse224185 = {
	title:	"Links sometimes float above text in vote-to-close dialog on Firefox",
	url:	"http://meta.stackexchange.com/q/224185",
	// "body" added to increase selector precedence over conflicting SE style
	css:	"body .close-as-off-topic-pane .action-name a, " +
		"body .close-as-off-topic-pane .action-name { vertical-align: baseline }" +
		"body .close-as-off-topic-pane input[type=radio] { vertical-align: top }" +
		".close-as-off-topic-pane { line-height: 1.15 }"  // related minor issue
};
fixes.mse233517 = {
	title:	"Badge symbol in notification is of the site you're on, not where badge was earned",
	url:	"http://meta.stackexchange.com/q/233517",
	// some sites (like meta.SE) use !important in badge styles, so we have to use it too :-(
	css:	".achievements-dialog .badge1, .achievements-dialog .badge2, .achievements-dialog .badge3 {" +
		" height: 8px !important; width: 8px !important; border-radius: 50% !important; margin: 0px 2px 4px }" +
		".achievements-dialog .badge1 { background: #ffcc00 !important }" +
		".achievements-dialog .badge2 { background: #c5c5c5 !important }" +
		".achievements-dialog .badge3 { background: #cc9966 !important }"
};
fixes.mse169225 = {
	title:	"Why does the bounty award button appear on deleted answers?",
	url:	"http://meta.stackexchange.com/q/169225",
	// .vote added to ensure higher specificity than the physics5773 fix
	css:	".deleted-answer .vote .bounty-vote-off { display: none }"
};
fixes.mse84296 = {
	title:	"RTL text can mess up comment timestamps",
	url:	"http://meta.stackexchange.com/q/84296",
	// XXX: once browser support for unicode-bidi: isolate improves, the embed fallback and vendor prefixes can be removed
	// FIXME: this apparently breaks stuff on Safari, but SOUP doesn't really have proper Safari support anyway yet
	// (this was briefly enabled on SE, but was reverted due to the Safari issue; re-adding it to SOUP for now)
	css:	".comment-copy, .comment-user, .user-details a " +
		"{ unicode-bidi: embed; unicode-bidi: -moz-isolate; unicode-bidi: -webkit-isolate; unicode-bidi: isolate }"
};
fixes.mse240710 = {
	title:	"Was the fringe always there on the up-rep icon?",
	url:	"http://meta.stackexchange.com/q/240710",
	css:	".topbar .unread-count { min-height: 11px; min-width: 5px }"
};
fixes.mse249859 = {
	title:	"<kbd> tags in headings are too small",
	url:	"http://meta.stackexchange.com/q/249859",
	credit:	"Doorknob",
	// "body" added to increase selector precedence over conflicting SE style
	css:	"body kbd { font-size: 80% }"
};
fixes.mse248156 = {
	title:	"What's the purpose of the tagline in the Bounties section of the profile?",
	url:	"http://meta.stackexchange.com/q/248156",
	css:	"#user-tab-bounties #bounties-table .started { display: none }"
};
fixes.mso284049 = {
	title:	"Small bugs in the Stack Overflow editor",
	url:	"http://meta.stackoverflow.com/q/284049",
	css:	".wmd-help-button { left: auto !important }" +  // !important needed to override inline style
		"body .wmd-help-button.active-help { background: transparent }" +
		"body .answer-help-background { padding-top: 10px }"
};
fixes.mse250081 = {
	title:	"Retract close vote UI",
	url:	"http://meta.stackexchange.com/q/250081",
	credit:	"style suggested by AstroCB",
	// FIXME: This doesn't work on pt.SO or ja.SO; should find out how this tooltip is translated there
	css:	".close-question-link[title^=\"You voted to\"] { color: #444 }"
};
fixes.mso287222 = {
	title:	"Clicking between lines fails",
	url:	"http://meta.stackoverflow.com/q/287222",
	credit:	"Travis J",
	// ISSUE: this looks kind of ugly on gaming.SE, cooking.SE and maybe some other sites
	// that use a border-bottom hack for dotted underlines on links
	// list of problem sites: cooking cstheory english gamedev gaming math photo programmers stats tex unix webapps
	// see also: http://meta.gaming.stackexchange.com/questions/10227/sidebar-links-wobble-when-hovered
	css:	".question-summary .answer-hyperlink, " +
		".question-summary .question-hyperlink, " +
		".module.community-bulletin .question-hyperlink, " +
		".question-summary .result-link a { " +
		" display: block; margin-bottom: -1px; border-bottom: 1px solid transparent }"
};
fixes.mso297678 = {
	title:	"Comment anchor links get “visited” highlighting",
	url:	"http://meta.stackoverflow.com/q/297678",
	// XXX: this selector needs to be more specific than ".comment-text a:not(.comment-user):visited"
	css:	"body .comment-date a.comment-link, " +
		"body .comment-date a.comment-link:visited { color: inherit }"
};
fixes.mse242944 = {
	title:	"Long display name with no spaces breaks design of review history pages",
	url:	"http://meta.stackexchange.com/q/242944",
	css:	"body.review-page .history-table td:nth-child(1) " +
		"{ width: 120px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; color: #999 }"
};


// site-specific CSS fixes:
fixes.math12803a = {
	title:	"“Sign up for the newsletter” button overflows the frame on Firefox / Linux (part 1)",
	url:	"http://meta.math.stackexchange.com/q/12803",
	// this part of the fix is only enabled on math.SE, since other sites use different fonts
	sites:	/^(meta\.)?math\./,
	css:	"#newsletter-signup { font-family: 'Liberation Sans', Helvetica, Arial, sans-serif }"
};
fixes.math12803b = {
	title:	"“Sign up for the newsletter” button overflows the frame on Firefox / Linux (part 2)",
	url:	"http://meta.math.stackexchange.com/q/12803",
	// this part of the fix is enabled globally, to fix minor overflows on various SE sites
	css:	"#newsletter-signup-container { margin-left: -15px; margin-right: -15px }"
};
fixes.codegolf959 = {
	title:	"Add line-height shortener to the ascii-art tag",
	url:	"http://meta.codegolf.stackexchange.com/q/959",
	sites:	/^(meta\.)?codegolf\./,
	css:	"pre { line-height: 1.15 }"
};
fixes.mse229797 = {
	title:	"You are here, but where's here?",
	url:	"http://meta.stackexchange.com/q/229797",
	credit:	"Tim Stone",
	sites:	/^meta\.stackexchange\.com$/,
	css:	".nav ul li.youarehere a { display: inline-block;" +
		" padding: 5px; margin: -5px; border-radius: 5px;" +
		" background-color: rgba(0, 80, 112, 0.25); color: #A1E9FF }"
};
fixes.math12902 = {
	title:	"Visited questions are practically indistinguishable in search results",
	url:	"http://meta.math.stackexchange.com/q/12902",
	sites:	/^math\./,
	// "body" added to override conflicting SE styles
	css:	"body a, body .question-hyperlink { color: #145d8a }" + 
		"body a:visited, body .question-hyperlink:visited { color: #003b52 }" +
		// stupid reduntant styles...
		"body .user-show-new .question-hyperlink," +
		"body .user-show-new .answer-hyperlink," +
		"body .user-show-new .site-hyperlink { color: #145d8a !important }" +
		"body .user-show-new .question-hyperlink:visited," +
		"body .user-show-new .answer-hyperlink:visited," +
		"body .user-show-new .site-hyperlink:visited { color: #003b52 !important }"
};
fixes.math12902_meta = {
	title:	"Visited questions are practically indistinguishable in search results (meta)",
	url:	"http://meta.math.stackexchange.com/q/12902",
	sites:	/^meta\.math\./,
	// "body" added to override conflicting SE styles
	css:	"body a { color: #a29131 } body a:visited { color: #736722 }"
};
fixes.math16559 = {
	title:	"Typo in site CSS disables visited link color in community bulletin",
	url:	"http://meta.math.stackexchange.com/q/16559",
	sites:	/^math\./,
	// this rule is already in the site CSS, but without the colon in "a:visited"
	css:	".module.community-bulletin a:visited { color: #32455d !important }"
};
fixes.math16559_meta = {
	title:	"Typo in site CSS disables visited link color in community bulletin (meta)",
	url:	"http://meta.math.stackexchange.com/q/16559",
	sites:	/^meta\.math\./,
	css:	".module.community-bulletin a:visited { color: #444 !important }"
};
fixes.electronics3162 = {
	title:	"Error for profile less info",
	url:	"http://meta.electronics.stackexchange.com/q/3162",
	sites:	/^(meta\.)?electronics\./,
	// .user-header added to increase specificity over conflicting SE style
	css:	".user-show-new .user-header.user-header-slim .data { width: auto !important }"
};
fixes.electronics4038 = {
	title:	"About Me box on user page not in the right place",
	url:	"http://meta.electronics.stackexchange.com/q/4038",
	// should be safe to apply on all sites, even if the issue has only been reported on electronics.SE
	css:	".user-show-new #large-user-info.user-header .user-header-left { margin-right: 0 }"
};
fixes.mso286009 = {
	title:	"Change [Ask Question] button style",
	url:	"http://meta.stackoverflow.com/q/286009",
	sites:	/^(meta\.)?stackoverflow\./,
	css:	".nav.askquestion { margin-left: 26px }"
};
fixes.mso283939 = {
	title:	"Flag for diamond moderator textarea breaks out of the dialog",
	url:	"http://meta.stackoverflow.com/q/283939",
	// should be safe to apply on all sites; sites other than SO already have similar CSS
	css:	".mod-attention-subform textarea { font-size: 12px; width: 600px; padding: 5px }"
};
fixes.mse250407 = {
	title:	"User signature cards on old revisions look funny",
	url:	"http://meta.stackexchange.com/q/250407",
	css:	"#revisions table.postcell { width: auto }" // for SO, applied globally
};
fixes.cooking2049 = {
	title:	"Ads are cut off on the right",
	url:	"http://meta.cooking.stackexchange.com/q/2049",
	credit:	"Jefromi",
	sites:	/^(meta\.)?cooking\./,
	css:	"body .everyonelovesstackoverflow { padding: 0 }"
};
fixes.movies1652 = {
	title:	"/users and profile pages (/users/…) space the link to the current profile (in the top bar) differently",
	url:	"http://meta.movies.stackexchange.com/q/1652",
	sites:	/^(meta\.)?movies\./,
	css:	".topbar .topbar-links .topbar-flair .badge1, " +
		".topbar .topbar-links .topbar-flair .badge2, " +
		".topbar .topbar-links .topbar-flair .badge3 { margin: 0 }"
};
fixes.graphicdesign2415 = {
	title:	"Design Bug: Tag alert CSS",
	url:	"http://meta.graphicdesign.stackexchange.com/q/2415",
	sites:	/^(meta\.)?graphicdesign\./,
	css:	"body .message.message-warning a, body .message.message-warning a:visited { color: #fcedb1 }"  // "body" added to override SE style
};
fixes.mse244587 = {
	title:	"“Top Network Users” should contain themselves!",
	url:	"http://meta.stackexchange.com/q/244587",
	sites:	/^stackexchange\.com$/,
	css:	"body .users-sidebar .userLinks { width: 185px; float: right; overflow: hidden; text-overflow: ellipsis }" +
		// XXX: these extra rules are not really needed, but they make the layout more robust
		"body .users-sidebar .userDetails img { margin-right: 0 }" +
		"body .users-sidebar .userDetails { overflow: hidden }"
};
fixes.rpg3554 = {
	title:	"Skin does not handle read-only mode well",
	url:	"http://meta.rpg.stackexchange.com/q/3554",
	sites:	/^(meta\.)?rpg\./,
	css:	"body #system-message { clear: both }"  // "body" added to override SE style
};


//
// Chat-specific fixes:
//
fixes.mse155308 = {
	title:	"Ignoring somebody screws up the avatar list",
	url:	"http://meta.stackexchange.com/q/155308",
	credit:	"DaveRandom",
	sites:	/^chat\./,
	css:	"#present-users > .present-user.ignored { height: 16px }"
};
fixes.mse216760 = {
	title:	"The reply buttons in chat shouldn't reposition themselves on pinged messages",
	url:	"http://meta.stackexchange.com/q/216760",
	sites:	/^chat\./,
	// "body" added to increase selector precedence above conflicting SE style
	css:	"body .message.highlight { margin-right: 0px }" +
		"body .message.highlight .flash { right: -38px }"  // regression: http://meta.stackexchange.com/q/221733
};
fixes.mse222509 = {
	title:	"Getting Red Line under tags",
	url:	"http://meta.stackexchange.com/q/222509",
	sites:	/^chat\./,
	css:	".ob-post-tags a:hover, .ob-user-tags a:hover, " +
		"a.soup-mse222509-fix:hover { text-decoration: none }",
	script:	function () {
		$('#main').on('mouseover', '.ob-post-tag, .ob-user-tag', function () {
			$(this).closest('a').not('.soup-mse222509-fix').addClass('soup-mse222509-fix');
		} );
	}
};
fixes.mse134268 = {
	title:	"U+0008 inserted into chat @-pings",
	url:	"http://meta.stackexchange.com/q/134268",
	sites:	/^chat\./,
	script:	function () {
		$('body#chat-body').on( 'keypress', function (e) {
			if ( e.ctrlKey || e.altKey || e.metaKey ) return;
			if ( !e.which || e.which == 32 || e.which >= 32 ) return;
			e.stopPropagation();
		} );
	}
};
fixes.mse224233 = {
	title:	"Problem in css style loading in Search Bar after refresh page when using FF",
	url:	"http://meta.stackexchange.com/q/224233",
	sites:	/^chat\./,
	script:	function () {
		$('#search:not([placeholder])').off('focus blur').attr( 'placeholder', function () {
			var $this = $(this);
			if ( $this.closest('#roomsearch').length ) return 'filter rooms';
			else if ( $this.closest('#usersearch').length ) return 'filter users';
			else return 'search';
		} ).filter('.watermark').val('').removeClass('watermark');
	}
};


//
// General fixes that need scripting (run in page context after jQuery / SE framework is ready):
//
fixes.mse217779 = {
	title:	"The CSS for spoilers is a mess. Let's fix it!",
	url:	"http://meta.stackexchange.com/q/217779",
	css:	".soup-spoiler > * { opacity: 0; transition: opacity 0.5s ease-in }" +
		".soup-spoiler:hover > *, .soup-spoiler.visible > * { opacity: 1 }",
	script:	function () {
		if ( SOUP.isMobile ) return;  // mobile theme handles spoilers differently
		var fixSpoilers = function (where) {
			var spoiler = $(where);
			if ( ! spoiler.hasClass('spoiler') ) spoiler = spoiler.find('.spoiler');
			spoiler.addClass('soup-spoiler').removeClass('spoiler').wrapInner('<div></div>').off('click');
		};
		SOUP.addContentFilter( fixSpoilers, 'spoiler fix', document, ['load', 'post', 'preview'] );
		$(document).on( 'mouseover', '.spoiler', function () {
			SOUP.try( 'spoiler fix fallback', fixSpoilers, [this] );
		} ).on( 'click', '.soup-spoiler', function () {
			// XXX: re-remove .spoiler, in case the SE spoiler click handler didn't get properly disabled
			$(this).toggleClass('visible').removeClass('spoiler');
		} );
	}
};
fixes.mse78989 = {
	title:	"Clicking on tags broken?",
	url:	"http://meta.stackexchange.com/q/78989",
	script:	function () {
		if ( !/[?&]sort[=]/.test( location.search ) &&
			$('body').hasClass('tagged-questions-page') &&
			$('#tabs a.youarehere').length == 0 ) {
			var href = $('#tabs a[href*="?sort="]:first').attr('href');
			if ( href ) location.replace( href );
		}
	}
};
fixes.mse207526 = {
	title:	"Cannot navigate into the multicollider with keyboard",
	url:	"http://meta.stackexchange.com/q/207526",
	script:	function () {
		if ( !window.StackExchange || !StackExchange.topbar ) return;
		SOUP.hookAjax( /^\/topbar\//, function () {
			$('.js-site-switcher-button').after($('.siteSwitcher-dialog'));
			$('.js-inbox-button').after($('.inbox-dialog'));
			$('.js-achievements-button').after($('.achievements-dialog'));
		} );
		// fix bug causing clicks on the site search box to close the menu
		// XXX: this would be a lot easier if jQuery bubbled middle/right clicks :-(
		var fixTopbarClickHandler = function () {
			var clickHandlers = $._data(document, 'events').click || [];
			clickHandlers.forEach( function (h) {
				if ( !/\$corral\b/.test( h.handler.toString() ) ) return;
				var oldHandler = h.handler;
				h.handler = function (e) {
					if ( $(e.target).closest('.topbar-dialog').length ) return;
					return oldHandler.apply(this, arguments);
				};
			} );
		};
		SOUP.try( 'topbar click handler fix', fixTopbarClickHandler );
		// XXX: on chat, this fix might run before the topbar is initialized
		var oldInit = StackExchange.topbar.init;
		StackExchange.topbar.init = function () {
			oldInit.apply(this, arguments);
			SOUP.try( 'topbar click handler fix (deferred)', fixTopbarClickHandler );
		};
	}
};
fixes.mse261721 = {
	title:	"Un-fade low-score answers on click/tap too",
	url:	"http://meta.stackexchange.com/q/261721",
	credit:	"based on fix by Manishearth",
	script:	function () {
		$('#answers').on( 'click', '.answer.downvoted-answer .post-text', function () {
			$(this).closest('.answer').addClass('downvoted-answer-clicked').removeClass('downvoted-answer');
		} ).on( 'click', '.answer.downvoted-answer-clicked .post-text', function () {
			$(this).closest('.answer').addClass('downvoted-answer').removeClass('downvoted-answer-clicked');
		} );
	}
};
fixes.mse66646 = {
	title:	"Confirming context menu entries via Enter triggers comment to be posted",
	url:	"http://meta.stackexchange.com/q/66646",
	script:	function () {
		if ( !window.StackExchange || !StackExchange.options ) return;
		StackExchange.options.desc = true;  // disable SE keyup/press handler
		$('body').on( 'keydown keypress', 'form[id*="-comment-"] textarea',
			function (e) {
				if ( e.which != 13 || e.shiftKey ) return;
				e.preventDefault();
				if ( e.type == 'keydown' && $(this).prev('#tabcomplete:visible').length == 0 )
					$(this).closest('form').submit();
			}
		);
	}
};
fixes.mse210132 = {
	title:	"New top bar should render avatar with a transparent background",
	url:	"http://meta.stackexchange.com/q/210132",
	script:	function () {
		$('.topbar img.avatar-me[src^="http://i.stack.imgur.com/"]').attr(
			'src', function (i,v) { return v.replace( /\?.*$/, "" ) }
		).css( { 'max-width': '24px', 'max-height': '24px' } );
	}
};
fixes.mse220337 = {
	title:	"Election comments have no permalink link",
	url:	"http://meta.stackexchange.com/q/220337",
	credit:	"FEichinger",
	script:	function () {
		if ( !/^\/election\b/.test( location.pathname ) ) return;
		var base = ( $('#tabs .youarehere').attr('href') || "" ).replace( /#.*/, "" );

		SOUP.addContentFilter( function () {
			var n = $('.comment-date').not(':has(a)').wrapInner( function () {
				var id = $(this).closest('.comment').attr('id');
				return $('<a class="comment-link"></a>').attr('href', base + '#' + id);
			} ).length;
			SOUP.log( 'mse220337: fixed ' + n + ' comments' );
		}, 'mse220337 comment filter' );

		// fix post links too, while we're at it
		$('.post-menu a:contains("link")').attr( 'href', function (i, href) {
			return href.replace( /^[^#]*/, base );
		} );
	}
};
fixes.mse172931 = {
	title:	"Please put answers underneath questions in Close review queue",
	url:	"http://meta.stackexchange.com/q/172931",
	script:	function () {
		if ( ! /^\/review\b/.test( location.pathname ) ) return;
		SOUP.hookAjax( /^\/review\/(next-task|task-reviewed)\b/, function () {
			$('.reviewable-post').not(':has(.answer)').each( function () {
				var post = $(this), question = post.find('.question');
				
				// initial check to see if there are any answers to load
				var label = post.find('.reviewable-post-stats td.label-key:contains("answers")');
				var count = label.first().next('td.label-value').text().trim();
				var shown = $('.reviewable-answer').length;  // XXX: don't needlessly reload sole answers in answer review
				if ( count - shown < 1 ) return;
				
				// find question URL
				var url = post.find('h1 a.question-hyperlink').attr('href');
				SOUP.log( 'soup loading ' + (count - shown) + ' missing answers from ' + url );
				
				var injectAnswers = function ( html ) {
					// kluge: disable script tags; $.parseHTML() would be better, but needs jQuery 1.8+
					// (we do this in two passes: the first is cleaner, but could potentially miss some cases)
					html = html.replace( /<script\b([^>'"]+|"[^"]*"|'[^']*')*>[\s\S]*?<\/script\s*>/ig, '' );
					html = html.replace( /(<\/?)(script)/ig, '$1disabled$2' );
					var answers = $( html ).find('.answer').filter( function () {
						return ! document.getElementById( this.id );
					} ), n = answers.length;
					SOUP.log( 'soup loaded ' + n + ' missing answers from ' + url );
					
					// mangle the answer wrappers to look like the review page before injecting them
					answers.find('.votecell a[class^="vote-"], .post-menu > *, .comments, .comments-link').remove();
					answers.find('.vote-count-post').after( function () {
						return '<div>vote' + ( this.textContent.trim() == 1 ? '' : 's' ) + '</div>';
					} );
					
					// inject answers into the review page
					var header = $('<div id="answers-header"><div class="subheader answers-subheader"><h2></h2></div></div>');
					header.find('h2').text( n + ( shown ? ' Other' : '') + ' Answer' + ( n == 1 ? '' : 's' ) );
					header.insertAfter( question );
					answers.insertAfter( header ).mathjax();
					SOUP.runContentFilters( 'post', answers );
				};
				$.ajax( { method: 'GET', url: url, dataType: 'html', success: injectAnswers } );
			} );
		} ).code();
	}
};
fixes.mse224533 = {
	title:	"Soft-hyphen hides subsequent text when using Opera 12.16",
	url:	"http://meta.stackexchange.com/q/224533",
	script:	function () {
		if ( SOUP.isMobile || ! window.opera ) return;
		SOUP.addContentFilter( function (where) {
			var preBlocks = $(where).find('pre:not(.soup-shy-fixed)').addClass('soup-shy-fixed');
			SOUP.forEachTextNode( preBlocks, function () {
				this.nodeValue = this.nodeValue.replace( /\xAD/g, '' );
			} );
		}, 'Opera soft-hyphen fix' );
	}
};
fixes.mse115702 = {
	title:	"Option to delete an answer only visible after a reload",
	url:	"http://meta.stackexchange.com/q/115702",
	script:	function () {
		if ( SOUP.userRep < ( SOUP.isBeta ? 4000 : 20000 ) ) return;
		SOUP.log( 'soup adding vote event handler for mse115702' );
		var html = '<a href="#" class="soup-delete-link" title="vote to delete this post">delete</a>';
		var lsep = '<span class="lsep">|</span>';
		SOUP.hookAjax( /^\/posts\/\d+\/vote\/[023]\b/, function ( event, xhr, settings ) {
			var score = $.parseJSON( xhr.responseText ).NewScore;
			var pid = Number( settings.url.replace( /^\/posts\/(\d+)\/.*/, '$1' ) );
			SOUP.log( 'soup logged post vote: id = ' + pid + ', score = ' + score );
			var isAnswer = $('#answer-' + pid).length;
			if ( !isAnswer ) return;  // XXX: proper question handling requires detecting closed questions
			var deleteLinks = $('[id="delete-post-' + pid + '"]');  // XXX: there might be several
			if ( score >= (isAnswer ? 0 : -2) ) {
				// XXX: just to be sure, don't remove any delete links that we didn't add
				deleteLinks = deleteLinks.filter('.soup-delete-link');
				deleteLinks.next('span.lsep').andSelf().hide();
			} else if ( deleteLinks.length ) {
				deleteLinks.next('span.lsep').andSelf().show();  // show existing links
			} else {
				// need to create a new delete link from scratch and slip it into the menu
				var target = $('.flag-post-link[data-postid=' + pid + ']');
				var lsep = target.prev('span.lsep').clone(true);
				if (lsep.length == 0) lsep = $('<span class="lsep">|</span>');
				$(html).attr('id', 'delete-post-' + pid).insertBefore(target).after(lsep);
			}
		} );
	}
};
fixes.mse231150 = {
	title:	"Clicking the top bar sometimes loads the SE homepage, sometimes shows the site switcher",
	url:	"http://meta.stackexchange.com/q/231150",
	early:	function () {
		var buttonRegex = /(^|\s)js-(site-switcher|inbox|achievements|help)-button(\s|$)/;
		document.addEventListener( 'click', function (event) {
			if ( event.button != 0 ) return;  // ignore right/middle clicks
			var elem = event.target;
			while ( elem && !buttonRegex.test(elem.className) ) elem = elem.parentNode;
			if ( elem ) event.preventDefault();
		}, false );
	}
};
fixes.mse234680 = {
	title:	"Domain names in an URL are incorrectly encoded as escaped ASCII characters instead of punycode",
	url:	"http://meta.stackexchange.com/q/234680",
	script:	function () {
		if ( !SOUP.punycode ) {
			/*! http://mths.be/punycode v1.2.4 by @mathias */
			// Copyright Mathias Bynens <http://mathiasbynens.be/>, distributed under the MIT license; see https://github.com/bestiejs/punycode.js/tree/1f0b9c4fc833e10728b13768396c702d66d641df/LICENSE-MIT.txt for full license text
			!function(a){function b(a){throw RangeError(E[a])}function c(a,b){for(var c=a.length;c--;)a[c]=b(a[c]);return a}function d(a,b){return c(a.split(D),b).join(".")}function e(a){for(var b,c,d=[],e=0,f=a.length;f>e;)b=a.charCodeAt(e++),b>=55296&&56319>=b&&f>e?(c=a.charCodeAt(e++),56320==(64512&c)?d.push(((1023&b)<<10)+(1023&c)+65536):(d.push(b),e--)):d.push(b);return d}function f(a){return c(a,function(a){var b="";return a>65535&&(a-=65536,b+=H(a>>>10&1023|55296),a=56320|1023
			&a),b+=H(a)}).join("")}function g(a){return 10>a-48?a-22:26>a-65?a-65:26>a-97?a-97:t}function h(a,b){return a+22+75*(26>a)-((0!=b)<<5)}function i(a,b,c){var d=0;for(a=c?G(a/x):a>>1,a+=G(a/b);a>F*v>>1;d+=t)a=G(a/F);return G(d+(F+1)*a/(a+w))}function j(a){var c,d,e,h,j,k,l,m,n,o,p=[],q=a.length,r=0,w=z,x=y;for(d=a.lastIndexOf(A),0>d&&(d=0),e=0;d>e;++e)a.charCodeAt(e)>=128&&b("not-basic"),p.push(a.charCodeAt(e));for(h=d>0?d+1:0;q>h;){for(j=r,k=1,l=t;h>=q&&b("invalid-input"),
			m=g(a.charCodeAt(h++)),(m>=t||m>G((s-r)/k))&&b("overflow"),r+=m*k,n=x>=l?u:l>=x+v?v:l-x,!(n>m);l+=t)o=t-n,k>G(s/o)&&b("overflow"),k*=o;c=p.length+1,x=i(r-j,c,0==j),G(r/c)>s-w&&b("overflow"),w+=G(r/c),r%=c,p.splice(r++,0,w)}return f(p)}function k(a){var c,d,f,g,j,k,l,m,n,o,p,q,r,w,x,B=[];for(a=e(a),q=a.length,c=z,d=0,j=y,k=0;q>k;++k)p=a[k],128>p&&B.push(H(p));for(f=g=B.length,g&&B.push(A);q>f;){for(l=s,k=0;q>k;++k)p=a[k],p>=c&&l>p&&(l=p);for(r=f+1,l-c>G((s-d)/r)&&b(
			"overflow"),d+=(l-c)*r,c=l,k=0;q>k;++k)if(p=a[k],c>p&&++d>s&&b("overflow"),p==c){for(m=d,n=t;o=j>=n?u:n>=j+v?v:n-j,!(o>m);n+=t)x=m-o,w=t-o,B.push(H(h(o+x%w,0))),m=G(x/w);B.push(H(h(m,0))),j=i(d,r,f==g),d=0,++f}++d,++c}return B.join("")}function l(a){return d(a,function(a){return B.test(a)?j(a.slice(4).toLowerCase()):a})}function m(a){return d(a,function(a){return C.test(a)?"xn--"+k(a):a})}var n="object"==typeof exports&&exports,o="object"==typeof module&&module&&module.
			exports==n&&module,p="object"==typeof global&&global;(p.global===p||p.window===p)&&(a=p);var q,r,s=2147483647,t=36,u=1,v=26,w=38,x=700,y=72,z=128,A="-",B=/^xn--/,C=/[^ -~]/,D=/\x2E|\u3002|\uFF0E|\uFF61/g,E={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},F=t-u,G=Math.floor,H=String.fromCharCode;if(q={version:"1.2.4",ucs2:{decode:e,encode:f},decode:j,encode:k,toASCII:m,
			toUnicode:l},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return q});else if(n&&!n.nodeType)if(o)o.exports=q;else for(r in q)q.hasOwnProperty(r)&&(n[r]=q[r]);else a.punycode=q}(SOUP);
		}
		
		var link = document.createElement('a');  // work-around for cross-browser access to URLUtils
		var fixURLInput = function (where) {
			$(where).find('input[type=text]').attr('value', function (i, text) {
				// The following two lines are copied from ui.prompt() in wmd.en.js:
				text = text.replace(/^http:\/\/(https?|ftp):\/\//, '$1://');
				if (!/^(?:https?|ftp):\/\//.test(text)) text = 'http://' + text;
				
				// On Chrome, link.hostname / link.href return Punycode host names, so
				// just returning link.href would be enough; on Firefox, they return
				// Unicode, so we need to use the punycode.js library to convert them.
				// Either way, the following code should produce what we want:
				link.href = text;
				var host = SOUP.punycode.toASCII( link.hostname );
				var fixed = link.href.replace( link.hostname, host );
				if (text != fixed) SOUP.log('soup fixed ' + text + ' to ' + fixed + ' (via ' + link.href + ')');
				return fixed;
			} );
		};
		
		// rebind the submit / click handlers for the "Insert Hyperlink" dialog
		// XXX: this is kind of fragile, and liable to stop working if the implementation is changed
		$(document).on( 'focus', '.wmd-prompt-dialog form:not(.soup-punycode-fixed) input', function (e) {
			$(this).closest('form').addClass('soup-punycode-fixed').each( function () {
				var oldSubmit = this.onsubmit;
				this.onsubmit = function () {
					fixURLInput(this);
					if (oldSubmit) return oldSubmit.apply(this, arguments);
				};
			} ).find('input[type=button]').each( function () {
				var oldClick = this.onclick;
				this.onclick = function () {
					fixURLInput( $(this).closest('form') );
					if (oldClick) return oldClick.apply(this, arguments);
				};
			} );
		} );
		
		// backup content filter for existing broken links with percent-encoded hostnames
		SOUP.addContentFilter( function ( where ) {
			var percentRegexp = /%[0-9A-Fa-f]{2}/;
			var badChars = /[\0-\x2C\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]/;  // RFC 3490 §4.1
			$(where).find('a[href]').each( function () {
				if ( !percentRegexp.test( this.hostname ) ) return;
				var decodedHost = decodeURIComponent( this.hostname );
				if ( badChars.test( decodedHost ) ) return;
				this.hostname = decodedHost;
			} );
		}, 'IDN escape fix' );
	}
};
fixes.mse266852 = {
	title:	"Bar between “add a comment” and “show more comments” is inconsistent",
	url:	"http://meta.stackoverflow.com/q/266852",
	credit:	"based on script by Cameron Bernhardt (AstroCB)",
	script:	function () {
		SOUP.addContentFilter( function () {
			$('div[id^="comments-link-"] .js-link-separator:not(.lsep)').addClass('lsep').text('|');
		}, 'mse266852', ['load', 'post'] );
	}
};
fixes.mse239549 = {
	title:	"Mobile user profile page sort selectors stop working after first change",
	url:	"http://meta.stackexchange.com/q/239549",
	// FIXME: The linked bug report is mostly about another bug, since fixed; this should be reported separately
	script:	function () {
		// make the event handler live
		var selector = '.user-panel-subtabs select'; var matches = $(selector);
		if ( ! matches.length ) return;
		$._data( matches[0], 'events' ).change.forEach( function ( h ) {
			if ( h.selector || ! /"div\[class='subheader'\]"/.test( h.handler.toString() ) ) return;
			$('body').on( 'change', selector, h.handler );
			matches.off( 'change', h.handler );
		} );
		
		// sync the selector with the visible content
		// XXX: this will only work on English sites, and may break if the title text is changed
		matches.each( function () {
			var title = $(this).closest('.user-panel').find('div.subheader').text().toLowerCase();
			for (var i = 0; i < this.options.length; i++ ) {
				if ( title.indexOf( this.options[i].value ) < 0 ) continue;
				this.options[i].selected = true;
			}
		} )

	}
};
fixes.mse240417 = {
	title:	"Inside or outside?",
	url:	"http://meta.stackoverflow.com/q/240417",
	script:	function () {
		SOUP.addContentFilter( function () {
			$('.comment-user > .mod-flair').each( function () { $(this).insertAfter(this.parentNode) } );
		}, 'mse240417', document, ['load', 'comments'] );
	}
};
fixes.mse243519 = {
	title:	"Dangling signature dash in comments",
	url:	"http://meta.stackoverflow.com/q/243519",
	script:	function () {
		SOUP.addContentFilter( function () {
			$('.comment-user').each( function () { 
				var prev = this.previousSibling;
				if ( prev.nodeType != 3 ) return;
				prev.nodeValue = prev.nodeValue.replace( /^\s*–\xA0\s*$/, " \xA0–\xA0" );
			} );
		}, 'mse243519', document, ['load', 'comments'] );
	}
};
fixes.mse220611 = {
	title:	"Blue background on nominee comments only when expanded",
	url:	"http://meta.stackexchange.com/q/220611",
	script:	function () {
		if ( ! /^\/election\b/.test( location.pathname ) ) return;
		// XXX: This seems to only happen on the initialpage view, so no need to make it a content filter.
		$('body.election-page div[id^="post-"]').each( function () {
			var $this = $(this), href = $this.find('.post-signature.owner .user-details > a:first').attr('href');
			var match = /^\/users\/[0-9]+\//.exec( href );
			if ( ! match ) return;
			$this.find( '.comments .comment-user:not(.owner)[href^="' + match[0] + '"]').addClass('owner');
		} );
	}
};
fixes.mse121682 = {
	title:	"Links to election nominations don't work after nominations close",
	url:	"http://meta.stackexchange.com/q/121682",
	script:	function () {
		var regex = /^(https?:)?(\/\/[^\/]+\/election\/\d+)#post-(\d+)$/, repl = '$2?tab=nomination#comment-$3';
		// part A: if we've followed a broken link, fix it
		if ( regex.test( location ) && $( location.hash ).length == 0 ) {
			location.replace( location.toString().replace( regex, '$1' + repl ) );
		}
		// part B: fix inbox links directly
		SOUP.hookAjax( /^\/topbar\/inbox\b/, function () {
			$('.topbar .inbox-item a[href*="/election/"]').attr( 'href', function (i, href) {
				return href.replace( regex, repl );
			} );
		} );
	}
};
fixes.mse230536 = {
	title:	"Large down-vote count doesn't display negative sign",
	url:	"http://meta.stackexchange.com/q/230536",
	script:	function () {
		SOUP.hookAjax( /^\/posts\/\d+\/vote-counts\b/, function () {
			// XXX: the downvote element has no class, hence the silly selector
			$('.vote-count-post > .vote-count-separator + div[style*="maroon"]').each( function () {
				if ( $(this).children().length > 0 ) return;
				this.textContent = this.textContent.replace( /^(\s*)([1-9])/, '$1-$2' );
			} );
		} );
	}
};
fixes.mse248646 = {
	title:	"Comments left by the author of a spam/offensive post should be deleted from the post too",
	url:	"http://meta.stackexchange.com/q/248646",
	css:	"body:not(.soup-mse248646-fixed) .deleted-answer .comment { display: none }",
	script:	function () {
		$('.deleted-answer').has('.hidden-deleted-answer').each( function () {
			var $this = $(this), comments = $(this).find('.comment').hide();
			if ( comments.length == 0 ) return;

			var ui = StackExchange.comments.uiForPost($this);
			var count = ui.jtBody.data('remaining-comments-count') + comments.length;
			ui.setCommentsMenu(count);
			ui.jtBody.data('remaining-comments-count', count);
		} );
		$(document.body).addClass('soup-mse248646-fixed');
	}
};
fixes.mso284223 = {
	title:	"Newly upvoted cool comments get an uncolored score",
	url:	"http://meta.stackoverflow.com/q/284223",
	credit:	"thanks to tbodt for locating the bug",
	script:	function () {
		var regex = /^\/posts\/comments\/(\d+)\/vote\/[02]\b/;
		SOUP.hookAjax( regex, function ( event, xhr, settings ) {
			var commentId = regex.exec( settings.url )[1];
			$('#comment-' + commentId + ' .comment-score span').each( function () {
				if ( ! this.className ) this.className = 'cool';
			} );
		} );
	}
};
fixes.mso297489 = {
	title:	"Add close option to the “Help and Improvement” queue to avoid cluttering flags?",
	url:	"http://meta.stackoverflow.com/q/297489",
	script:	function () {
		if ( ! /^\/review\/helper\b/.test( location.pathname ) ) return;
		SOUP.hookAjax( /^\/review\/(next-task|task-reviewed)\b/, function () {
			StackExchange.vote_closingAndFlagging.init();
			$('.post-menu .close-question-link').show();
		} );
	}
};
fixes.mso295276 = {
	title:	"Username filter does not abort old pending Ajax requests",
	url:	"http://meta.stackoverflow.com/q/295276",
	script:	function () {
		if ( ! /^\/(users|tags)$/.test( location.pathname ) ) return;
		var prevXhr = null;
		$( document ).ajaxSend( function( event, xhr, settings ) {
			if ( ! /^\/(users\/filter|filter\/tags-for-index)\b/.test( settings.url ) ) return;
			if ( prevXhr ) prevXhr.abort();
			prevXhr = xhr;
			xhr.always( function () {
				if ( prevXhr === xhr ) prevXhr = null;
			} );
		} );
	}
};
fixes.mso297171 = {
	title:	"Comment warning appears on next comment",
	url:	"http://meta.stackoverflow.com/q/297171",
	script:	function () {
		$( document ).on( 'comment', function ( event, postid ) {
			$( '#add-comment-' + postid + ' .message-dismissable' ).fadeOutAndRemove();
		} );
	}
};
fixes.mso295666 = {
	title:	"Disable annoying autofocus when clicking preview",
	url:	"http://meta.stackoverflow.com/q/295666",
	credit:	"based on code by Oriol (http://meta.stackoverflow.com/users/1529630/oriol)",
	script:	function () {
		$( '.wmd-preview' ).off( 'click' );
		// KLUGE: block installation of further click handlers
		var oldClick = $.fn.click;
		$.fn.click = function () {
			// XXX: $(document).not('.wmd-preview').length == 0!
			var that = ( arguments.length > 0 ? this.not( $('.wmd-preview') ) : this );
			oldClick.apply( that, arguments );
			return this;
		};
		// add replacement double-click handler
		$( document ).on( 'dblclick', '.wmd-preview', function () {
			$( 'textarea', this.parentNode ).focus();
		} );
	}
};
fixes.mso302336 = {
	title:	"Don't fail LQP review audits just for looking at the deletion popup",
	url:	"http://meta.stackoverflow.com/q/302336",
	script:	function () {
		if ( ! /^\/review\/low-quality-posts\b/.test( location.pathname ) ) return;
		SOUP.hookAjax( /^\/review\/(next-task|task-reviewed)\b/, function ( event, xhr, settings ) {
			var data = $.parseJSON( xhr.responseText );
			if ( !data || !data.isAudit || data.isQuestion ) return;
			SOUP.log( 'soup mso302336: overriding review button handling for LQP answer audit' );

			var currentPostId = data.postId;
			$('.review-actions input').click( function ( event ) {
				// let SE handle this if we've re-triggered the event ourselves
				if ( event.soupReallyTriggerAudit ) {
					SOUP.log( 'soup mso302336: ignoring re-triggered click event' );
					return true;
				}
				var $button = $(this);
				var taskResultTypeId = $button.data( 'result-type' );
				// if this isn't a Delete or RecommendDeletion action, let SE handle it
				if ( taskResultTypeId != 4 && taskResultTypeId != 9 ) return true;
				SOUP.log( 'soup mso302336: captured delete button click on LQP answer audit, showing dialog' );
				
				// load and display a dummy deletion popup, just like on a non-audit post
				// NOTE: this is mostly copy-pasted from loadDeleteDialog() and delete_initPopup() in http://cdn-dev.sstatic.net/Js/review.en.js
				$('.review-actions input').attr('disabled', 'disabled');
				$.ajax( {
					type: 'GET',
					url: '/posts/popup/delete/' + currentPostId,  // XXX: will this work right on audit posts?
					dataType: 'html',
					success: function (html) {
						var $popup = $(html);
						$popup.appendTo($('.post-menu:first'));
						$popup.center().fadeIn('fast');
						StackExchange.helpers.bindMovablePopups();
						$popup.on("popupClose", function () {
							$('.review-actions input').removeAttr('disabled');
						});
						$popup.on("click", '.popup-close, .popup-actions-cancel', function () {
							$popup.trigger("closePopups");
						});
						$('#delete-question-form').submit(function () {
							$popup.trigger("closePopups");
							// re-trigger the click event, so that the audit gets handled
							SOUP.log( 'soup mso302336: re-triggering captured delete button click' );
							var newEvent = $.Event( 'click', { soupReallyTriggerAudit: true } );
							$button.trigger( newEvent );
					                return false;
						});
					},
					error: function () {
						$('.review-bar').showErrorMessage("Unable to load dialog. Please try again.");
					}
				} );
				
				return false;  // stop the event, don't let the SE click handler run
			} );
		} );
	}
};
fixes.mse240787 = {
	title:	"Inconsistent reputation mouse-over text",
	url:	"http://meta.stackexchange.com/q/240787",
	script:	function () {
		SOUP.addContentFilter( function ( where ) {
			$( '.reputation-score[title]', where ).attr( 'title', function ( i, title ) {
				if ( ! /\d/.test( title ) ) {
					title = title.replace( /\s*$/, " " ) + this.textContent;
				}
				return title.replace( /[0-9]{4,}/g, function ( digits ) {
					return Number( digits ).toLocaleString( 'en-US' );
				} );
			} );
		}, 'mse240787', '.user-info', ["load", "post", "usercard"] );
	}
};


//
// Site-specific JS fixes:
//
fixes.boardgames1152 = {
	title:	"Can the Magic card auto link feature be improved?",
	url:	"http://meta.boardgames.stackexchange.com/q/1152",
	credit:	"based on idea by Alex P",
	sites:	/^(meta\.)?boardgames\./,
	script:	function () {
		// rewrite of http://cdn.sstatic.net/js/third-party/mtg.js to make it work in preview too
		$('body').on( 'click', 'a.soup-mtg-autocard', function (event) {
			if ( event.button !== 0 ) return;
			var link = $(this).attr('href');
			window.open(link, "autocard" + (+new Date()), "scrollbars=1, resizable=1, width=770, height=890");
			return false;
		} );
		
		// change the URLs in server-side generated card links, fix double-escaping
		var fixCardLinks = function () {
			var cardLinks = $('a.mtg-autocard[href*="autocard.asp"]');
			// remove / prevent attachment of standard mtg.js click handler
			cardLinks.addClass('soup-mtg-autocard').removeClass('mtg-autocard').off('click');
			cardLinks.attr( 'href', function (i, href) {
				return href.replace(
					/^http:\/\/www\.wizards\.com\/magic\/autocard\.asp\?name=([^&#]+)$/,
					'http://gatherer.wizards.com/Pages/Card/Details.aspx?name=$1'
				).replace( /%26lt%3[Bb]/g, '%3C' ).replace( /%26gt%3[Bb]/g, '%3E' ).replace( /%26amp%3[Bb]/g, '%26' );
			} );
			SOUP.forEachTextNode( cardLinks, function () {
				this.nodeValue = this.nodeValue.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
			} );
		};
		SOUP.addContentFilter( fixCardLinks, 'mtg card link fix', document, ['load', 'post', 'preview'] );
		fixCardLinks();
		
		// related issue: card links are not parsed in edit preview
		// this code is loosely based on makeTagLinks() in http://dev.stackoverflow.com/content/Js/wmd.en.js
		SOUP.addEditorCallback( function (editor, postfix) {
			editor.getConverter().hooks.chain( 'postConversion', function (text) { try {
				var excludeRanges = null;
				return text.replace( /\[mtg:([^\[\]]+)\]/g, function (fullMatch, cardName, offset) { 
					// don't replace [mtg:] links inside <a> or <code> tags;
					// but don't bother looking for them unless we actually see such a link 
					if ( excludeRanges === null ) {
						var re = /<(a|code)\b[^>]*>.*?<\/\1>/ig, match;
						excludeRanges = [];
						while ((match = re.exec(text)) !== null) {
							excludeRanges.push( match.index, re.lastIndex );
						}
					}
					var skip = false;
					for (var i = 0; i < excludeRanges.length; i++) {
						if ( offset < excludeRanges[i] ) break;
						skip = !skip;
					}
					if (skip) return fullMatch;
					var linkName = cardName.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
					return '<a class="soup-mtg-autocard" href="http://gatherer.wizards.com/Pages/Card/Details.aspx?name=' +
						encodeURIComponent(linkName) + '">' + cardName + '</a>';
				} );
			} catch (e) { SOUP.log('SOUP MtG card link converter failed:', e) } } );
		} );
	}
};
fixes.french347 = {
	title:	"Make spaces unbreakable when it's obvious that a line-break should not occur",
	url:	"http://meta.french.stackexchange.com/q/347",
	credit:	"based on idea by Stéphane Gimenez",
	sites:	/^(meta\.)?french\./,
	script:	function () {
		SOUP.addContentFilter( function ( where ) {
			SOUP.forEachTextNode( where, function () {
				var fixed = this.nodeValue;
				fixed = fixed.replace(/(\S) ([:;!?»])/g, '$1\u202F$2');
				fixed = fixed.replace(/(«) (\S)/g, '$1\u202F$2');
				if (this.nodeValue != fixed) this.nodeValue = fixed;
			} );
		}, 'French space fix' );
	}
};


//
// HTTPS fixes:
//
fixes.mse223725 = {
	title:	"All internal links on Stack Exchange sites should be protocol-relative",
	url:	"http://meta.stackexchange.com/q/223725",
	//css:	"a.soup-https-fixed:not(#specificity-hack) { color: green !important }", // uncomment to highlight affected links
	script:	function () {
		if ( 'https:' != location.protocol ) return;
		var selector = 'a[href^="http://"]';
		var filter   = /(^|\.)((stack(exchange|overflow|apps)|superuser|serverfault|askubuntu)\.com|mathoverflow\.net)$/;
		var exclude  = /^(blog|elections)\./;  // these sites still don't work properly over HTTPS :-(
		var fixLink  = function () {
			if ( ! filter.test( this.hostname ) || exclude.test( this.hostname ) ) return;
			this.protocol = 'https:';
			// workaround for permalink redirect bug (http://meta.stackexchange.com/q/223728)
			this.pathname = this.pathname.replace( /^\/[qa]\//, '/questions/' ).replace( /^\/u\//, '/users/' );
			$(this).addClass( 'soup-https-fixed' );
		};
		var fixAllLinks = function (where) { $(where).find(selector).each( fixLink ) };
		SOUP.addContentFilter( fixAllLinks, 'HTTPS link fix' );
		$(document).on( 'mouseover click', selector, fixLink );
	}
};
fixes.mse221304 = {
	title:	"Make all i.stack.imgur.com links protocol-relative",
	url:	"http://meta.stackexchange.com/q/221304",
	script:	function () {
		if ( 'https:' != location.protocol ) return;
		var urlRegex = /^http:\/\/(([a-z0-9\-]+\.)*((imgur|gravatar|facebook)\.com|wikimedia\.org|sstatic\.net|(stack(exchange|overflow|apps)|superuser|serverfault|askubuntu)\.com|mathoverflow\.net))\//i;
		var fixImages = function (target) {
			$(target).find('img[src^="http://"]').each( function () {
				if ( ! urlRegex.test( this.src ) ) return;
				if ( ! this.complete || this.naturalWidth > 0 ) return;
				var newUrl = this.src.replace( urlRegex, 'https://$1/' );
				SOUP.log( 'soup mse221304 fixing img ' + this.src + ' -> ' + newUrl );
				this.src = newUrl;
			} );
		};
		SOUP.addContentFilter( fixImages, 'HTTPS image fix' );
		$(document).on( 'mouseenter', '#user-menu', function () {
			SOUP.try( 'HTTPS image fix', fixImages, [this] );
		} );
	}
};


//
// MathJax fixes:
//
fixes.mse209393 = {
	title:	"Render MathJax in the 10k tools",
	url:	"http://meta.stackexchange.com/q/209393",
	script:	function () {
		if ( !/^\/tools\b/.test( location.pathname ) ) return;
		SOUP.hookAjax( /^\/tools\b/, function () {
			window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
		} );
	}
};
fixes.math11036 = {
	title:	"Can we have the suggested questions' titles parsed by default?",
	url:	"http://meta.math.stackexchange.com/q/11036",
	script:	function () {
		SOUP.hookAjax( /^\/search\/titles\b/, function () {
			window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'question-suggestions']);
		} );
		// similar issue in user profiles (TODO: split into separate fix?)
        if ( /^\/users\/\d+\//.test( location.pathname ) ) {
    		SOUP.hookAjax( /^\/ajax\/users\/panel\b/, function () {
	    		window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'user-panel-questions']);
	    		window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'user-panel-answers']);
	    	} );
	    	SOUP.hookAjax( /^\/ajax\/users\/\d+\/rep\b/, function () {
	    		window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'rep-page-container']);
	    	} );
	    	// v1.31.0: expanded posts in activity tab
	    	SOUP.hookAjax( /^\/posts\/\d+\/body\b/, function () {
	    		window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'user-tab-activity']);
	    	} );
	    }
	}
};
fixes.cs537 = {
	title:	"Missing MathJaX in the duplicate subtab of the close review queue",
	url:	"http://meta.cs.stackexchange.com/q/537",
	script:	function () {
		var oldShow = $.fn.show;
		$.fn.show = function () {
			this.filter('.dno').hide().removeClass('dno').each( function () {
				window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, this]);
			} );
			return oldShow.apply(this, arguments);
		};
	}
};


//
// MathJax config tweaks (need to be injected early):
//
fixes.math4130 = {
	title:	"The scope of \\newcommand is the entire page",
	url:	"http://meta.math.stackexchange.com/q/4130",
	credit:	"idea by Davide Cervone",
	mathjax:	function () {
		var resetCmd = "resetstack";
		MathJax.Hub.Config( { TeX: {
			extensions: ["begingroup.js"],
			Macros: { resetstack: ["Extension", "begingroup"] }
		} } );
		MathJax.Hub.Register.StartupHook( "TeX begingroup Ready", function () {
			var TEX = MathJax.InputJax.TeX, TEXDEF = TEX.Definitions,
				NSSTACK = TEX.nsStack, NSFRAME = NSSTACK.nsFrame;
			// make sure user defs on stack can't clobber system defs in TEXDEF
			NSSTACK.Augment( {
				// don't store system defs on root stack...
				Init: function (eqn) {
					this.isEqn = eqn; this.stack = []; this.Push(NSFRAME());
				},
				// ...but fall back to them if nothing is found on the root stack
				Find: function (name, type) {
					// kluge: don't let the reset command be redefined
					if (type == "macros" && name == resetCmd) return "SoupResetStack";
					for (var i = this.top-1; i >= 0; i--) {
						var def = this.stack[i].Find(name,type);
						if (def) {return def}
					}
					// somebody needs to be hit with a giant "S"...
					if (type == "environments") type = "environment";
					return (this.isEqn ? null : TEXDEF[type][name]);
				}
			} );
			// reset definition stack and prevent further changes to system defs
			var resetStack = function () {
				TEX.rootStack.Init();
				TEX.eqnStack.Init(true);
			};
			resetStack();
			TEX.Parse.Augment( { SoupResetStack: resetStack } );
			MathJax.Hub.Startup.signal.Post("TeX SOUP reset Ready");
		} );
		// before processing, inject the reset command to any elements that should be isolated
		var select = '.post-text, .comment-text, .summary, .wmd-preview, .question-hyperlink';
		var reset = '<span class="soup-mathjax-reset"><script type="math/tex">\\' +
			resetCmd + '</script></span>';
		MathJax.Hub.Register.MessageHook( "Begin Process", function (message) {
			var elements = message[1];
			if ( !(elements instanceof Array) ) elements = [elements];
			for (var i = 0; i < elements.length; i++) {
				if (!elements[i]) continue;  // should not happen, but...
				$(elements[i]).find(select).andSelf().not('.soup-math4130-fixed').has('script').prepend(reset).addClass('soup-math4130-fixed');
			}
		} );
	},
	css:	".soup-mathjax-reset { display: none }"
};
fixes.math11392 = {
	title:	"MathJax preview broken when equations contain `\\label`s",
	url:	"http://meta.math.stackexchange.com/q/11392",
	credit:	"Davide Cervone",
	mathjax:	function () {
		MathJax.Hub.Register.MessageHook("Begin Process",function (message) {
			if (message[1].id && message[1].id.match(/^wmd-preview/)) {
				if ( MathJax.InputJax.TeX.resetEquationNumbers )
					MathJax.InputJax.TeX.resetEquationNumbers();
				MathJax.Hub.Config({TeX:{noErrors:{disabled:true}}});
			}
		});
		MathJax.Hub.Register.MessageHook("End Process",function (message) {
			if (message[1].id && message[1].id.match(/^wmd-preview/)) {
				MathJax.Hub.Config({TeX:{noErrors:{disabled:false}}});
			}
		});
	}
};
fixes.mse229363 = {
	title:	"Exclude TeX.SE question titles from MathJax parsing in Hot Network Questions",
	url:	"http://meta.stackexchange.com/q/229363",
	mathjax:	function () {
		// list of MathJax enabled sites from http://meta.stackexchange.com/a/216607
		// (codereview.SE and electronics.SE excluded due to non-standard math delimiters)
		var mathJaxSites = /(^|\.)((astronomy|aviation|biology|chemistry|cogsci|crypto|cs(theory)?|(data|earth)science|dsp|engineering|ham|math(educators|ematica)?|physics|puzzling|quant|robotics|scicomp|space|stats|worldbuilding)\.stackexchange\.com|mathoverflow\.net)$/;
		MathJax.Hub.Register.MessageHook( "Begin PreProcess", function (message) {
			SOUP.try( 'mse229363', function () {
				$('#hot-network-questions a:not(.tex2jax_ignore)').not( function () {
					return mathJaxSites.test( this.hostname );
				} ).addClass('tex2jax_ignore');
			} );
		} );
	}
};
fixes.math19650 = {
	title:	"Post with many lines of display math takes up most of the Questions page",
	url:	"http://meta.math.stackexchange.com/q/19650",
	mathjax:	function () {
		if ( ! /^\/?(questions(\/tagged\/.*)?|search|unanswered(\/.*)?)\/?$/.test( location.pathname ) ) return;
		MathJax.Hub.Register.StartupHook( "End Config", function () {
			var conf = MathJax.Hub.config.tex2jax;
			conf.inlineMath = conf.inlineMath.concat( conf.displayMath );
			conf.displayMath = [];
		} );
	}
};

//
// Initialization code and utility functions:
//
var soupInit = function () {
	window.SOUP = {};
	
	// basic environment detection, part 1
	// (for MathJax detection, just check window.MathJax, and note that it may be loaded late due to mse215450)
	SOUP.isChat = /^chat\./.test( location.hostname );
	SOUP.isMeta = /^meta\./.test( location.hostname );
	
	// run code after jQuery and/or SE framework have loaded
	SOUP.readyQueue = {};
	SOUP.ready = function ( key, code ) {
		if ( SOUP.isReady ) SOUP.try( key, code );
		else SOUP.readyQueue[key] = code;
	};
	SOUP.runReadyQueue = function () {
		if ( SOUP.isReady ) return;
		SOUP.isReady = true;
		for ( var key in SOUP.readyQueue ) {
			SOUP.try( key, SOUP.readyQueue[key] );
		}
		SOUP.log( 'soup JS fixes applied' );
	};
	// try to run some code, log errors
	SOUP.try = function ( key, code, args ) {
		try { code.apply(null, args) }
		catch (e) { SOUP.log( 'SOUP ' + key + ': ', e ) }
	};
	// wrapper for console.log(), does nothing on old Opera w/o console
	SOUP.log = function () {
		if ( window.console ) console.log.apply( console, arguments );
	};
	
	
	// wrapper for defining Markdown editor hooks, used by SOUP.hookEditPreview()
	// note: use editor.getConverter() to access the Markdown converter
	// see http://dev.stackoverflow.com/content/Js/wmd.en.js for details
	SOUP.addEditorCallback = function ( code ) {
		if ( !window.StackExchange || !StackExchange.ifUsing ) return;
		StackExchange.ifUsing( 'editor', function () {
			StackExchange.MarkdownEditor.creationCallbacks.add( code );
		} );
	};
	// utility: run code whenever the editor preview is updated
	// FIXME: this doesn't always work; find out why and fix it!
	SOUP.hookEditPreview = function ( code ) {
		SOUP.addEditorCallback( function (editor, postfix) {
			editor.hooks.chain( 'onPreviewRefresh', function () {
				code(editor, postfix || "");
			} );
		} );
	}
	
	// utility: run code after any matching AJAX request
	SOUP.hookAjax = function ( regex, code, delay ) {
		if ( typeof(delay) === 'undefined' ) delay = 0;
		var hook = { regex: regex, code: code, delay: delay };
		SOUP.ajaxHooks.push( hook );
		return hook;  // for chaining
	};
	// infrastructure for SOUP.hookAjax()
	SOUP.ajaxHooks = [];
	SOUP.runAjaxHook = function ( hook, event, xhr, settings ) {
		var tryIt = function () {
			try { hook.code( event, xhr, settings ) }
			catch (e) { SOUP.log( 'SOUP ajax hook for ' + hook.regex + ' failed: ', e ) }
		};
		if ( !hook.delay ) tryIt();
		else setTimeout( tryIt, hook.delay );
	};
	
	// utility: set a function to be called 1) immediately, 2) whenever a
	// new post is loaded via AJAX, and 3) when the edit preview is updated.
	// the function will be passed a jQuery selector to process.
	// NOTE: the function should be idempotent, i.e. it should be safe to
	// call it several times.
	SOUP.contentFilters = { load: [], post: [], comments: [], preview: [], chat: [], usercard: [] };
	SOUP.addContentFilter = function ( filter, key, where, events ) {
		key = key || 'content filter';
		events = events || Object.getOwnPropertyNames( SOUP.contentFilters );
		for ( var i = 0; i < events.length; i++ ) {
			if (events[i] == 'load') SOUP.try( key, filter, [where || document] );  // KLUGE
			else SOUP.contentFilters[events[i]].push( { key: key, filter: filter } );
		}
	};
	SOUP.runContentFilters = function ( eventType, where ) {
		var filters = SOUP.contentFilters[eventType] || [];
		for ( var i = 0; i < filters.length; i++ ) {
			SOUP.try( filters[i].key, filters[i].filter, [where] );
		}
	};

	SOUP.contentFilterRegexp = /^\/posts\/(ajax-load-realtime|\d+\/(body|edit-submit))\b|^\/review\/(next-task|task-reviewed)\b/;
	SOUP.hookAjax( SOUP.contentFilterRegexp, function () {
		SOUP.runContentFilters( 'post', '#content' );  // TODO: better selector?
	} );
	var commentRegex = /^\/posts\/((\d+)\/comments|comments\/(\d+))\b/;  // yes, both variants are in use :-(
	SOUP.hookAjax( commentRegex, function ( event, xhr, settings ) {
		var match = commentRegex.exec( settings.url );
		var where = ( match[2] ? '#comments-' + match[2] : '#comment-' + match[3] );
		SOUP.runContentFilters( 'comments', where );
	} );
	SOUP.hookEditPreview( function (editor, postfix) {
		SOUP.runContentFilters( 'preview', '#wmd-preview' + postfix );
	} );
	SOUP.chatContentFiltersPending = false;
	SOUP.runChatContentFilters = function () {
		SOUP.chatContentFiltersPending = false;
		SOUP.runContentFilters( 'chat', '#chat-body' );
	};

	// utility for monitoring SE chat events
	SOUP.chatHooks = [];
	SOUP.hookChat = function ( code, key ) {
		key = key || 'chat event hook';
		SOUP.chatHooks.push( { code: code, key: key } );
	};
	SOUP.chatEventsSeen = false;
	SOUP.runChatHooks = function ( data, source, url ) {
		// if this looks like an update (not initial request), stop filter polling
		if ( !SOUP.chatEventsSeen && /^\{"r\d+":/.test( data ) ) {
			SOUP.log( "soup received chat " + source + " message, stopping filter polling" );
			SOUP.chatEventsSeen = true;
			SOUP.stopChatFilterPoll();
		}
		// run chat event hooks
		var hooks = SOUP.chatHooks;
		for ( var i = 0; i < hooks.length; i++ ) {
			SOUP.try( hooks[i].key, hooks[i].code, arguments );
		}
		// if there seems to be some actual data, run content filters
		if ( /"e":/.test( data ) ) {
			if ( document.hidden ) SOUP.chatContentFiltersPending = true;
			else SOUP.runChatContentFilters();
		}
	};
	// SOUP.hookChat( function ( data, src, url ) { SOUP.log( src, data, url, document.hidden ) }, 'debug chat event hook' );

	// Here's how we handle content filters for chat:
	// * When the tab is visible, we run content filters on every chat
	//   event, or every 0.5 seconds if we can't capture chat events.
	// * When the tab is invisible, we mark filters as pending on chat
	//   events, and stop the 0.5 second polling loop.
	// * When the tab becomes visible, we run filters if pending, and
	//   restart the polling if we haven't seen any chat events.

	SOUP.chatFilterPollID = null;
	SOUP.runChatFilterPoll = function () {
		SOUP.chatFilterPollID = null;
		if ( !SOUP.isChat || document.hidden || SOUP.chatEventsSeen ) return;
		SOUP.runChatContentFilters();
		SOUP.chatFilterPollID = setTimeout( SOUP.runChatFilterPoll, 500 );
	};
	SOUP.stopChatFilterPoll = function () {
		if ( SOUP.chatFilterPollID !== null ) clearTimeout( SOUP.chatFilterPollID );
		SOUP.chatFilterPollID = null;
	};
	
	// hack the WebSocket interface so that we're informed of chat events
	if ( SOUP.isChat && window.WebSocket ) {
		var originRegexp = /^wss?:\/\/chat\.sockets\.stackexchange\.com(\/|$)/;
		var onmessageWrapper = function ( msg ) {
			var rv = (this._soup_onmessage || function () {}).apply( this, arguments );
			if ( !msg || !msg.data || !originRegexp.test( msg.origin ) ) return rv;
			if ( !SOUP.websocketHackActive ) SOUP.log( "soup websocket hack active" );  // It's working!
			SOUP.websocketHackActive = true;
			SOUP.runChatHooks( msg.data, 'websocket' );
			return rv;
		};
		try {
			SOUP.log( "soup initializing websocket hack" );
			var RealWebSocket = SOUP.RealWebSocket = WebSocket;
			WebSocket = function FakeWebSocket ( url ) {
				// call real WebSocket constructor; eww...
				// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_to_chain_constructors
				var args = [].slice.apply( arguments );
				var sock = new ( Function.prototype.bind.apply( RealWebSocket, [{}].concat( args ) ) )();
				if ( !originRegexp.test( url ) ) return sock;
				try {
					sock.onmessage = onmessageWrapper;
					Object.defineProperty( sock, 'onmessage', {
						// XXX: defining a getter here stops this from working on Chrome, don't ask me why
						set: function ( cb ) { if ( cb !== onmessageWrapper ) this._soup_onmessage = cb }
					} );
					SOUP.log( "soup applying websocket hack" );
				}
				catch (e) { SOUP.log( "applying soup websocket hack failed:", e ) }
				return sock;
			};
			// copy static properties of the real WebSocket
			for (var prop in RealWebSocket) WebSocket[prop] = RealWebSocket[prop];
			WebSocket.prototype = RealWebSocket.prototype;
		}
		catch (e) { SOUP.log( "soup websocket hack failed:", e ) }		
	}
	if ( SOUP.isChat ) {		
		// hook the non-websocket event interface too, in case websockets are disabled
		SOUP.hookAjax( /^\/((chats\/\d+\/)events|user\/info)(\/|$)/, function ( event, xhr, settings ) {
			SOUP.runChatHooks( xhr.responseText, 'ajax', settings.url );
		} );
	}

	
	// utility: iterate over text nodes inside an element / selector (TODO: extend jQuery?)
	SOUP.forEachTextNode = function ( where, code ) {
		$(where).contents().each( function () {
			if ( this.nodeType === 1 ) SOUP.forEachTextNode( this, code );
			else if ( this.nodeType === 3 ) code.apply( this );
		} );
	};
	
	SOUP.log( 'soup init complete' );
};

// setup code to execute after jQuery has loaded:
var soupLateSetup = function () {
	// basic environment detection, part 2
	SOUP.isMobile = !!( window.StackExchange && StackExchange.mobile );
	// detect user rep and site beta status; together, these can be user to determine user privileges
	// XXX: these may need to be updated if the topbar / beta site design is changed in the future
	if ( window.$ ) {
		SOUP.userRep = Number( $('.topbar .reputation').text().replace( /[^0-9]+/g, '' ) );
		SOUP.isBeta = /(^|\/)beta(meta)?\//.test( $('<span class="feed-icon" />').css('background-image') );
	}
	
	// run ready queue after jQuery and/or SE framework have loaded
	if ( window.StackExchange && StackExchange.ready ) StackExchange.ready( SOUP.runReadyQueue );
	else if ( window.$ ) $(document).ready( SOUP.runReadyQueue );
	// else we do nothing; this may happen e.g. in iframes
	
	// attach global AJAX hooks
	if ( window.$ ) $( document ).ajaxComplete( function( event, xhr, settings ) {
		for (var i = 0; i < SOUP.ajaxHooks.length; i++) {
			if ( SOUP.ajaxHooks[i].regex.test( settings.url ) ) {
				SOUP.runAjaxHook( SOUP.ajaxHooks[i], event, xhr, settings );
			}
		}
	} );

	// start chat content filter polling
	if ( SOUP.isChat && /^\/rooms\b/.test( location.pathname ) ) $( document ).ready( function () {
		document.addEventListener( 'visibilitychange', function () {
			if ( SOUP.chatContentFiltersPending ) SOUP.runChatContentFilters();
			if ( SOUP.chatEventsSeen ) return;
			// if we're on chat but haven't seen any chat events, run filters every 0.5 s
			if ( document.hidden ) SOUP.stopChatFilterPoll();
			else if ( SOUP.chatFilterPollID === null ) SOUP.runChatFilterPoll(); 
		} );
		SOUP.runChatFilterPoll();
	} );
	
	// trigger content filters on expanded user card display
	$(document).on( 'userhovershowing', function ( event ) {
		SOUP.runContentFilters( 'usercard', event.target );
	} );

	
	SOUP.log( 'soup setup complete' );
};

//
// Check if a fix should run on this site
//
var fixIsEnabled = function ( fix ) {
	if ( fix.sites && !fix.sites.test( location.hostname ) ) return false;
	if ( fix.exclude && fix.exclude.test( location.hostname ) ) return false;
	return true;
};


//
// Inject scripts and styles into the page:
//
if ( window.console ) console.log( 'soup injecting fixes' );
var head = document.head || document.documentElement;

// SOUP object init and early scripts:
var initScript = document.createElement( 'script' );
initScript.id = 'soup-init';
initScript.type = 'text/javascript';
var code = "(" + soupInit + ")();\n";
for (var id in fixes) {
	if ( ! fixIsEnabled( fixes[id] ) || ! fixes[id].early ) continue;
	code += "SOUP.try(" + JSON.stringify(id) + ", " + fixes[id].early + ");\n";
}
initScript.textContent = code;
head.appendChild( initScript );

// MathJax config:
var mathjaxScript = document.createElement( 'script' );
mathjaxScript.id = 'soup-mathjax-config';
mathjaxScript.type = 'text/x-mathjax-config';
var code = "SOUP.log( 'soup mathjax config loading' );\n";
for (var id in fixes) {
	if ( ! fixIsEnabled( fixes[id] ) || ! fixes[id].mathjax ) continue;
	code += "SOUP.try(" + JSON.stringify(id) + ", " + fixes[id].mathjax + ");\n";
}
mathjaxScript.textContent = code;
head.appendChild( mathjaxScript );

// CSS styles:
var styleElem = document.createElement( 'style' );
styleElem.id = 'soup-styles';
styleElem.type = 'text/css';
var code = "";
for (var id in fixes) {
	if ( ! fixIsEnabled( fixes[id] ) ) continue;
	if ( fixes[id].css ) code += "/* " + id + " */\n" + fixes[id].css;
}
styleElem.textContent = code.replace( /[}] */g, "}\n" )
head.appendChild( styleElem );

// JS fixes (injected on document load, run after SE framework is ready):
var injectScripts = function () {
	var scriptElem = document.createElement( 'script' );
	scriptElem.id = 'soup-scripts';
	scriptElem.type = 'text/javascript';
	var code = "(" + soupLateSetup + ")();\n";
	for (var id in fixes) {
		if ( ! fixIsEnabled( fixes[id] ) || ! fixes[id].script ) continue;
		code += "SOUP.ready(" + JSON.stringify(id) + ", " + fixes[id].script + ");\n";
	}
	scriptElem.textContent = code;
	document.body.appendChild( scriptElem );
};
if (document.body) injectScripts();
else if (window.opera) addEventListener( 'load', injectScripts, false );
else document.addEventListener( 'DOMContentLoaded', injectScripts );

} )();  // end of anonymous wrapper function
