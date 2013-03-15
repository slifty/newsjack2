<?php
	include_once("includes/common.php");
	global $CACHE_TIMEOUT, $BASE_DIRECTORY;
	
	// Clean the URL
	$url = isset($_GET['url'])?$_GET['url']:"";
	$url = substr($url,0,7) == "http://"?$url:"http://".$url;
	$url = Util::getFinalUrl($url);
	
	// Check if this is a campaign
	$campaign =  Campaign::getObject(isset($_GET['c'])?$_GET['c']:"");
	
	// Store the original version
	$remix = new Remix();
	if($campaign != null) $remix->setCampaignID($campaign->getItemID());
	$remix->setOriginalURL($url);
	$remix->loadOriginalDOM($url, $CACHE_TIMEOUT);
	$remix->save();
	$html = $remix->getOriginalDOM();
	
	// Add in the NewsJack code
	$injection = '<script type="text/javascript" src="'.$BASE_DIRECTORY.'js/jquery.min.js" charset="utf-8"></script>';
	$injection .= '<script type="text/javascript" src="'.$BASE_DIRECTORY.'hackasaurus/webxray.js" class="webxray"></script>';
	$injection .= '<script type="text/javascript">var remix_id = '.$remix->getItemID().';var remix_url = "'.$remix->getOriginalURL().'";var campaignId="'.(isset($_GET['c'])?$_GET['c']:"").'";</script>';
	$injection .= '<script type="text/javascript" src="'.$BASE_DIRECTORY.'js/html2canvas.js" charset="utf-8"></script>';

	$html = preg_replace("<.*body.*>","<body><div id='newsjack_content'>", $html, 1);
	$html = str_replace("</body>","</div>".$injection."</body>", $html);
	
	echo $html;
?>