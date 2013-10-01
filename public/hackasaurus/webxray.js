var GLOBAL_BASE_PATH = "/newsjack2/public/";
var GLOBAL_BASE_ROOT = "http://localhost";

/* Touch screen hax0r */
if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touch";
}

var Webxray = (function() {
	var GLOBAL_GOGGLES_LOAD_CB = 'webxrayWhenGogglesLoad';

	return {
		_getBaseURI: function() {
			// We would use document.baseURI, but it's not supported on IE9.
			var a = document.createElement("a");
			a.setAttribute("href", "./");
			return a.href;
		},
		whenLoaded: function whenLoaded(cb, global) {
			global = global || window;
			global[GLOBAL_GOGGLES_LOAD_CB] = cb;
		},
		triggerWhenLoaded: function triggerWhenLoaded(ui, global) {
			global = global || window;
			if (GLOBAL_GOGGLES_LOAD_CB in global && typeof(global[GLOBAL_GOGGLES_LOAD_CB]) == 'function')
				global[GLOBAL_GOGGLES_LOAD_CB](ui);
		}
	};
})();

/* LOCALIZATION SUPPORT */
(function(jQuery) {

	// Break a language string into language and region
	function parseLanguage(language) {
		var match = language.match(/([a-z]+)-([A-Z]+)/);
		if (match)
			return { language: match[1], region: match[2] }
		else
			return { language: language, region: null }
	}

	// Convert language strings so that they have consistant capitilization
	function normalizeLanguage(language) {
		var match = language.match(/([A-Za-z]+)-([A-Za-z]+)/);
		if (match)
			return match[1].toLowerCase() + "-" + match[2].toUpperCase();
		return language.toLowerCase();
	}

	// Get the localization string for an element
	jQuery.fn.extend({
		localize: function localize(locale, defaultScope) {
			locale = locale || jQuery.locale;
			this.find("[data-l10n]").each(function() {
				var scopedName = $(this).attr("data-l10n");
				if (scopedName.indexOf(':') == -1)
					scopedName = defaultScope + ':' + scopedName;
				$(this).text(locale.get(scopedName));
			});
		}
	});

	// Allow the registration of localization string sets
	jQuery.localization = {
		extend: function extend(language, scope, obj) {
			language = normalizeLanguage(language);
			if (!(language in this))
				this[language] = {};
			for (var name in obj)
				this[language][scope + ":" + name] = obj[name];
		},
		createMods: function createMods(mods) {
			this.mods = mods;
		},
		createLocale: function createLocale(languages) {
			languages = languages.map(normalizeLanguage); // Make sure languages are formatted consistantly
			var locale = {
				languages: languages,
				has: function has(scopedName) {
					return (scopedName in locale);
				},
				get: function get(scopedName) {
					if(jQuery.localization.mods && jQuery.localization.mods[scopedName])
						return jQuery.localization.mods[scopedName];
					return  locale[scopedName] || "unable to find locale string " + 
					scopedName;
				},
				scope: function scopeLocale(scope) {
					return function(name) {
						return locale.get(scope + ":" + name);
					}
				}
			};
			languages.forEach(function(language) {
				var parsed = parseLanguage(language);
				if (parsed.language != language &&
					parsed.language in jQuery.localization)
					jQuery.extend.call(locale, jQuery.localization[parsed.language]);
				if (language in jQuery.localization)
					jQuery.extend.call(locale, jQuery.localization[language]);
			});
			return locale;
		},
		loadLocale: function(options) {
			var deferreds = [];
			var languages = options.languages.map(normalizeLanguage);

			var campaignId = window.campaignId || options.campaignId;
			if(campaignId) {
				var modsLoaded = jQuery.Deferred();
				jQuery.ajax({
					url: options.root + "api/localeMods.php?c=" + campaignId,
					dataType: "jsonp",
					complete: function(jqXHR, textStatus) {
						modsLoaded.resolve();
					},
					success: function(data) {
						jQuery.localization.createMods(data);
					}
				});
				deferreds.push(modsLoaded);
			}

			languages.forEach(function(language) {
				var deferred = jQuery.Deferred();
				jQuery.ajax({
					url: options.path + language + ".js",
					dataType: "script",
					complete: function(jqXHR, textStatus) {
						deferred.resolve(language, textStatus);
					}
				});
				deferreds.push(deferred);
			});

			jQuery.when.apply(jQuery, deferreds).done(function() {
				var locale = jQuery.localization.createLocale(languages);
				options.complete(locale, arguments);
			});
		},
		init: function init(languages) {
			jQuery.locale = this.createLocale(languages);
		}
	};
	jQuery.localization.init([]);
})(jQuery);

/* Load in base localization information */
// TODO -- this probably shouldn't be happening
jQuery.localization.extend("en", "mix-master-dialog", {"rendering-header": "What You See", "html-header": "HTML Source Code", "title": "Remixer", "advanced-source-tab": "Advanced", "skeleton-header": "What Your Browser Sees", "basic-source-tab": "Basic"});
jQuery.localization.extend("en", "style-info", {"more-info": "Shift-click for more information.", "tap-space-html": "Tap <div class=\"webxray-kbd\">space bar</div> to edit this style.", "style-change": "style change"});
jQuery.localization.extend("en", "mix-master", {"too-big-to-change": "That element is too big to remix. Try selecting a smaller one!", "too-big-to-remix-html": "<div>That <code>&lt;${tagName}&gt;</code> element is too big to remix. Try selecting a smaller one!</div>", "deletion": "deletion", "replacement": "replacement"});
jQuery.localization.extend("en", "introduction", {"headline": "Welcome to NewsJack.", "explanation": "This is a tool designed to let you redefine the news. Click on anything and you can edit it. Headlines, pictures, links, text, whatever. When you're done click the button below to share your remix with the world."});
jQuery.localization.extend("en", "dropdown", {"headline": "You've been NewsJacked!  OR HAVE YOU", "explanation": "NewsJack is a media remixing tool built from Mozilla's <a href=\"http://hackasaurus.org/\">Hackasaurus</a> by <a href=\"http://slifty.com\">slifty</a> and <a href=\"http://schock.cc\">schock</a>"});
jQuery.localization.extend("en", "uproot-dialog", {"view-html": "View HTML Source", "html-source": "Here's the HTML source code of your remix.", "publishing": "Publishing...", "success": "Here is the URL for your remix that anyone can view.", "to-internet": "Publish To Internet", "header": "Publish Your Remix", "intro": "There are two ways you can publish your remix and share it with others.", "error": "Sorry, an error occurred. Please try again later.", "view-html-desc": "Grab the HTML source of your remix and publish it yourself.", "to-internet-desc": "Instantly publish your remix to a URL that anyone can view."});
jQuery.localization.extend("en", "command-manager", {"executed": "Executed", "cannot-undo-html": "<span>Nothing left to undo!</span>", "redid": "Redid", "cannot-redo-html": "<span>Nothing left to redo!</span>", "undid": "Undid"});
jQuery.localization.extend("en", "key-names", {"RIGHT": "\u2192", "UP": "\u2191", "DOWN": "\u2193", "DELETE-MacIntel": "delete", "ESC": "esc", "DELETE": "backspace", "LEFT": "\u2190"});
jQuery.localization.extend("en", "short-command-descriptions", {"quit": "quit", "remix": "remix", "help": "help", "css-quasimode": "css", "undo": "undo", "dom-descend": "descend", "bug-report": "report bug", "remove": "remove", "dom-ascend": "ascend", "uproot": "publish", "redo": "redo"});
jQuery.localization.extend("en", "short-element-descriptions", {"bgsound": "background sound", "code": "code fragment", "meter": "scalar gauge", "aside": "tangential content", "spacer": "layout space", "noscript": "script fallback content", "style": "CSS style sheet", "img": "image", "title": "document title", "menu": "list of commands", "tt": "teletype text", "tr": "table row", "param": "object parameter", "li": "list item", "source": "embedded media source", "tfoot": "table footer", "th": "table header cell", "input": "input form control", "td": "table data cell", "dl": "definition list", "blockquote": "block quotation", "fieldset": "set of form controls", "dd": "definition description", "nobr": "no breaks", "kbd": "keyboard input", "optgroup": "option grouping", "dt": "definition term", "wbr": "word break opportunity", "button": "interactive button", "summary": "summary of details", "p": "paragraph", "small": "small text", "output": "calculated result", "div": "document division", "em": "emphasis", "datalist": "list of predefined options", "hgroup": "heading group", "meta": "metadata", "video": "embedded video stream", "canvas": "dynamic graphics drawing area", "sub": "subscript", "bdo": "bi-directional override", "bdi": "bi-directional text formatting", "label": "form control label", "sup": "superscript", "progress": "progress indicator", "body": "document body", "base": "base URL", "br": "line break", "article": "independent article", "strong": "strong emphasis", "legend": "field set legend", "ol": "ordered list", "script": "embedded script", "caption": "table caption", "col": "table column", "h2": "heading", "h3": "heading", "h1": "heading", "h6": "heading", "h4": "heading", "h5": "heading", "table": "tabular data", "select": "selection list", "span": "text span", "area": "image-map hyperlink", "mark": "marked text", "dfn": "definition", "var": "variable", "cite": "work title", "thead": "table header", "head": "document metadata container", "option": "option item", "form": "user-submittable form", "hr": "horizontal rule", "link": "metadata for inter-document relationships", "b": "bold", "colgroup": "table column group", "keygen": "key-pair generator", "ul": "unordered list", "del": "deleted text", "iframe": "inline frame", "pre": "preformatted text", "ins": "inserted text", "tbody": "table body", "html": "document root", "nav": "navigation", "details": "on-demand control", "command": "user action control", "samp": "sample text", "map": "image map", "object": "embedded object", "figcaption": "figure caption", "a": "anchor or hyperlink", "textarea": "multi-line text input", "i": "italics", "q": "quotation", "u": "underline", "time": "date or time", "audio": "embedded audio stream", "section": "document outline section", "abbr": "abbreviation"});
jQuery.localization.extend("en", "dialog-common", {"close": "Close", "nevermind": "Nevermind", "ok": "Commit changes", "product-name": "X-Ray Goggles"});
jQuery.localization.extend("en", "command-descriptions", {"quit": "Deactivate goggles", "remix": "Replace/remix selected element", "help": "This help reference", "css-quasimode": "View/edit computed style of selected element", "undo": "Undo", "dom-descend": "Descend to child element", "bug-report": "Report a bug", "remove": "Remove selected element", "dom-ascend": "Ascend to parent element", "uproot": "Publish your remix", "redo": "Redo"});
jQuery.localization.extend("en", "css-property-docs", {"letter-spacing": "The<code> letter-spacing </code>CSS property specifies spacing behavior between text characters.", "right": "The <code>right</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property specifies part of the position of positioned elements.", "vertical-align": "The <code>vertical-align</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property specifies the vertical alignment of an inline or table-cell element.", "color": "The <code>color</code> CSS property sets the foreground color of an element's text content", "float": "The <code>float</code> CSS property specifies that an element should be taken from the normal flow and placed along the left or right side of its container, where text and inline elements will wrap around it.", "font-size": "The <code>font-size</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property specifies the size of the font. The font size may, in turn, change the size of other items, since it is used to compute the value of <code>em</code> and <code>ex</code> length units.", "min-height": "The<code> min-height </code>CSS property is used to set the minimum height of a given element. It prevents the used value of the <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/height\">height</a></code>\n property from becoming smaller than the value specified for<code> min-height</code>.", "height": "The<code> height </code>CSS property specifies the height of the content area of an element. The <a title=\"en/CSS/Box_model#content\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS/box_model#content\">content area</a> is <em>inside</em> the padding, border, and margin of the element.", "word-spacing": "The<code> word-spacing </code>CSS property specifies spacing behavior between tags and words.", "text-rendering": "The <code>text-rendering</code> CSS property provides information to the rendering engine about what to optimize for when rendering text. The browser makes trade-offs among speed, legibility, and geometric precision. The text-rendering property is an SVG property that is not defined in any CSS standard. However, Gecko and WebKit browsers let you apply this property to HTML and XML content on Windows, Mac OS X and Linux.&nbsp;", "font-style": "The<code> font-style </code>CSS property allows<code> italic </code>or<code> oblique </code>faces to be selected within a <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/font-family\">font-family</a></code>\n.<br> ", "background-clip": "The<code> background-clip </code>CSS property specifies whether an element's background, either the color or image, extends underneath its border.", "background-size": "The<code> background-size </code>CSS property specifies the size of the background images.", "line-height": "On inline elements, the<code> line-height </code>CSS property specifies the height that is used in the calculation of the line box height.<br>\nOn block level elements,<code> line-height </code>specifies the minimal height of line boxes within the element.", "list-style-image": "The<code> list-style-image </code>CSS property sets the image that will be used as the list item marker. It is often more convenient to use the shortcut <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/list-style\">list-style</a></code>\n.", "background-repeat": "The <code>background-repeat</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property defines how background images are repeated. A background image can be repeated along the horizontal axis, the vertical axis, both, or not repeated at all. When the repetition of the image tiles doesn't let them exactly cover the background, the way adjustments are done can be controlled by the author: by default, the last image is clipped, but the different tiles can instead be re-sized, or space can be inserted between the tiles.", "background-origin": "The<code> background-origin </code>CSS property determines the background positioning area, that is the position of the origin of an image specified using the <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/background-image\">background-image</a></code>\n CSS property.", "bottom": "The <code>bottom</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property participates in specifying the position of <em>positioned elements</em>.", "text-overflow": "The <code>text-overflow</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property determines how overflowed content that is not displayed is signaled to the users. It can be clipped, display an ellipsis ('<code>\u2026</code>', <code style=\"text-transform: uppercase;\">U+2026 Horizontal Ellipsis</code>) or a Web author-defined string.", "top": "The <code>top</code> CSS property specifies part of the position of positioned elements. It has no effect on non-positioned elements.", "min-width": "The<code> min-width </code>CSS property is used to set the minimum width of a given element. It prevents the used value of the <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/width\">width</a></code>\n property from becoming smaller than the value specified for<code> min-width</code>.", "width": "The<code> width </code>CSS property specifies the width of the content area of an element. The <a title=\"en/CSS/box_model#content\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS/box_model#content\">content area</a> is <em>inside</em> the padding, border, and margin of the element.", "font-variant": "The<code> font-variant </code>CSS property selects a<code> normal</code>, or<code> small-caps </code>face from a font family. Setting<code> font-variant </code>is also possible by using the <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/font\">font</a></code>\n shorthand.", "font-weight": "The <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/font-weight\">font-weight</a></code>\n <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property specifies the weight or boldness of the font. However, some fonts are not available in all weights; some are available only on <code>normal</code> and <code>bold</code>.", "background-color": "The <code>background-color</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property sets the background color of an element, either through a color value or the keyword <code>transparent</code>.", "opacity": "The <code>opacity</code> CSS property specifies the transparency of an element, that is, the degree to which the background behind the element is overlaid.", "direction": "The <code>direction</code> CSS property should be set to match the direction of the text: <code>rtl</code> for Hebrew or Arabic text and <code>ltr</code> for other scripts. This should normally be done as part of the document (e.g., using the <code>dir</code> attribute in HTML) rather than through direct use of CSS.", "word-wrap": "The <code>word-wrap</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property is used to to specify whether or not the browser is allowed to break lines within words in order to prevent overflow when an otherwise unbreakable string is too long to fit.", "visibility": "The<code> visibility </code>CSS property is used for two things:", "text-indent": "The<code> text-indent </code>CSS property specifies how much horizontal space should be left before beginning of the first line of the text content of an element. Horizontal spacing is with respect to the left (or right, for right-to-left layout) edge of the containing block element's box.", "text-shadow": "The<code> text-shadow </code>CSS property adds shadows to text. It accepts a comma-separated list of shadows to be applied to the text and <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/text-decoration\">text-decorations</a></code>\n of the element.", "z-index": "The<code> z-index </code>CSS property specifies the z-order of an element and its descendants. When elements overlap, z-order determines which one covers the other. An element with a larger z-index generally covers an element with a lower one.", "background-attachment": "If a <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/background-image\">background-image</a></code>\n is specified, the <code>background-attachment</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property determines whether that image's position is fixed within the viewport, or scrolls along with its containing block.", "white-space": "The<code> white-space </code>CSS property is used to to describe how whitespace inside the element is handled.", "list-style-type": "The<code> list-style-type </code>CSS property specifies appearance of a list item element. As it is the only one who defaults to <code>display:list-item</code>, this is usually a <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/HTML/Element/li\">&lt;li&gt;</a></code>\n element, but can be any element with this <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/display\">display</a></code>\n value.", "font-family": "The<code> font-family </code>CSS property allows for a prioritized list of font family names and/or generic family names to be specified for the selected element. Unlike most other CSS properties, values are separated by a comma to indicate that they are alternatives. The browser will select the first font on the list that is installed on the computer, or that can be downloaded using the information provided by a <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/@font-face\">@font-face</a></code>\n at-rule.", "text-align": "The<code> text-align </code>CSS property describes how inline content like text is aligned in its parent block element.<code> text-align </code>does not control the alignment of block elements itself, only their inline content.", "background-image": "The<code> background-image </code>CSS property sets the background images for an element. The images are drawn on successive stacking context layers, with the first specified being drawn as if it is the closest to the user. The <a title=\"border\" rel=\"internal\" href=\"https://developer.mozilla.org/cn/CSS/border\">borders</a> of the element are then drawn on top of them, and the <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/background-color\">background-color</a></code>\n is drawn beneath them.", "background-position": "The<code> background-position </code>CSS property sets the initial position, relative to the background position layer defined by <code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/background-origin\">background-origin</a></code>\n for each defined background image.", "clear": "The <code>clear</code> <a title=\"CSS\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS\">CSS</a> property specifies whether an element can be next to <a title=\"en/CSS/float\" rel=\"internal\" href=\"https://developer.mozilla.org/en/CSS/float\">floating</a> elements that precede it or must be moved down (cleared) below them.", "text-decoration": "The<code> text-decoration </code>CSS property is used to set the text formattings <code>underline, overline, line-through</code> and <code>blink</code>.", "cursor": "The<code> cursor </code>CSS property specifies the mouse cursor displayed when the mouse pointer is over an element.", "position": "The<code> position </code>CSS property chooses alternative rules for positioning elements, designed to be useful for scripted animation effects.", "list-style-position": "The<code> list-style-position </code>CSS property specifies the position of the marker box in the principal block box. It is often more convenient to use the shortcut <span class=\"lang lang-en\"><code><a rel=\"custom\" href=\"https://developer.mozilla.org/en/CSS/list-style\">list-style</a></code>\n</span>.", "text-transform": "The <code>text-transform</code> CSS property specifies how to capitalize an element's text. It can be used to make text appear in all-uppercase or all-lowercase, or with each word capitalized.", "display": "The <code>display</code> CSS property specifies the type of rendering box used for an element. In HTML, default <code>display</code> property values are taken from behaviors described in the HTML specifications or from the browser/user default stylesheet. The default value in XML is <code>inline</code>.", "left": "The <code>left</code> CSS property specifies part of the position of positioned elements."});
jQuery.localization.extend("en", "bug-report-dialog", {"publishing": "Publishing...", "success": "Here is the URL for your bug that anyone can view.", "to-internet": "Publish To Internet", "header": "Report A Bug", "intro": "Enter a description for the bug you're experiencing below. Note that your description, as well as the current page you're using the goggles on, will be made public, as Hackasaurus is an open-source project.", "error": "Sorry, an error occurred. Please try again later.", "to-internet-desc": "Instantly publish your bug to a URL that anyone can view."});
jQuery.localization.extend("en", "input", {"unload-blocked": "You have made unsaved changes to this page."});
jQuery.localization.extend("en", "hud-overlay", {"and": "and", "pointing-at": "pointing at", "class": "class", "element": "element", "ancestor-intro": "It is inside a", "focused-intro": "You are on a", "default-html": "<span>Web X-Ray Goggles activated! Press ESC to deactivate.</span>", "with": "with", "id": "id"});

(function(jQuery) {
	var locale = "es";

	jQuery.localization.extend(locale, "hud-overlay", {
		"default-html": "<span>Gafas de Rayos X activadas! Haz clic en ESC para desactivarlas.</span>",
		"element": "elemento",
		"with": "con",
		"id": "id",
		"and": "y",
		"class": "clase",
		"pointing-at": "apuntando a",
		"focused-intro": "Estás en un",
		"ancestor-intro": "Está dentro de"
	});

	jQuery.localization.extend(locale, "input", {
		"link-click-blocked": 'Si quieres seguir ese link, desactiva antes las gafas presionando ESC.'
	});

	jQuery.localization.extend(locale, "command-manager", {
		"executed": "Ejecutado",
		"undid": 'Sin hackear',
		"redid": 'Hackeado',
		"cannot-undo-html": '<span>No queda nada que desacer!</span>',
		"cannot-redo-html": '<span>No queda nada que rehacer!</span>'
	});

	jQuery.localization.extend(locale, "mix-master", {
		"too-big-to-change": "Cambiar eso sería una mala idea.",
		"too-big-to-remix-html": "<div>El elemento <code>&lt;${tagName}&gt;</code> es demasiado grande para remezclarlo. Selecciona uno más pequeño!</div>",
		"deletion": "borrado",
		"replacement": "substitución"
	});

	jQuery.localization.extend(locale, "dialog-common", {
		"ok": "Ok",
		"nevermind": "No importa"
	});

	jQuery.localization.extend(locale, "mix-master-dialog", {
		"html-header": "Código fuente HTML",
		"skeleton-header": "Lo que tu navegador ve",
		"rendering-header": "Lo que tú ves"
	});

	jQuery.localization.extend(locale, "introduction", {
		"headline": 'Welcome to NewsJack.',
		"explanation": 'This is a tool designed to let you define and share your own global news.  Just click on anything and you can edit it. Headlines, pictures, links, text, anything. Once you\'re done just hit the publish button below and share your version of the news.'
	});
})(jQuery);

(function(jQuery) {

	var locale = "fr";

	jQuery.localization.extend(locale, "hud-overlay", {
		"default-html": "<span>Vos lunettes aux rayons X ont été activées ! Appuyez sur la touche « Esc » pour les désactiver.</span>",
		"element": " ",
		"with": "ayant pour",
		"id": "identifiant",
		"and": "et",
		"class": "classe",
		"pointing-at": "pointant vers",
		"focused-intro": "Vous êtes sur une balise",
		"ancestor-intro": "À l'intérieur d'une balise"
	});

	jQuery.localization.extend(locale, "input", {
		"link-click-blocked": 'Avant de suivre ce lien, désactivez les lunettes en appuyant sur la touche « Esc ».'
	});

	jQuery.localization.extend(locale, "command-manager", {
		"executed": "Effectué",
		"undid": 'Annulé',
		"redid": 'Rétabli',
		"cannot-undo-html": '<span>Plus de modification à annuler !</span>',
		"cannot-redo-html": '<span>Plus de modification à rétablir !</span>'
	});

	jQuery.localization.extend(locale, "mix-master", {
		"too-big-to-change": "Ce n'est pas une bonne idée.",
		"too-big-to-remix-html": "<div>Je ne peux pas remixer cette balise <code>&lt;${tagName}&gt;</code>, il y a trop de contenu. Essayez d'en sélectionner une plus petite.</div>",
		"deletion": "suppression",
		"replacement": "remplacement"
	});

	jQuery.localization.extend(locale, "dialog-common", {
		"ok": "Ok",
		"nevermind": "Pas grave"
	});

	jQuery.localization.extend(locale, "mix-master-dialog", {
		"html-header": "Code source HTML",
		"skeleton-header": "Ce que voit le navigateur",
		"rendering-header": "Ce que vous voyez"
	});

	jQuery.localization.extend(locale, "introduction", {
		"headline": 'Welcome to NewsJack.',
		"explanation": 'This is a tool designed to let you define and share your own global news.  Just click on anything and you can edit it. Headlines, pictures, links, text, anything. Once you\'re done just hit the publish button below and share your version of the news.'
	});
})(jQuery);

(function(jQuery) {
	function makeAbsoluteURL(baseURI, url) {
		if (url.match(/^https?:/))
			return url;
		return baseURI + url;
	}
	jQuery.webxraySettings = {
		extend: jQuery.extend,
		url: function(name) {
			if (jQuery.isArray(this[name])) {
				var self = this;
				return jQuery.map(this[name], function(url) {
					return makeAbsoluteURL(self.baseURI, url);
				});
			}
			return makeAbsoluteURL(this.baseURI, this[name]);
		},
		language: navigator.language || navigator.userLanguage,
		baseURI: GLOBAL_BASE_PATH + "hackasaurus/",
		cssURL: "webxray.css",
		preferencesURL: "preferences.html",
		easyRemixDialogURL: "easy-remix-dialog/index.html",
		uprootDialogURL: "uproot-dialog.html",
		bugReportDialogURL: "bug-report-dialog.html",
		hackpubURL: "http://hackpub.hackasaurus.org/",
		bugReportHackpubURL: "http://hackpub.hackasaurus.org/buckets/webxray-bugs/",
		hackpubInjectionURL: "published-hack/injector.js",
		pluginURLs: []
	};
})(jQuery);

/* Help Crap */
(function(jQuery) {
	var $ = jQuery;

	function createLocalizedHelp(keys, locale, platform) {
		locale = locale || jQuery.locale;
		platform = platform || navigator.platform;

		var descriptions = locale.scope('command-descriptions');
		var localizedKeys = [];
		keys.forEach(function(info) {
			var localizedInfo = {key: null, desc: null};
			localizedInfo.key = jQuery.nameForKey(info.key, locale, platform);
			localizedInfo.desc = descriptions(info.cmd);
			localizedKeys.push(localizedInfo);
		});
		return localizedKeys;
	}
	jQuery.extend({
		nameForKey: function(key, locale, platform) {
			locale = locale || jQuery.locale;
			platform = platform || navigator.platform;
			var normalKey = "key-names:" + key;
			var osKey = normalKey + "-" + platform;

			return locale[osKey] ||
			       locale[normalKey] ||
			       key;
		},
		createKeyboardHelpReference: function(keyboardHelp, locale, platform) {
			var keys = createLocalizedHelp(keyboardHelp, locale, platform);
			var table = $('<div class="webxray-help-box"></div>');
			keys.forEach(function(info) {
				var row = $('<div class="webxray-help-row"></div>');
				var keyCell = $('<div class="webxray-help-key"></div>');
				var keyValue = $('<div class="webxray-help-desc"></div>');
				keyCell.append($('<div class="webxray-kbd"></div>').text(info.key));
				keyValue.text(info.desc);
				row.append(keyCell).append(keyValue);
				table.append(row);
			});
			return table;
		}
	});
})(jQuery);

/* Random jQuery Utility Methods */
// Todo -- delete this entire thing.
(function(jQuery) {
	var $ = jQuery;
	var HEX_REGEXP = /#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;
	var RGB_REGEXP = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
	jQuery.extend({

		// Load the given script. Returns a jQuery deferred that resolves
		// when the script is loaded. Nothing happens if the
		// script fails to load.
		loadScript: function loadScript(url) {
			var script = document.createElement('script');
			var deferred = jQuery.Deferred();
			script.setAttribute('src', url);
			script.addEventListener("load", function() {
				document.head.removeChild(script);
				deferred.resolve();
			}, false);
			document.head.appendChild(script);
			return deferred;
		},


		// Return a string that is shortened to be the given maximum
		// length, with a trailing ellipsis at the end. If the string
		// isn't longer than the maximum length, the string is returned
		// unaltered.
		shortenText: function shortenText(text, maxLength) {
			if (text.length > maxLength)
				return text.substring(0, maxLength) + '\u2026';
			return text;
		},

		// Return an rgba()-style CSS color string given a color and an
		// alpha value.
		makeRGBA: function makeRGBA(color, alpha) {
			// WebKit and Gecko use this.
			var match = color.match(RGB_REGEXP);
			if (!match) {
				// This is what Opera uses.
				var hexMatch = color.match(HEX_REGEXP);
				if (hexMatch) {
					match = [null];
					for (var i = 1; i <= 3; i++)
						match.push(parseInt(hexMatch[i], 16));
				} else
				throw new Error("Couldn't parse " + color);
			}
			return "rgba(" + 
				match[1] + ", " +
				match[2] + ", " +
				match[3] + ", " +
				alpha + ")";
		},


		// Like console.warn(), but only does anything if console exists.
		warn: function warn() {
			if (window.console && window.console.warn) {
				if (window.console.warn.apply)
					window.console.warn.apply(window.console, arguments);
				else // IE9's console.warn doesn't have an apply method...
					window.console.warn(arguments[0] + " " + arguments[1]);
			}
		}
	});
	
	jQuery.fn.extend({
		// returns whether at least one of the matched elements is a
		// void element (i.e., has no closing tag).
		isVoidElement: function() {
			return this.is("area, base, br, col, command, embed, hr, img, " +
				"input, keygen, link, meta, param, source, " +
				"track, wbr");
		},
		// works much like jQuery's html() with no arguments, but
		// includes HTML code for the matched elements themselves.
		// unlike jQuery, this will include all matched elements.
		outerHtml: function outerHtml() {
			var clonedElement = this.clone();
			var trivialParent = $('<div></div>').append(clonedElement);
			return trivialParent.html();
		},

		// Given a descendant on the first matched element, returns a CSS
		// selector that uniquely selects only the descendant from the
		// first matched element.
		pathTo: function pathTo(descendant) {
			var root = this[0];
			var target = $(descendant).get(0);
			var parts = [];

			for (var node = target; node && node != root; node = node.parentNode) {
				var n = $(node).prevAll(node.nodeName.toLowerCase()).length + 1;
				var id = $(node).attr("id");
				var className = $(node).attr("class");
				var classNames = [];
				var selector = node.nodeName.toLowerCase();

				// Class and id parts are based on jQuery-GetPath code.
				if (typeof(id) != "undefined" && id.length)
					selector += "#" + id;

				if (typeof(className) != "undefined" && className.length)
					jQuery.each(jQuery.trim(className).split(/[\s\n]+/), function() {
					// Only keep the sane-looking class names. The CSS standard
					// does prescribe escape patterns for odd characters in
					// selectors, but jQuery's selector parser isn't completely
					// standards-compliant, so we'll stick with the safe ones.
					if (/^[A-Za-z0-9_\-]+$/.test(this))
						classNames.push(this);
				});

				if (classNames.length)
					selector += "." + classNames.join('.');

				selector += ':nth-of-type(' + n + ')';
				parts.push(selector);
			}
			parts.reverse();
			return ' > ' + parts.join(' > ');
		},

		// Temporarily remove the set of matched elements,
		// returning a removal object with one method,
		// undo(), that can be used to undo the removal.

		// TODO -- This may not be useful any longer
		temporarilyRemove: function temporarilyRemove() {
			var undoers = [];
			jQuery.each(this, function(i, element) {
				var document = element.ownerDocument;
				var replacer = document.createTextNode('');
				element.parentNode.replaceChild(replacer, element);
				undoers.push(function() {
					replacer.parentNode.replaceChild(element, replacer);
				});
			});
			return {
				undo: function undo() {
					jQuery.each(undoers, function(i, undoer) {
						undoer();
					});
					undoers = null;
				}
			};
		},

		// Return the nth ancestor of the first matched element.
		ancestor: function ancestor(generation) {
			var ancestor = this[0];

			for (var i = 0; i < generation; i++)
				if (ancestor.parentNode)
					ancestor = ancestor.parentNode;
				else
					return null;

			return $(ancestor);
		},

		// Return the bounding client rectangle of the first element
		// in the selection, taking CSS transforms into account if
		// possible.
		//
		// The returned object has top/left/height/width properties.
		bounds: function bounds() {
			try {
				var rect = this.get(0).getBoundingClientRect();
				var window = this.get(0).ownerDocument.defaultView;
				return {
					top: rect.top + window.pageYOffset,
					left: rect.left + window.pageXOffset,
					height: rect.height,
					width: rect.width
				};
			} catch (e) {
				// Not sure if this will ever get called, but there's code in
				// Tilt that deals with this kind of situation, and we'd like to
				// gracefully fallback to code that we know works if the above
				// fails. For more discussion, see bug #98:
				//
				// http://hackasaurus.lighthouseapp.com/projects/81472/tickets/98

				var pos = this.offset();
				return {
					top: pos.top,
					left: pos.left,
					height: this.outerHeight(),
					width: this.outerWidth()
				};
			}
		},
		// Create and return a div that floats above the first
		// matched element.
		overlay: function overlay() {
			return;
		},

		// Like jQuery.append(), but accepts an arbitrary number of arguments,
		// and automatically converts string arguments into text nodes.
		emit: function emit() {
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (typeof(arg) == "string")
					arg = document.createTextNode(arg);
				this.append(arg);
			}
		},
		// Resizes and repositions the currently matched element to
		// match the size and position of the given target by animating
		// it and then executing the given callback.
		resizeTo: function resizeTo(target, cb) {
			return;
		},
		// Resizes and repositions the currently matched element to
		// match the size and position of the given target by animating
		// it, then fades out the currently matched element and
		// removes it from the DOM.
		resizeToAndFadeOut: function resizeToAndFadeOut(target) {
			return;
		},
		// Removes the class and, if the class attribute is now empty, 
		// removes the attribute as well (jQuery remove class does not)..
		reallyRemoveClass: function reallyRemoveClass(classname) {
			this.removeClass(classname).filter('[class=""]').removeAttr('class');
			return this;
		}
	});
})(jQuery);
(function(jQuery) {
	var $ = jQuery;
	function makeDoctypeTag(doctype) {
		if (!doctype)
			return '';
		var tag = '<!DOCTYPE ' + doctype.name;
		if (doctype.publicId && doctype.publicId.length)
			tag += ' PUBLIC "' + doctype.publicId + '"';
		if (doctype.systemId && doctype.systemId.length)
			tag += ' "' + doctype.systemId + '"';
		return tag += '>';
	}

	jQuery.extend({

		// Copy the DOM, save the DOM.
		openUprootDialog: function(input) {
			$(document).uprootIgnoringWebxray(function(html) {
				// Prepare Uproot
				var injectURL = jQuery.webxraySettings.url("hackpubInjectionURL");
				var hackpubInfo = {
					injectURL: injectURL,
					originalURL: remix_url,
					submissionDate: (new Date()).toString(),
					dropdownExplanation: jQuery.locale.get('dropdown:explanation'),
					dropdownTitle: jQuery.locale.get('dropdown:headline')
				};
				var remixInfo = {
					"id": null,
					"img": null,
					"imgURL": null,
					"html": null,
					"url": null,
					"thumb_x": null,
					"thumb_y": null,
					"thumb_h": null,
					"thumb_w": null,
					"pubURL": null
				}

				// Set basic information
				remixInfo.id = remix_id;
				remixInfo.url = remix_url;
				
				// Insert remix header
				//html += '<script>hackpubInfo = ' + JSON.stringify(hackpubInfo) + '</script>';
				//html += '<script src="' + injectURL + '"></script>';
				remixInfo.html = html;

				// Set up Queue Variable
				var next = function() {
					$("body").dequeue("uproot");
				}

				// Create mask
				var showMask = function(message) {
					var $mask = $("#newsjack-mask");
					if($mask.length == 0)
						$mask = $("<div class='webxray-base' />")
							.addClass("webxray-base")
							.attr("id","newsjack-mask")
							.appendTo($("body"));
					$mask.empty();

					var $mask_content = $("<h1 />")
						.addClass("webxray-base")
						.text(message)
						.appendTo($mask);
				}

				var hideMask = function() {
					$("#newsjack-mask").remove();
				}

				var hideInterface = function() {
					$(".webxray-hud-box").hide();
					$(".webxray-toolbar").hide();
					next();
				};

				var createScreenshot = function() {
					showMask("Creating Screenshot...");
					var html2obj = html2canvas($('#newsjack_content')[0], {
						proxy: GLOBAL_BASE_PATH + "api/proxy.php",
						logging: true,
						onrendered: function(canvas) {
							remixInfo.img = canvas.toDataURL();
							next();
						}
					});
				}

				var saveImage = function() {
					showMask("Saving Screenshot...");
					$.ajax({
						url: GLOBAL_BASE_PATH + "api/saveimg.php",
						type: "POST",
						data: {
							'r': remixInfo.id,
							'source': remixInfo.img
						},
						success: function(imgURL) {
							remixInfo.imgURL = GLOBAL_BASE_PATH + imgURL;
						},
						complete: function() {
							next();
						}
					});
				}

				var publishRemix = function() {
					showMask("Publishing Remix...");
					jQuery.ajax({
						type: 'POST',
						url: jQuery.webxraySettings.url("hackpubURL") + "publish",
						data: {
							'html': remixInfo.html,
							'original-url': hackpubInfo.originalURL
						},
						crossDomain: true,
						dataType: 'json',
						success: function(data) {
							remixInfo.pubURL = data["published-url"];
						},
						complete: function() {
							next();
						}

					});
				}

				var shortenURL = function() {
					showMask("Shortening URL...");
					$.ajax({
						url: "../../api/shorten.php",
						type: "GET",
						dataType: "json",
						data: { url: remixInfo.pubURL },
						success: function(data, textStatus, jqXHR) {
							if(data.status_code == 200)
								remixInfo.pubURL = data.data.url;
							next();
						}
					});
				}

				var saveRemix = function() {
					showMask("Saving Remix...");
					$.ajax({
						url: "../../api/storage.php",
						type: "GET",
						data: {
							r: remixInfo.id,
							url: remixInfo.pubURL
						},
						success: function(data, textStatus, jqXHR) {
							next();
						}
					});
				}

				var saveThumb = function() {
					showMask("Saving Thumbnail...");
					$.ajax({
						url: "../../api/savethumb.php",
						type: "POST",
						dataType: "json",
						data: {
							r: remixInfo.id,
							x: remixInfo.thumb_x,
							y: remixInfo.thumb_y,
							h: remixInfo.thumb_h,
							w: remixInfo.thumb_w
						},
						success: function(data, textStatus, jqXHR) {
							alert("Submitted!");
						},
						complete: function() {
							$(".thumbnail").hide();
							hideMask();
						}
					});
				}

				var renderDialog = function() {
					var $dialog = jQuery.newModalDialog(input);

					var $content = $("<div />")
						.addClass("webxray-base")
						.addClass("container")
						.attr("id","uproot-dialog");

					var $buttons = $("<div />")
						.addClass("webxray-base")
						.addClass("buttons")
						.appendTo($content);

					var $close = $("<div />")
						.addClass("webxray-base")
						.addClass("close-button")
						.text(jQuery.locale.get("dialog-common:close"))
						.click(function() {
							$dialog.close();
						})
						.appendTo($buttons);

					var $header = $("<div />")
						.addClass("webxray-base")
						.addClass("header")
						.html("<h1>Share your Remix</h1>")
						.appendTo($content);

					var $sharelist = $("<div />")
						.addClass("webxray-base")
						.addClass("sharelist")
						.appendTo($content);

					var $share = $("<div />")
						.addClass("webxray-base")
						.addClass("share")
						.addClass("web_share")
						.html("<a href='" + remixInfo.pubURL +  "'' target='_blank'></a>")
						.appendTo($sharelist);

					var $to_facebook = $("<div />")
						.addClass("webxray-base")
						.addClass("share")
						.addClass("fb_share")
						.html("<a href='http://www.facebook.com/sharer.php?src=sp&u=" + encodeURI(remixInfo.pubURL) + "' target='_blank'></a>")
						.appendTo($sharelist);
					
					var $to_twitter = $("<div />")
						.addClass("webxray-base")
						.addClass("share")
						.addClass("twitter_share")
						.html("<a href='https://twitter.com/intent/tweet?text=Breaking%20News!&url=" + encodeURI(remixInfo.pubURL) + "' target='_blank'></a>")
						.appendTo($sharelist);

					var $to_img = $("<div />")
						.addClass("webxray-base")
						.addClass("share")
						.addClass("img_share")
						.html("<a href='" + remixInfo.imgURL + "' target='_blank'></a>")
						.appendTo($sharelist);

					var $thumb = $("<div />")
						.addClass("webxray-base")
						.addClass("thumbnail")
						.appendTo($content);

					var $thumb_header = $("<h2 />")
						.addClass("webxray-base")
						.addClass("gallery-header")
						.html("Submit to the Gallery")
						.appendTo($thumb);

					var $thumb_header = $("<p />")
						.addClass("webxray-base")
						.addClass("gallery-description")
						.html("Select part of the screenshot below to feature your remix in our gallery.")
						.appendTo($thumb);

					var $save_thumb = $("<div />")
						.addClass("webxray-base")
						.addClass("save_thumb")
						.html("Submit to Gallery")
						.click(function() {
							if(remixInfo.thumb_x == null) {
								alert("Please be sure to select a thumbnail first")
								return;
							}
							saveThumb();
						})
						.appendTo($thumb);

					var $full_container = $("<div />")
						.addClass("webxray-base")
						.addClass("full_container")
						.appendTo($thumb);

					var $full_image = $("<img />")
						.addClass("webxray-base")
						.attr("src", remixInfo.imgURL)
						.addClass("full_image")
						.appendTo($full_container);

					function showPreview(coords) {
						var rx = 100 / coords.w;
						var ry = 100 / coords.h;
						remixInfo.thumb_x = coords.x;
						remixInfo.thumb_y = coords.y;
						remixInfo.thumb_h = coords.h;
						remixInfo.thumb_w = coords.w;
					}

					$full_image.Jcrop({
						onChange: showPreview,
						onSelect: showPreview,
						aspectRatio: 1
					});


					$dialog.populate($content);
					next();
				};

				var showInterface = function() {
					$(".webxray-hud-box").show();
					$(".webxray-toolbar").show();
					next();
				}

				// Populate the order of operations
				$("body").queue("uproot", [
					hideInterface,
					createScreenshot,
					saveImage,
					publishRemix,
					shortenURL,
					saveRemix,
					showInterface,
					function() { hideMask(); next();},
					renderDialog,
				]);

				// Start the process
				next();
			});
		}
	});

	jQuery.fn.extend({
		uprootIgnoringWebxray: function(cb) {
			$(document).uproot({
				success: cb,
				ignore: $(".webxray-hud-box, .webxray-overlay, " +
					".webxray-dialog-overlay, link.webxray, " +
					"#webxray-is-active, .webxray-toolbar, " +
					".webxray-style-info, .webxray-tmsg-overlay")
			});
		},
		uproot: function(cb) {
			var options = {
				ignore: $()
			};
			if (typeof(cb) == 'object') {
				options = cb;
				cb = options.success;
			}
			var elem = this[0];
			var document = elem.contentDocument || elem;
			if (document.nodeName != "#document")
				throw new Error("first item of query must be a document or iframe");
			var base = document.createElement('base');
			if ($('base', document).length == 0) {
				$(base).attr('href', document.location.href);
				$(document.head).prepend(base);
			}
			if (cb)
				setTimeout(function() {
					var ignore = options.ignore.add('script', document);
					var removal = ignore.temporarilyRemove();
					var doctype = makeDoctypeTag(document.doctype);
					var html = doctype + '\n<html>' +
					document.documentElement.innerHTML + '</html>';
					removal.undo();
					$(base).remove();
					cb.call(elem, html);
				}, 0);
		}
	});
})(jQuery);



(function(jQuery) {
	var TAG_COLORS = ["#FFFFFF"];
	var NUM_TAG_COLORS = TAG_COLORS.length;
	var TAG_COLOR_MAP = {
		img: 0,
		p: 0,
		div: 0,
		a: 0,
		span: 0,
		body: 0,
		h1: 0,
		html: 0,
		footer: 0
	};
	var DEFAULT_OVERLAY_OPACITY = 0.7;

	function tagNameToNumber(tagName) {
		var total = 0;
		for (var i = 0; i < tagName.length; i++)
			total += tagName.charCodeAt(i);
		return total;
	}

	jQuery.extend({
		// This is only really exported so unit tests can use it.
		NUM_TAG_COLORS: NUM_TAG_COLORS,
		
		// Returns the color hex for the "official" Web X-Ray color
		// for the given tag name, excluding angled brackets.
		colorForTag: function colorForTag(tagName) {
			var colorNumber;

			tagName = tagName.toLowerCase();
			if (tagName in TAG_COLOR_MAP)
				colorNumber = TAG_COLOR_MAP[tagName];
			else
				colorNumber = (tagNameToNumber(tagName) % NUM_TAG_COLORS);

			return TAG_COLORS[colorNumber];
		}
	});
	jQuery.fn.extend({
		// Applies the "official" Web X-Ray color for fromElement to
		// the current set of matched elements with the given
		// optional opacity. Returns the current set of matched
		// elements to support chaining.
		applyTagColor: function applyTagColor(fromElement, opacity) {
			var bgColor;
			var baseColor = $.colorForTag($(fromElement).get(0).nodeName);
			
			if (opacity === undefined)
				opacity = DEFAULT_OVERLAY_OPACITY;

			bgColor = $.makeRGBA(baseColor, opacity);

			this.css({backgroundColor: bgColor});
			return this;
		},
		// Like $.overlay(), but applies the "official" Web X-Ray color
		// for the element type being overlaid, with the given opacity.
		// A default opacity is used if none is provided.
		overlayWithTagColor: function overlayWithTagColor(opacity) {
			return;
		}
	});
})(jQuery);

/* Custom event / listener pattern */
(function(jQuery) {
	jQuery.eventEmitter = function eventEmitter(object) {
		var handlers = {};
		object.emit = function emit(event, data) {
			if (event in handlers)
				handlers[event].forEach(function(handler) {
					handler(data);
				});
		};
		object.on = object.addListener = function on(event, handler) {
			if (!(event in handlers))
				handlers[event] = [];
			handlers[event].push(handler);
		};
		object.removeListener = function removeListener(event, handler) {
			if (event in handlers) {
				var index = handlers[event].indexOf(handler);
				if (index != -1)
					handlers[event].splice(index, 1);
			}
		};

		object.removeAllListeners = function removeAllListeners(type) {
			if (type in handlers)
				delete handlers[type];
		};
		return object;
	};
})(jQuery);


/* Element Overlay */
(function(jQuery) {
	jQuery.focusedOverlay = function focusedOverlay(options) {
		if (!options)
			options = {};
		var useAnimation = options.useAnimation;
		var ancestorIndex = 0;
		var ancestorOverlay = null;
		var overlay = null;
		var element = null;

		function labelOverlay(overlay, target, finalSize) {
			return;
		}

		function setAncestorOverlay(ancestor, useAnimation) {
			return;
		}

		var instance = jQuery.eventEmitter({
			element: null,
			ancestor: null,
			getPrimaryElement: function getPrimaryElement() {
				return this.ancestor || this.element;
			},
			unfocus: function unfocus() {
				if (!element)
					return;
				overlay = null;
				element = this.element = null;
				ancestorIndex = 0;
				this.emit('change', this);
			},
			set: function set(newElement) {
				this.unfocus();
				element = this.element = newElement;
				this.emit('change', this);
			},
			destroy: function destroy() {
				this.unfocus();
				this.removeAllListeners('change');
			}
		});
		return instance;
	}
})(jQuery);

/* HUD overlay stuff */

(function(jQuery) {
	var MAX_URL_LENGTH = 35;
	jQuery.hudOverlay = function hudOverlay(options) {
		if (options === undefined)
			options = {};

		var hudContainer = $('<div class="webxray-base webxray-hud-box"></div>');
		var hud = $('<div class="webxray-base webxray-hud"></div>');
		var locale = options.locale || jQuery.locale;
		var l10n = locale.scope("hud-overlay");

		hudContainer.append(hud);
		function showDefaultContent() {
			hud.html(options.defaultContent || l10n("default-html"));
		}

		showDefaultContent();

		return {
			overlayContainer: hudContainer[0],
			overlay: hud[0],
			destroy: function destroy() {
				this.overlay = null;
				hudContainer.remove();
				hudContainer = null;
				hud = null;
			},
			onFocusChange: function handleEvent(focused) {
				function code(string) {
					return $("<code></code>").text(string);
				}

				function elementInfo(element) {
					var info = {
						tagName: "<" + element.nodeName.toLowerCase() + ">",
						id: element.id,
						className: element.className,
						url: element.href || element.src || element.action ||
						element.currentSrc
					};
					
					if (info.url && info.url.length)
						info.url = $.shortenText(info.url, MAX_URL_LENGTH);
					else
						info.url = null;

					return info;
				}
				
				function elementDesc(element) {
					var span = $("<span></span>");
					var info = elementInfo(element);
					var shortDescKey = "short-element-descriptions:" +
					element.nodeName.toLowerCase();
					if (locale.has(shortDescKey))
						span.emit(code(info.tagName),
							" (" + locale.get(shortDescKey) + ") ",
							l10n("element"));
					else
						span.emit(code(info.tagName), " ", l10n("element"));
					if (info.id)
						span.emit(" ", l10n("with"), " ", l10n("id"), " ",
							code(info.id));
					if (info.className)
						span.emit(" " + (info.id ? l10n("and") : l10n("with")),
							" ", l10n("class"), " ",
							code(info.className));
					if (info.url) {
						span.emit((info.id || info.className) ? "," : "",
							" ", l10n("pointing-at"), " ",
							$('<span class="webxray-url"></span>').text(info.url));
					}
					return span;
				}
				if (focused.element) {
					var span = $("<span></span>");
					span.emit(l10n("focused-intro"), " ",
						elementDesc(focused.element), ".");
					if (focused.ancestor)
						span.emit(" ", l10n("ancestor-intro"), " ",
							elementDesc(focused.ancestor), ".");
					hud.empty().append(span);
				} else
				showDefaultContent();
			}
		};
	};
})(jQuery);



/* TODO -- figure out what this is */
(function(jQuery) {
	function getContentSize(content) {
		var staged = $('<div class="webxray-base"></div>');
		staged.append(content.clone());
		staged.css({float: 'left'});
		$(document.body).append(staged);
		var width = staged.width();
		staged.remove();
		return width;
	}

	function onUserActivity(cb, bindTarget) {
		setTimeout(function() {
			var events = ['keydown', 'mousemove', 'touchstart'];
			function onEvent() {
				events.forEach(function(e) { $(bindTarget).unbind(e, onEvent); });
				cb();
			}
			events.forEach(function(e) { $(bindTarget).bind(e, onEvent); });
		}, jQuery.USER_ACTIVITY_DELAY);
	}

	jQuery.extend({
		USER_ACTIVITY_DELAY: 100,
		transparentMessage: function(content, duration, cb, parent, bindTarget) {
			var div = $('<div class="webxray-base webxray-tmsg-overlay">' +
				'<div class="webxray-base webxray-tmsg-outer">' +
				'<div class="webxray-base webxray-tmsg-middle">' +
				'<div class="webxray-base webxray-tmsg-inner">' +
				'</div></div></div></div>');

			var inner = div.find('.webxray-tmsg-inner');
			inner.append(content);
			inner.width(getContentSize(content));
			parent = parent || document.body;
			$(parent).append(div);

			function remove() {
				div.fadeOut(function() {
					div.remove();
					if (cb)
						cb();
				});
			}

			if (duration)
				setTimeout(remove, duration);
			else
				onUserActivity(remove, bindTarget || window);

			return div;
		}
	});
})(jQuery);

(function(jQuery) {
	var DEFAULT_PROPERTIES = [
		"background-attachment",
		"background-clip",
		"background-color",
		"background-image",
		"background-origin",
		"background-position",
		"background-repeat",
		"background-size",
		"font-family",
		"font-size",
		"font-style",
		"font-variant",
		"font-weight",
		"height",
		"list-style-image",
		"list-style-position",
		"list-style-type",
		"min-height",
		"min-width",
		"text-align",
		"text-anchor",
		"text-decoration",
		"text-indent",
		"text-overflow",
		"text-rendering",
		"text-shadow",
		"text-transform",
		"top",
		"left",
		"bottom",
		"right",
		"color",
		"clear",
		"cursor",
		"direction",
		"display",
		"position",
		"float",
		"letter-spacing",
		"line-height",
		"opacity",
		"visibility",
		"white-space",
		"width",
		"vertical-align",
		"word-spacing",
		"word-wrap",
		"z-index"
	].sort();

	DEFAULT_PROPERTIES.forEach(function(name) {
		if (name.match(/image$/))
			jQuery.cssHooks[jQuery.camelCase(name)] = {
				set: function(elem, value) {
					if (value != "none" && !value.match(/^\s*url\(.*\)/))
						return "url(" + value + ")";
					return value;
				}
			};
		});

	function makeCssValueEditable(event) {
		var row = $(this);
		var widget = row.data("propertyWidget");

		if (event.shiftKey) {
			open('https://developer.mozilla.org/en/CSS/' + widget.name, 'info');
			return;
		}

		if (widget.isBeingEdited())
			return;

		var nameCell = $(this).find('.webxray-name');
		var valueCell = $(this).find('.webxray-value');
		var originalValue = valueCell.text();
		var form = $('<form><input type="text"></input></form>');
		var textField = form.find("input");

		valueCell.empty().append(form);
		textField.val(originalValue).select().focus();

		// The -1 is needed on Firefox, or else the whole field will
		// wrap to the next line.
		textField.width(row.width() - nameCell.outerWidth() - 1);
		
		function revertToOriginal() {
			form.remove();
			valueCell.text(originalValue);
			widget.clearPreview();
		}

		function confirmChange() {
			var newValue = textField.val();
			revertToOriginal();
			widget.changeValue(newValue);
		}

		textField.blur(confirmChange);
		textField.keydown(function(event) {
			if (event.keyCode == $.keys.ESC) {
				revertToOriginal();
				return false;
			}
		});
		textField.keyup(function(event) {
			widget.previewValue(textField.val());
		});

		form.submit(function() {
			confirmChange();
			return false;
		});
	}

	function buildPropertyWidget(element, row, style, parentStyle, name, locale, hud) {
		var nameCell = $('<div class="webxray-name"></div>');
		var valueCell = $('<div class="webxray-value"></div>');

		// Replace hyphens with non-breaking ones to keep
		// the presentation looking nice.
		nameCell.text(name.replace(/-/g, '\u2011'));
		row.append(nameCell);
		row.append(valueCell);

		var lastPreviewValue = null;

		var self = {
			name: name,
			getValue: function() {
				return valueCell.text();
			},
			isBeingEdited: function() {
				return (row.find('form').length != 0);
			},
			refresh: function() {
				var value = $.normalizeStyleProperty(style, name);
				// TODO: It might be possible for us to return from this
				// function when in fact we need to change class information.
				// Need to think about this more.
				if (valueCell.text() == value)
					return;
				
				valueCell.text(value);
				valueCell.attr("class", "webxray-value");
				if (parentStyle &&
					$.normalizeStyleProperty(parentStyle, name) != value)
					valueCell.addClass("webxray-value-different-from-parent");
				if ($.normalizeStyleProperty(element.style, name) == value)
					valueCell.addClass("webxray-value-matches-inline-style");
				if (name.match(/color$/)) {
					var colorBlock = $('<div class="webxray-color-block"></div>');
					colorBlock.css('background-color', value);
					valueCell.append(colorBlock);
				}
			},
			clearPreview: function() {
				if (lastPreviewValue !== null) {
					jQuery.style(element, name, lastPreviewValue);
					lastPreviewValue = null;
				}
			},
			previewValue: function(newValue) {
				self.clearPreview();
				lastPreviewValue = jQuery.style(element, name);
				jQuery.style(element, name, newValue);
			},
			changeValue: function(newValue) {
				var originalValue = valueCell.text();
				if (newValue != originalValue) {
					$(element).css(name, newValue);
					self.refresh();
					row.trigger('css-property-change');
				}
			}
		};

		row.data("propertyWidget", self);
		row.mouseover(function() {
			var docKey = "css-property-docs:" + name;
			if (locale.has(docKey)) {
				var moreInfo = $('<span class="webxray-more-info"></span>')
				.text(locale.get("style-info:more-info"));
				$(hud.overlay).html(locale.get(docKey))
				.append(moreInfo)
				.find("a").css({textDecoration: "none"});
			}
		});
		self.refresh();
	}

	function PrimaryTranslucentOverlay(overlay, primary) {
		var tOverlay = $(primary).overlayWithTagColor(0.2);

		function onCssPropertyChange() {
			tOverlay.show();
			tOverlay.resizeTo(primary, function() {
				tOverlay.fadeOut();
			});
		}

		overlay.bind('css-property-change', onCssPropertyChange);
		tOverlay.hide();

		return {
			destroy: function() {
				overlay.unbind('css-property-change', onCssPropertyChange);
				tOverlay.remove();
			}
		};
	}

	function ModalOverlay(overlay, primary, input) {
		var startStyle = $(primary).attr("style");
		var translucentOverlay = PrimaryTranslucentOverlay(overlay, primary);

		function handleKeyDown(event) {
			if (self.isBeingEdited())
				return;
			switch (event.keyCode) {
				case $.keys.ESC:
					event.preventDefault();
					event.stopPropagation();
					self.close();
					break;

				case $.keys.LEFT:
				case $.keys.RIGHT:
					input.handleEvent(event);
					if (primary.parentNode) {
						startStyle = $(primary).attr("style");
						overlay.show().find('.webxray-row').each(function() {
							$(this).data("propertyWidget").refresh();
						});
					} else {
					// Um, our target element is no longer attached to
					// the document. Just exit the style editing mode.
					
					// TODO: Is this the most humane behavior?
					self.close();
				}
				break;
			}
		}

		function recordChanges() {
			var endStyle = $(primary).attr("style");
			if (startStyle != endStyle) {
				if (typeof(startStyle) == 'undefined')
					$(primary).removeAttr("style")
				else
					$(primary).attr("style", startStyle);
				startStyle = endStyle;
				self.emit('change-style', endStyle);
			}
		}
		
		overlay.addClass("webxray-style-info-locked");
		overlay.bind('css-property-change', recordChanges);
		overlay.find('.webxray-row').bind('click', makeCssValueEditable);
		window.addEventListener("keydown", handleKeyDown, true);  

		var self = jQuery.eventEmitter({
			isBeingEdited: function() {
				return (overlay.find('form').length != 0);
			},
			close: function() {
				overlay.removeClass("webxray-style-info-locked");
				overlay.unbind('css-property-change', recordChanges);
				overlay.find('.webxray-row').unbind('click', makeCssValueEditable);
				overlay.find('.webxray-close-button').unbind('click', self.close);
				window.removeEventListener("keydown", handleKeyDown, true);
				translucentOverlay.destroy();
				self.emit('close');
			}
		});

		overlay.find('.webxray-close-button').bind('click', self.close);

		return self;
	}

	jQuery.extend({
		normalizeStyleProperty: function normalizeStyleProperty(style, name) {
			var value = style.getPropertyValue(name);

			if (name.match(/image$/) && value) {
				var urlMatch = value.match(/url\("?([^"]*)"?\)/);

				if (urlMatch)
					value = urlMatch[1];
			}
			return value;
		},
		styleInfoOverlay: function styleInfoOverlay(options) {
			var focused = options.focused;
			var commandManager = options.commandManager;
			var locale = options.locale || jQuery.locale;
			var propertyNames = options.propertyNames;
			var mouseMonitor = options.mouseMonitor;
			var hud = options.hud;
			var body = options.body || document.body;
			var isVisible = false;
			var l10n = locale.scope("style-info");
			var modalOverlay = null;

			var overlay = $('<div class="webxray-base webxray-style-info"></div>');
			$(body).append(overlay);
			overlay.hide();

			focused.on('change', refresh);

			function refresh() {
				if (!isVisible || modalOverlay)
					return;

				var primary = focused.getPrimaryElement();
				overlay.empty();

				if (primary) {
					var info = $(primary).getStyleInfo(propertyNames, locale, hud);
					var instructions = $('<div class="webxray-instructions"></div>');
					var close = $('<div class="webxray-close-button"></div>');
					instructions.html(l10n("tap-space-html"));
					close.text(locale.get("dialog-common:ok"));
					overlay.append(info).append(instructions).append(close);
					overlay.show();
				} else {
					overlay.hide();
				}
			}

			function isMouseInOverlay() {
				var mouse = mouseMonitor.lastPosition;
				var pos = overlay.offset();
				var width = overlay.width();
				var height = overlay.height();
				var xDiff = mouse.pageX - pos.left;
				var yDiff = mouse.pageY - pos.top;
				var isInOverlay = (xDiff > 0 && xDiff < width) &&
				(yDiff > 0 && yDiff < height);

				return isInOverlay;
			}

			function maybeSwitchSides() {
				if (isMouseInOverlay())
					overlay.toggleClass('webxray-on-other-side');
					// The overlay switched sides; now see if we're in the
					// overlay on the other side.
				if (isMouseInOverlay())
				// We're on the overlay on the other side too, so we're
				// just going to annoy the user if we switch its side.
				// So, we'll restore the overlay to its original position.
				overlay.toggleClass('webxray-on-other-side');
			}

			var self = jQuery.eventEmitter({
				isVisible: function() {
					return isVisible;
				},
				isLocked: function() {
					return (modalOverlay !== null);
				},
				setPropertyNames: function(newPropertyNames) {
					propertyNames = newPropertyNames;
				},
				lock: function(input) {
					var primary = focused.getPrimaryElement();
					if (primary) {
						input.deactivate();
						mouseMonitor.removeListener('move', maybeSwitchSides);
						modalOverlay = ModalOverlay(overlay, primary, input);
						modalOverlay.on('change-style', function(style) {
							commandManager.run("ChangeAttributeCmd", {
								name: l10n("style-change"),
								attribute: "style",
								value: style,
								element: primary
							});
						});
						modalOverlay.on('close', function() {
							modalOverlay = null;
							self.hide();
							input.activate();
							self.emit('unlock');
						});
						focused.unfocus();
						self.emit('lock', {
							element: primary
						});
					}
				},
				show: function() {
					isVisible = true;
					overlay.show();
					refresh();
					mouseMonitor.on('move', maybeSwitchSides);
					maybeSwitchSides();
					self.emit('show');
				},
				hide: function() {
					mouseMonitor.removeListener('move', maybeSwitchSides);
					isVisible = false;
					overlay.hide();
					self.emit('hide');
				},
				destroy: function() {
					if (modalOverlay)
						modalOverlay.close();
					focused.removeListener('change', refresh);
					overlay.remove();
				}
			});
			return self;
		}
	});

	jQuery.fn.extend({
		getStyleInfo: function getStyleInfo(propertyNames, locale, hud) {
			var names = propertyNames || DEFAULT_PROPERTIES;
			var element = this.get(0);
			var window = element.ownerDocument.defaultView;
			var style = window.getComputedStyle(element);
			var parentStyle = null;

			locale = locale || jQuery.locale;
			if (element.nodeName != "HTML")
				parentStyle = window.getComputedStyle(element.parentNode);

			var info = $('<div class="webxray-rows"></div>');
			var NUM_COLS = 1;

			for (var i = 0; i < names.length + (NUM_COLS-1); i += NUM_COLS) {
				var row = $('<div class="webxray-row"></div>');
				for (var j = 0; j < NUM_COLS; j++)
					buildPropertyWidget(element, row, style, parentStyle, names[i+j], locale, hud);
				info.append(row);
			}
			return info;
		}
	});
})(jQuery);


/* All the code related to performing an actual remix */
(function($) {
	// Set up Remixing
	$(function() {

		// Inline Text Remixing
		$("#newsjack_content").find("*").addBack()
			.contents()
			.filter(function() { return this.nodeType == 3 && $(this).text().trim()!=''; })
			.wrap('<div />')
			.parent()
			.addClass("newsjack-inline-text")
			.addClass("newsjack-remixable");

		// Image Replacement Remixing
		$("#newsjack_content").find("img")
			.each(function(index, el) {
				var $el = $(el)
					.addClass("newsjack-image");

				var $container = $("<div />")
					.addClass("newsjack-image-container")
					.css("overflow","hidden")
					.css("position","relative")
					.height($el.height())
					.width($el.width());

				var $clickable = $("<div />")
					.addClass("newsjack-remixable")
					.addClass("newsjack-image-proxy")
					.height($el.height() - 2)
					.width($el.width() - 2)
					.appendTo($container);

				$el.replaceWith($container)
					.appendTo($container);
			})

		// Disable links
		$("#newsjack_content").find("a")
			.attr("href", GLOBAL_BASE_ROOT + GLOBAL_BASE_PATH)
			.click(function() { return false; });

	});


	function NullTransitionEffectManager() {
		return {
			enableDuring: function enableDuring(fn) { fn(); }
		};
	}

	function TransitionEffectManager(commandManager) {
		var isEnabled = false;
		commandManager.on('command-created', function(cmd) {
			cmd.on('before-replace', function before(elementToReplace) {
				if (!isEnabled)
					return;
				var overlay = $(elementToReplace).overlay();
				cmd.on('after-replace', function after(newContent) {
					cmd.removeListener('after-replace', after);
					overlay.applyTagColor(newContent, 0.25)
					.resizeToAndFadeOut(newContent);            
				});
			});
		});

		return {
			enableDuring: function enableDuring(fn) {
				if (!isEnabled) {
					isEnabled = true;
					fn();
					isEnabled = false;
				} else
				fn();
			}
		};
	}

	function MixMaster(options) {
		var hud = options.hud;
		var focused = options.focusedOverlay;
		var locale = options.locale || jQuery.locale;
		var commandManager = options.commandManager;
		var l10n = locale.scope('mix-master');
		var dialogPageMods = null;
		var transitionEffects;

		if (options.disableTransitionEffects)
			transitionEffects = NullTransitionEffectManager();
		else
			transitionEffects = TransitionEffectManager(commandManager);

		function updateStatus(verb, command) {
			var span = $('<span></span>');
			span.text(verb + ' ' + command.name + '.');
			$(hud.overlay).empty().append(span);
		}

		function runCommand(name, options) {
			focused.unfocus();
			var command = commandManager.run(name, options);
			updateStatus(locale.get('command-manager:executed'), command);
		}

		var self = {
			undo: function() {
				if (commandManager.canUndo()) {
					focused.unfocus();
					transitionEffects.enableDuring(function() {
						updateStatus(locale.get('command-manager:undid'),
							commandManager.undo());
					});
				} else {
					var msg = locale.get('command-manager:cannot-undo-html');
					$(hud.overlay).html(msg);
				}
			},
			redo: function() {
				if (commandManager.canRedo()) {
					focused.unfocus();
					transitionEffects.enableDuring(function() {
						updateStatus(locale.get('command-manager:redid'),
							commandManager.redo());
					});
				} else {
					var msg = locale.get('command-manager:cannot-redo-html');
					$(hud.overlay).html(msg);
				}
			},
			deleteFocusedElement: function deleteFocusedElement() {
				var elementToDelete = focused.getPrimaryElement();
				if (elementToDelete) {
					if ($(elementToDelete).is('html, body')) {
						var msg = l10n('too-big-to-change');
						jQuery.transparentMessage($('<div></div>').text(msg));
						return;
					}
					// Replacing the element with a zero-length invisible
					// span is a lot easier than actually deleting the element,
					// since it allows us to place a "bookmark" in the DOM
					// that can easily be undone if the user wishes.
					var placeholder = $('<span class="webxray-deleted"></span>');
					transitionEffects.enableDuring(function() {
						runCommand("ReplaceWithCmd", {
							name: l10n('deletion'),
							elementToReplace: elementToDelete,
							newContent: placeholder
						});
					});
				}
			},

			replaceElement: function(elementToReplace, newContent) {
				runCommand("ReplaceWithCmd", {
					name: l10n('replacement'),
					elementToReplace: elementToReplace,
					newContent: newContent
				});
				return newContent;
			},

			remixFocusedElement: function(options) {
				var input = options.input;
				var focusedElement = focused.getPrimaryElement();
				if(!focusedElement)
					return;

				var $focusedElement = $(focused.getPrimaryElement());
				focused.unfocus();
				input.deactivate();

				// INLINE TEXT
				if($focusedElement.hasClass("newsjack-inline-text")) {
					var $original = $(focusedElement);
					var $replacement = $("<div />")
						.addClass("replacementWrapper")
					
					var $header = $("<div></div>")
						.addClass("replacementHeader")
						.appendTo($replacement)
						.append("<div class='editTitle'>Edit</div>")

					var $closeRemix = $("<div />")
						.addClass("closeTitle")
						.text("X")
						.appendTo($header);

					var $textarea = $("<textarea/>")
						.text($original.text().trim())
						.height($original.height() + 0)
						.width($original.width() + 10)
						.css("font-family", $original.css("font-family"))
						.css("font-size", $original.css("font-size"))
						.css("font-weight", $original.css("font-weight"))
						.appendTo($replacement);

			 		$original.replaceWith($replacement);

			 		$textarea.focus();
			 		$textarea.bind("endEdit", function(e) {
			 			$replacement.replaceWith($original);
			 			$clone = $original.clone()
			 				.text(" " + $textarea.val() + " ");
			 			self.replaceElement($original, $clone);
			 			options.input.activate();
			 		});

			 		$textarea.bind("blur", function(e) { $(this).trigger("endEdit"); });
			 		$textarea.bind("keydown", function(e) { if(e.keyCode == 13) $(this).trigger("endEdit"); });
			 	}

			 	// IMAGE REPLACEMENT
			 	if($focusedElement.hasClass("newsjack-image-proxy")) {
			 		$original = $(focusedElement).parent().find(".newsjack-image");

					var coreImage = new Image();
					coreImage.src = $original.attr("src");


			 		var top = 0;
			 		var left = 0;

					var $dialog = jQuery.newModalDialog(input);

					var $content = $("<div />")
						.addClass("webxray-base")
						.addClass("container")
						.addClass("image-remix-container")
						.attr("id","image-dialog");

					var $image_remixer = $("<div />")
						.addClass("webxray-base")
						.addClass("image-remixer")
						.appendTo($content);

					var $full_container = $("<div />")
						.addClass("webxray-base")
						.addClass("full-container")
						.height($original.parent().height())
						.width($original.parent().width())
						.appendTo($image_remixer);

					var $full_image = $("<img />")
						.addClass("webxray-base")
						.addClass("full-image")
						.attr("src", $original.attr("src"))
						.appendTo($full_container)
						.draggable({
							stop: function(event, ui) {
								top = ui.position.top;
								left = ui.position.left;
							}
						});

					var $zoom_slider = $("<div />")
						.addClass("zoom-slider")
						.slider({
							range: "min",
							min: 10,
							max: 150,
							value: 100,
							slide: function( event, ui ) {
								$full_image.height( ui.value / 100 * coreImage.height);
							}
						})
						.appendTo($image_remixer);

					var $image_url = $("<input />")
						.addClass("webxray-base")
						.addClass("image-url")
						.attr("type", "text")
						.val($original.attr("src"))
						.appendTo($image_remixer)
						.keyup(function() {
							var $this = $(this);
							if (!/^http:\/\//.test($this.val())) { $this.val("http://" + $this.val()); }
							if (/^http:\/\/http:\/\//.test($this.val())) { $this.val($this.val().substring(7)); }
							$full_image.attr("src", $(this).val());
							coreImage.src = $(this).val();
						});

					var $save_image = $("<div />")
						.addClass("webxray-base")
						.addClass("save-changes")
						.html("Save Changes")
						.click(function() {
							$clone = $original.clone();
							$clone.attr("src", $image_url.val())
							$clone.height($full_image.height())
							$clone.width($full_image.width())
							$clone.css("top",top);
							$clone.css("left",left);

				 			self.replaceElement($original, $clone);
				 			options.input.activate();
							$dialog.close();
						})
						.appendTo($image_remixer);

					$dialog.populate($content);
			 	}
			}
		};
		return self;
	}
	jQuery.extend({mixMaster: MixMaster});
})(jQuery);


(function(jQuery) {
	function CommandManager() {
		var undoStack = [];
		var redoStack = [];

		function serializeCommand(cmd) {
			var state = cmd.serialize();
			state.__cmd__ = cmd.registeredName;
			return state;
		}

		function createCommand(name, options) {
			var constructor = registry[name];
			var command = constructor(options);
			command.registeredName = name;
			self.emit('command-created', command);
			return command;
		}

		function deserializeCommand(state) {
			// The fallback here is just for backwards compatibility
			// with old-style serializations.
			var name = state.__cmd__ || "ReplaceWithCmd";      
			return createCommand(name, {state: state});
		}

		var registry = {};

		var self = jQuery.eventEmitter({
			register: function(constructor, name) {
				registry[name] = constructor;
			},
			run: function(name, options) {
				var command = createCommand(name, options);
				undoStack.push(command);
				redoStack.splice(0);
				command.execute();
				self.emit('state-change');
				return command;
			},
			canUndo: function() {
				return (undoStack.length > 0);
			},
			canRedo: function() {
				return (redoStack.length > 0);
			},
			undo: function() {
				var command = undoStack.pop();
				redoStack.push(command);
				command.undo();
				self.emit('state-change');
				return command;
			},
			redo: function() {
				var command = redoStack.pop();
				undoStack.push(command);
				command.execute();
				self.emit('state-change');
				return command;
			},
			getRecording: function() {
				var recording = [];
				var timesUndone = 0;
				while (undoStack.length) {
					var cmd = undoStack[undoStack.length - 1];
					self.undo();
					recording.splice(0, 0, serializeCommand(cmd));
					timesUndone++;
				}
				for (var i = 0; i < timesUndone; i++)
					self.redo();
				return JSON.stringify(recording);
			},
			playRecording: function(recording) {
				recording = JSON.parse(recording);
				undoStack.splice(0);
				redoStack.splice(0);
				for (var i = 0; i < recording.length; i++) {
					var cmd = deserializeCommand(recording[i]);
					undoStack.push(cmd);
					cmd.execute();
				}
			},
			serializeUndoStack: function() {
				var commands = [];
				var timesUndone = 0;
				while (undoStack.length) {
					var cmd = undoStack[undoStack.length - 1];
					commands.push(serializeCommand(cmd));
					self.undo();
					timesUndone++;
				}
				for (var i = 0; i < timesUndone; i++)
					self.redo();
				return JSON.stringify(commands);
			},
			deserializeUndoStack: function(commands) {
				commands = JSON.parse(commands);
				undoStack.splice(0);
				redoStack.splice(0);
				for (var i = 0; i < commands.length; i++) {
					var cmd = deserializeCommand(commands[i]);
					undoStack.push(cmd);
					self.undo();
				}
				for (var i = 0; i < commands.length; i++)
					self.redo();
			}
		});

		self.register(ReplaceWithCmd, "ReplaceWithCmd");
		self.register(ChangeAttributeCmd, "ChangeAttributeCmd");

		return self;
	}

	function ChangeAttributeCmd(options) {
		var name = options.name,
		element = options.element,
		attribute = options.attribute,
		value = options.value;

		function deserialize(state) {
			name = state.name;
			attribute = state.attribute;
			value = state.value;
			element = $(document.documentElement).find(state.selector);
		}

		if (options.state)
			deserialize(options.state);

		function applyValue() {
			this.emit('before-replace', element);
			var oldValue = $(element).attr(attribute);
			if (typeof(value) == 'undefined')
				$(element).removeAttr(attribute);
			else
				$(element).attr(attribute, value);
			value = oldValue;
			this.emit('after-replace', element);
		}

		return jQuery.eventEmitter({
			name: name,
			execute: applyValue,
			undo: applyValue,
			serialize: function() {
				var selector = $(document.documentElement).pathTo(element);

				return {
					name: name,
					selector: selector,
					attribute: attribute,
					value: value
				};
			}
		});
	}

	function ReplaceWithCmd(options) {
		var name = options.name,
		elementToReplace = options.elementToReplace,
		newContent = options.newContent,
		isExecuted = false;

		function deserialize(state) {
			if (typeof(state.isExecuted) == 'undefined')
				isExecuted = true; // support legacy serializations
			else
				isExecuted = state.isExecuted;
			name = state.name;
			if (isExecuted) {
				newContent = $(document.documentElement).find(state.selector);
				elementToReplace = $(state.html);
				if (newContent.length != 1)
					throw new Error("selector '" + state.selector + "' matches " +
						newContent.length + " elements");
			} else {
				newContent = $(state.html);
				elementToReplace = $(document.documentElement).find(state.selector);
				if (elementToReplace.length != 1)
					throw new Error("selector '" + state.selector + "' matches " +
						elementToReplace.length + " elements");
			}
		}

		if (options.state)
			deserialize(options.state);

		return jQuery.eventEmitter({
			name: name,
			execute: function() {
				if (isExecuted)
					throw new Error("command already executed");
				this.emit('before-replace', elementToReplace);
				$(elementToReplace).replaceWith(newContent);
				this.emit('after-replace', newContent);
				isExecuted = true;
			},
			undo: function() {
				if (!isExecuted)
					throw new Error("command not yet executed");
				this.emit('before-replace', newContent);
				$(newContent).replaceWith(elementToReplace);
				this.emit('after-replace', elementToReplace);
				isExecuted = false;
			},
			serialize: function() {
				var selector;
				var html;
				if (isExecuted) {
					selector = $(document.documentElement).pathTo(newContent);
					html = $(elementToReplace).outerHtml();
				} else {
					selector = $(document.documentElement).pathTo(elementToReplace);
					html = $(newContent).outerHtml();
				}
				return {
					isExecuted: isExecuted,
					name: name,
					selector: selector,
					html: html
				};
			}
		});
	}

	jQuery.extend({commandManager: CommandManager});
})(jQuery);


(function(jQuery) {
	jQuery.extend({
		commandManagerPersistence: function CMPersistence(commandManager) {
			return {
				saveHistoryToDOM: function saveHistoryToDOM() {
					$('#webxray-serialized-history-v1').remove();
					var serializedHistory = $('<div></div>');
					serializedHistory.attr('id', 'webxray-serialized-history-v1')
					.text(commandManager.serializeUndoStack()).hide();
					$(document.body).append(serializedHistory);
				},
				loadHistoryFromDOM: function loadHistoryFromDOM() {
					var serializedHistory = $('#webxray-serialized-history-v1');
					if (serializedHistory.length)
						try {
							commandManager.deserializeUndoStack(serializedHistory.text());
						} catch (e) {
							jQuery.warn("deserialization of history in DOM failed", e);
						}
					}
				};
			}
		});
})(jQuery);


/* Modal Dialog Wizard */
(function(jQuery) {
	jQuery.extend({
		newModalDialog: function(input) {
			input.deactivate();
			$(".webxray-overlay").hide();
			var $modal = $('<div />')
				.addClass('webxray-base')
				.addClass('webxray-dialog-overlay')
				.appendTo($("body"));

			var $outer = $('<div />')
				.addClass('webxray-base')
				.addClass('webxray-dialog-outer')
				.appendTo($modal);

			var $middle = $('<div />')
				.addClass('webxray-base')
				.addClass('webxray-dialog-middle')
				.appendTo($outer);

			var $inner = $('<div />')
				.addClass('webxray-base')
				.addClass('webxray-dialog-inner')
				.appendTo($middle);

			var dialog = {
				close: function close(cb) {
					$modal.fadeOut(function() {
						input.activate();
						$modal.remove();
						$modal = null;

						// Firefox seems to trigger a mouseout/mouseover event
						// when we remove the dialog div, so we'll wait a moment
						// before re-activating input so that we don't distract
						// the user by focusing on whatever their mouse happens
						// to be over when the dialog closes.
						setTimeout(function() {
							input.activate();
							input = null;
							window.focus();
							if (cb)
								cb();
						}, 50);
					});
				},
				populate: function($content) {
					$inner.append($content);
				}
			};

			input.deactivate();
			return dialog;
		}
	});
})(jQuery);

(function(jQuery) {
	var keys = {
		DELETE: 8,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		ESC: 27,
		SPACE: 32
	};

	var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	for (var i = 0; i < alphabet.length; i++)
		keys[alphabet[i]] = alphabet.charCodeAt(i);
	
	function isValidFocusTarget(target) {
		var $target = $(target);
		return ($target.hasClass('newsjack-remixable') && !$target.hasClass('webxray-base') && !$target.parents('.webxray-base').length > 0);
	}

	// This function attempts to compensate for a browser's lack of support
	// for the 'pointer-events' CSS feature.
	var maybePassThroughEvent = (function() {
		function topmostNoPointerEvents(element) {
			var topmost = null;
			while (element &&
				getComputedStyle(element).pointerEvents == 'none') {
				topmost = element;
			element = element.parentNode;
		}
		return topmost;
	}

	// Annoying that we have to do browser detection here, but unfortunately
	// we can't simply test for support of the 'pointer-events' CSS feature,
	// as Opera and IE9 support it but only for SVG.
	if ($.browser.opera || $.browser.msie)
		return function(event) {
			if (topmostNoPointerEvents(event.relatedTarget))
				return null;
			var target = topmostNoPointerEvents(event.target);
			if (target) {
				$(target).hide();
				event = {
					target: document.elementFromPoint(event.clientX, event.clientY)
				};
				$(target).show();
			}
			return event;
		}
		else
			return function(event) { return event; };
	})();

	function styleOverlayInputHandlers(options) {
		var styleInfo = options.styleInfoOverlay;
		var quasimodeKeycode = keys[options.quasimodeKey];
		var lockForEditingKeycode = keys[options.lockForEditingKey];
		var isQuasimodeActive = false;

		return {
			keyup: function(event) {
				if (event.keyCode == quasimodeKeycode) {
					isQuasimodeActive = false;
					styleInfo.hide();
					return true;
				}
				return false;
			},
			keydown: function(event) {
				if (event.altKey || event.ctrlKey ||
					event.altGraphKey || event.metaKey) {
					return false;
			}

			switch (event.keyCode) {
				case lockForEditingKeycode:
					if (isQuasimodeActive) {
						isQuasimodeActive = false;
						styleInfo.lock(this);
					}
					return true;
					
				case quasimodeKeycode:
					if (!isQuasimodeActive) {
						isQuasimodeActive = true;
						styleInfo.show();
					}
					return true;
				}
				return false;
			}
		};
	}

	function touchInputHandlers(focused) {
		var lastTouch = null;
		
		function onTouchMove(event) {
			var touches = event.changedTouches;
			var touch = touches[0];
			var element = document.elementFromPoint(touch.clientX,
				touch.clientY);
			if (element == lastTouch)
				return false;
			lastTouch = element;
			if (!isValidFocusTarget(element))
				return false;
			$(element).click();
		}

		return {
			touchstart: onTouchMove,
			touchmove: onTouchMove,
			touchend: function(event) {
				lastTouch = null;
			}
		};
	}
	jQuery.extend({
		keys: keys,
		mouseMonitor: function mouseMonitor() {
			function onMouseMove(event) {
				self.lastPosition.pageX = event.pageX;
				self.lastPosition.pageY = event.pageY;
				self.emit('move', self);
			}
			$(document).mousemove(onMouseMove);
			var self = jQuery.eventEmitter({
				lastPosition: {
					pageX: 0,
					pageY: 0
				},
				unload: function() {
					$(document).unbind('mousemove', onMouseMove);
					self.removeAllListeners();
				}
			});

			return self;
		},
		inputHandlerChain: function inputHandlerChain(eventTypes, eventSource) {
			var handlerChains = {};
			var listeners = {};

			function eventListener(event) {
				for (var i = 0; i < handlerChains[event.type].length; i++) {
					if (handlerChains[event.type][i].call(this, event)) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
				}
			}

			eventTypes.forEach(function(eventName) {
				handlerChains[eventName] = [];
				listeners[eventName] = eventListener;
			});

			var self = jQuery.inputManager(listeners, eventSource).extend({
				add: function(handlers) {
					for (var name in handlers)
						handlerChains[name].push(handlers[name]);
				}
			});
		
			return self;
		},
		inputManager: function inputManager(listeners, eventSource) {
			var isActive = false;

			var self = jQuery.eventEmitter({
				extend: jQuery.extend,
				handleEvent: function handleEvent(event) {
					if (event.type in listeners)
						listeners[event.type].call(self, event);
					else
						throw new Error("Unexpected event type: " + event.type);
				},
				activate: function() {
					// We're listening during the capture phase to intercept
					// any events at the earliest point before they're
					// handled by the page itself. Because JQuery's bind() doesn't
					// appear to allow for listening during the capture phase,
					// we're using document.addEventListener() directly.
					if (!isActive) {
						isActive = true;
						for (var name in listeners)
							eventSource.addEventListener(name, self.handleEvent, true);
						self.emit('activate');
					}
				},
				deactivate: function() {
					if (isActive) {
						isActive = false;
						for (var name in listeners)
							eventSource.removeEventListener(name, self.handleEvent, true);
						self.emit('deactivate');
					}
				}
			});

			return self;
		},
		simpleKeyBindings: function simpleKeyBindings() {
			var bindings = {};
			return {
				set: function(keycodes) {
					for (var keycode in keycodes) {
						if (!(keycode in keys))
							throw new Error('unknown key: ' + keycode);
						bindings[keys[keycode]] = keycodes[keycode];
					}
				},
				handlers: {
					keydown: function(event) {
						if (event.altKey || event.ctrlKey ||
							event.altGraphKey || event.metaKey)
							return false;

						if (typeof(bindings[event.keyCode]) == 'function') {
							bindings[event.keyCode].call(this, event);
							return true;
						}
						return false;
					}
				}
			};
		},
		xRayInput: function xRayInput(options) {
			var focused = options.focusedOverlay;
			var mixMaster = options.mixMaster;
			var commandManager = options.commandManager;
			var eventSource = options.eventSource;
			var onQuit = options.onQuit;
			var persistence = options.persistence;
			var styleInfo = options.styleInfoOverlay;
			var touchesReceived = false;
			var self = jQuery.inputHandlerChain([
				'keydown',
				'keyup',
				'click',
				'mouseout',
				'mouseover',
				'touchstart',
				'touchmove',
				'touchend'
				], eventSource);

			self.add({
				click: function(event) {
					if (isValidFocusTarget(event.target)) {
						focused.set(event.target);
						self.commandBindings['remix'].execute();
						return true;
					}
				},
				touchmove: function(event) {
					touchesReceived = true;
					return false;
				},
				mouseout: function(event) {
					if (touchesReceived)
						// We're likely on a tablet, so this is probably a simulated
						// mouse event that we want to ignore.
						return false;
					if ((event = maybePassThroughEvent(event)) == null)
						return false;

					if (isValidFocusTarget(event.target)) {
						event.target.style.cursor = null;
						focused.unfocus();
						return true;
					}
				},
				mouseover: function(event) {
					if (touchesReceived)
						// We're likely on a tablet, so this is probably a simulated
						// mouse event that we want to ignore.
						return false;
					if ((event = maybePassThroughEvent(event)) == null)
						return false;

					if (isValidFocusTarget(event.target)) {
						event.target.style.cursor = "pointer";
						focused.set(event.target);
						return true;
					}
				}
			});

			self.extend({
				simpleKeyBindings: jQuery.simpleKeyBindings(),
				keyboardHelp: [],
				commandBindings: {},
				showKeyboardHelp: function() {
					var help = jQuery.createKeyboardHelpReference(self.keyboardHelp);
					jQuery.transparentMessage(help);
				},
				addSimpleKeyBindings: function(bindings) {
					bindings.forEach(function(binding) {
						if (binding.cmd) {
							self.keyboardHelp.push(binding);
							self.commandBindings[binding.cmd] = binding;
						}
						if (binding.execute) {
							var simpleBinding = {};
							simpleBinding[binding.key] = binding.execute;
							self.simpleKeyBindings.set(simpleBinding);
						}
					});
				}
			});

			self.addSimpleKeyBindings([
				// {
				// 	key: 'H',
				// 	cmd: 'help',
				// 	execute: function() {
				// 		self.showKeyboardHelp();
				// 	}
				// },
				{
					key: 'R',
					cmd: 'remix',
					neverInToolbar: true,
					execute: function() {
						mixMaster.remixFocusedElement({
							input: self
						});
						return;
					},
				},
				// {
				// 	key: 'C',
				// 	cmd: 'css-quasimode'
				// },
				{
					key: 'DELETE',
					cmd: 'remove',
					execute: function() {
						mixMaster.deleteFocusedElement();
					}
				},
				{
					key: 'LEFT',
					cmd: 'undo',
					alwaysInToolbar: true,
					execute: function() { mixMaster.undo(); }
				},
				{
					key: 'RIGHT',
					cmd: 'redo',
					alwaysInToolbar: true,
					execute: function() { mixMaster.redo(); }
				}
			]);

			self.add(self.simpleKeyBindings.handlers);
			self.add(touchInputHandlers(focused));
			self.add(styleOverlayInputHandlers({
				styleInfoOverlay: styleInfo,
				lockForEditingKey: 'SPACE',
				quasimodeKey: 'C'
			}));

			return self;
		}
	});
})(jQuery);


(function(jQuery) {
	function canBeTouched() {
		return ('ontouchstart' in window);
	}

	function makeButton(glyph, text, cb) {
		var button = $(
			'<div class="webxray-toolbar-button">' +
			'<div class="webxray-toolbar-button-glyph"></div>' +
			'<div class="webxray-toolbar-button-text"></div>' +
			'</div>'
			);
		var glyphDiv = $('.webxray-toolbar-button-glyph', button);
		glyphDiv.text(glyph);
		if (glyph.length != 1)
			glyphDiv.addClass('webxray-toolbar-button-glyph-tiny');
		$('.webxray-toolbar-button-text', button).text(text);
		button.find('*').andSelf().addClass('webxray-base');
		button.bind('touchstart touchmove click', function(event) {
			event.preventDefault();
			cb.call(this);
		});
		return button;
	}

	jQuery.extend({
		touchToolbar: function(input, locale, platform) {
			locale = locale || jQuery.locale;
			platform = platform || navigator.platform;

			var toolbar = $('<div class="webxray-base webxray-toolbar"></div>');
			var keyNames = locale.scope('key-names');
			var shortDescriptions = locale.scope('short-command-descriptions');

			input.keyboardHelp.forEach(function(binding) {
				if (binding.execute && (canBeTouched() || binding.alwaysInToolbar) && !binding.neverInToolbar)
					makeButton(jQuery.nameForKey(binding.key, locale, platform),
						shortDescriptions(binding.cmd), function() {
							binding.execute();
						}).appendTo(toolbar);
			});
			
			toolbar.appendTo(document.body);
			input.on('activate', function() { toolbar.fadeIn(); });
			input.on('deactivate', function() { toolbar.fadeOut(); });

			return {
				unload: function() {
					toolbar.remove();
					toolbar = null;
				}
			};
		}
	});
})(jQuery);

(function(jQuery) {
	jQuery.extend({
		blurIndicator: function(input, focusable, body) {
			body = body || document.body;

			function showBlurIndicator() {
				var blurIndicator = $('<div class="webxray-base ' +
					'webxray-dialog-overlay"></div>');
				$(body).append(blurIndicator);
				$(focusable).one('focus', function() {
					// If we wait a moment before removing the indicator, it'll receive
					// any click events instead of elements underneath it. We can
					// safely assume that any click events made immediately after
					// focus are really just intended to focus the page rather
					// than click on a specific element, so we want to swallow
					// such events rather than e.g. take the user to a new page.
					setTimeout(function() {
						blurIndicator.remove();
						blurIndicator = null;
					}, 10);
					input.activate();
				});
				input.deactivate();
			}
			
			input.on('activate', function() {
				$(focusable).bind('blur', showBlurIndicator);
			});
			input.on('deactivate', function() {
				$(focusable).unbind('blur', showBlurIndicator);
			});
		}
	});
})(jQuery);


(function(jQuery) {
	function addHelpButton(hud, input) {
		var help = $('<div class="webxray-base webxray-help">?</div>');
		help.click(input.showKeyboardHelp);    
		$(hud.overlayContainer).append(help);
	}
	function addPublishButton(hud, input) {
		var publish = $('<div class="webxray-base webxray-publish">Share Remix</div>');
		publish.click(function() {jQuery.openUprootDialog(input)});    
		$(hud.overlayContainer).append(publish);
	}
	function addExplanation(hud, input) {
		var explanation = $('<div class="webxray-base webxray-explanation"></div>');
		//explanation.html('<h1 class="webxray-base">' + jQuery.locale.get("introduction:headline") + '</h1><p class="webxray-base">' + jQuery.locale.get("introduction:explanation") + '</p>');
		$(hud.overlayContainer).append(explanation);
	}
	// If the user has made changes to the page, we don't want them
	// to be able to navigate away from it without facing a modal
	// dialog.
	function ModalUnloadBlocker(commandManager) {
		function beforeUnload(event) {
			if (commandManager.canUndo()) {
				event.preventDefault();
				return jQuery.locale.get("input:unload-blocked");
			}
		}

		window.addEventListener("beforeunload", beforeUnload, true);
		
		return {
			unload: function() {
				window.removeEventListener("beforeunload", beforeUnload, true);
			}
		};
	}

	jQuery.extend({
		xRayUI: function xRayUI(options) {
			var isUnloaded = false;
			var hud = jQuery.hudOverlay();
			var focused = jQuery.focusedOverlay({
				useAnimation: true
			});
			var commandManager = jQuery.commandManager();
			var mixMaster = jQuery.mixMaster({
				hud: hud,
				focusedOverlay: focused,
				commandManager: commandManager
			});
			var persistence = jQuery.commandManagerPersistence(commandManager);
			var mouseMonitor = jQuery.mouseMonitor();
			var styleInfo = jQuery.styleInfoOverlay({
				focused: focused,
				commandManager: commandManager,
				mouseMonitor: mouseMonitor,
				hud: hud
			});
			var input = jQuery.xRayInput({
				focusedOverlay: focused,
				styleInfoOverlay: styleInfo,
				mixMaster: mixMaster,
				commandManager: commandManager,
				persistence: persistence,
				eventSource: options.eventSource,
				onQuit: function() {
					self.emit('quit');
				}
			});
			var touchToolbar = jQuery.touchToolbar(input);
			var indicator = jQuery.blurIndicator(input, window);
			var modalUnloadBlocker = ModalUnloadBlocker(commandManager);

			var self = jQuery.eventEmitter({
				persistence: persistence,
				start: function() {
					persistence.loadHistoryFromDOM();
					addExplanation(hud, input);
					addPublishButton(hud, input);
					$(document.body).append(hud.overlayContainer);
					focused.on('change', hud.onFocusChange);
					input.activate();
					$(window).focus();
				},
				unload: function() {
					if (!isUnloaded) {
						isUnloaded = true;
						focused.destroy();
						focused = null;
						input.deactivate();
						input = null;
						touchToolbar.unload();
						touchToolbar = null;
						hud.destroy();
						hud = null;
						styleInfo.destroy();
						styleInfo = null;
						indicator = null;
						mouseMonitor.unload();
						mouseMonitor = null;
						modalUnloadBlocker.unload();
						modalUnloadBlocker = null;
					}
				},
				// These exports are primarily for use by third-party code.
				jQuery: jQuery,
				focusedOverlay: focused,
				hudOverlay: hud,
				mixMaster: mixMaster,
				styleInfoOverlay: styleInfo,
				commandManager: commandManager,
				input: input,
				modalUnloadBlocker: modalUnloadBlocker
			});
			return self;
		}
	});
})(jQuery);


(function(jQuery) {
	var removeOnUnload = $();

	function getMyScript() {
		return $('script.webxray, script[src$="webxray.js"]');
	}

	// If the goggles are already active on this page, just exit.
	if ($("#webxray-is-active").length) {
		getMyScript().remove();
		return;
	}

	function waitForCSSToLoad() {
		// Sadly, link elements don't fire load events on most/all browsers,
		// so we'll define a special style in our stylesheet and keep
		// polling an element with that style until it has what we've
		// defined in the stylesheet.
		var div = $('<div id="webxray-wait-for-css-to-load"></div>');
		var deferred = jQuery.Deferred();

		div.hide();
		$(document.body).append(div);
		function checkIfLoaded() {
			// This works on most browsers.
			var content = div.css('content');
			// This works on Safari.
			var bgColor = div.css('background-color');

			if ((content && content.match(/CSS\ is\ loaded/)) ||
				(bgColor && bgColor.match(/rgb\(0,\s*1,\s*2\)/))) {
				div.remove();
				clearInterval(intervalID);
				deferred.resolve();
			}
		}

		var intervalID = setInterval(checkIfLoaded, 10);
		checkIfLoaded();
		return deferred;
	}

	function waitForPreferencesToLoad() {
		var deferred = jQuery.Deferred();
		var iframe = document.createElement('iframe');
		iframe.src = jQuery.webxraySettings.url('preferencesURL');
		$(document.body).append(iframe);
		$(iframe).hide();
		window.addEventListener('message', function onMessage(event) {
			if (event.source == iframe.contentWindow) {
				window.removeEventListener('message', onMessage, false);
				$(iframe).remove();
				try {
					var prefs = JSON.parse(event.data);
					jQuery.webxraySettings.extend(prefs);
				} catch (e) {
					jQuery.warn("loading preferences failed");
					jQuery.warn("preference data is", event.data);
					jQuery.warn("exception thrown is", e);
				}
				deferred.resolve();
			}
		}, false);
		return deferred;
	}

	function loadPrerequisites(cb) {
		var script = getMyScript();

		if (jQuery.webxraySettings.baseURI.length == 0) {
			var baseURI = script.attr("src").match(/(.*)webxray\.js$/)[1];
			jQuery.webxraySettings.baseURI = baseURI;
		}

		var cssURL = jQuery.webxraySettings.url("cssURL");
		var cssLink = $('link[href="' + cssURL + '"]');
		var active = $('<div id="webxray-is-active"></div>');
		
		script.remove();
		active.hide();
		$(document.body).append(active);
		
		// This is a test to see if we're using legacy bookmarklet code,
		// which inserts the link tag itself.
		if (cssLink.length == 0) {
			cssLink = $('<link rel="stylesheet" class="webxray"></link>');
			$(document.head).append(cssLink.attr("href", cssURL));
		}

		removeOnUnload = removeOnUnload.add([cssLink.get(0), active.get(0)]);

		var cssLoaded = waitForCSSToLoad();
		var prefsLoaded = waitForPreferencesToLoad();
		var modsLoaded = jQuery.Deferred();	 // Load localization mods (for some reason the main page doesn't load locales in the same way as everything else)
		jQuery.ajax({
			url: "api/localeMods.php?c=" + window.campaignId,
			dataType: "jsonp",
			complete: function(jqXHR, textStatus) {
				modsLoaded.resolve();
			},
			success: function(data) {
				jQuery.localization.createMods(data);
			}
		});

		jQuery.when(prefsLoaded, cssLoaded, modsLoaded).done(cb);
	}

	function loadPlugins(cb) {
		var pluginsToLoad = [];

		jQuery.webxraySettings.url("pluginURLs").forEach(function(plugin) {
			pluginsToLoad.push(jQuery.loadScript(plugin));
		});
		jQuery.when.apply(jQuery.when, pluginsToLoad).done(cb);
	}

	$(window).ready(function() {
		loadPrerequisites(function() {
			jQuery.localization.init(["en", jQuery.webxraySettings.language]);

			var ui = jQuery.xRayUI({eventSource: document});

			window.webxrayUI = ui;
			loadPlugins(function() {
				var welcomeMsg = $("<div></div>");
				welcomeMsg.html(jQuery.locale.get("hud-overlay:default-html"));
				jQuery.transparentMessage(welcomeMsg);

				ui.start();
				Webxray.triggerWhenLoaded(ui);
				ui.on('quit', function() {
					ui.persistence.saveHistoryToDOM();
					$(document).trigger('unload');
					delete window.webxrayUI;
				});
				$(document).unload(function() {
					ui.unload();
					removeOnUnload.remove();
				});
			});
		});
	});

})(jQuery);