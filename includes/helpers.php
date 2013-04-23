<?php
	function url_prepend_http($url) {
	    if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
	        $url = "http://" . $url;
	    }
	    return $url;
	}
?>