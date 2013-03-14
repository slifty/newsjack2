(function(jQuery) {
  "use strict";

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
