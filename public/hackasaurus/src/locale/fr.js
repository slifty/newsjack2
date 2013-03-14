(function(jQuery) {
  "use strict";

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
