<?php
	include_once("includes/common.php");
	
	global $CACHE_TIMEOUT;
	
	// Cookie Jar
	$ckfile = tempnam ("/tmp", "CURLCOOKIE");
	
	// Clean the URL
	$url = isset($_GET['url'])?$_GET['url']:"";
	$url = substr($url,0,7) == "http://"?$url:"http://".$url;
	$url = Util::getFinalUrl($url);
	
	// Is this cached?
	$cache = Cache::getObjectByURL($url);
	
	if(is_null($cache) || (time() - $cache->getDateCreated()) >= $CACHE_TIMEOUT) {
		// Set up the cache
		Cache::clearCache($url);
		$cache = new Cache();
		$cache->setCachedURL($url);
		
		// CURL
		$ch = curl_init();
		curl_setopt( $ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1" );
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt ($ch, CURLOPT_COOKIEJAR, $ckfile); 
		curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		$data = curl_exec($ch);
		$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
		$data = 'data:'.$content_type.';base64,'.base64_encode($data);
		curl_close($ch);
		
		$cache->setCachedHTML($data);
		$cache->save();
	}
	
	$data = $cache->getCachedHtml();
	
	if(isset($_GET['callback'])) {
		header("Content-type: application/javascript"); 
		echo($_GET['callback']."('".$data."');");
	}
?>
