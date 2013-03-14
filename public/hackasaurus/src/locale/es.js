(function(jQuery) {
  "use strict";

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
