<?php
require_once("includes/engine/classes/FactoryObject.php");
require_once("includes/engine/classes/Util.php");
require_once(__DIR__."/Cache.php");

// Make horribly inefficient regular expressions work
// TODO -- don't do this.
ini_set("pcre.backtrack_limit", 100000000);

class Remix extends FactoryObject{
	
	# Constants
	const CAMPAIGN_ALL = 0;
	
	
	# Instance Variables
	private $campaignID; // int
	private $originalDOM; // string
	private $originalURL; // string
	private $remixDOM; // string
	private $remixURL; // string
	private $imgURL; // string
	private $thumbURL; // string
	private $isFeatured; // bool
	private $dateCreated; // timestamp
		
	
	public function __construct($itemID = FactoryObject::INIT_EMPTY) {
		$dataArrays = static::gatherData((int)$itemID);
		$this->load($dataArrays[0]);
	}
	
	# FactoryObject Methods
	protected static function gatherData($objectString, $start=FactoryObject::LIMIT_BEGINNING, $length=FactoryObject::LIMIT_ALL) {
		$dataArrays = array();
		
		// Load an empty object
		if($objectString === FactoryObject::INIT_EMPTY) {
			$dataArray = array();
			$dataArray['itemID'] = 0;
			$dataArray['campaignID'] = 0;
			$dataArray['originalDOM'] = "";
			$dataArray['originalURL'] = "";
			$dataArray['remixDOM'] = "";
			$dataArray['remixURL'] = "";
			$dataArray['imgURL'] = "";
			$dataArray['thumbURL'] = "";
			$dataArray['isFeatured'] = "";
			$dataArray['dateCreated'] = 0;
			$dataArrays[] = $dataArray;
			return $dataArrays;
		}
		
		// Load a default object
		if($objectString === FactoryObject::INIT_DEFAULT) {
			$dataArray = array();
			$dataArray['itemID'] = 0;
			$dataArray['campaignID'] = 0;
			$dataArray['originalDOM'] = "";
			$dataArray['originalURL'] = "";
			$dataArray['remixDOM'] = "";
			$dataArray['remixURL'] = "";
			$dataArray['imgURL'] = "";
			$dataArray['thumbURL'] = "";
			$dataArray['isFeatured'] = "";
			$dataArray['dateCreated'] = 0;
			$dataArrays[] = $dataArray;
			return $dataArrays;
		}
		
		// Set up for lookup
		$mysqli = DBConn::connect();
		
		// Load the object data
		$queryString = "SELECT remixes.id AS itemID,
							   remixes.campaign_id AS campaignID,
							   remixes.original_dom AS originalDOM,
							   remixes.original_url AS originalURL,
							   remixes.remix_dom AS remixDOM,
							   remixes.remix_url AS remixURL,
							   remixes.img_url AS imgURL,
							   remixes.thumb_url AS thumbURL,
							   remixes.is_featured AS isFeatured,
							   unix_timestamp(remixes.date_created) AS dateCreated
						  FROM remixes
						 WHERE remixes.id IN (".$objectString.")";
		if($length != FactoryObject::LIMIT_ALL) {
			$query_string .= "
						 LIMIT ".DBConn::clean($start).",".DBConn::clean($length);
		}
		
		$result = $mysqli->query($queryString)
			or print($mysqli->error);
		
		while($resultArray = $result->fetch_assoc()) {
			$dataArray = array();
			$dataArray['itemID'] = $resultArray['itemID'];
			$dataArray['campaignID'] = $resultArray['campaignID'];
			$dataArray['originalDOM'] = $resultArray['originalDOM'];
			$dataArray['originalURL'] = $resultArray['originalURL'];
			$dataArray['remixDOM'] = $resultArray['remixDOM'];
			$dataArray['remixURL'] = $resultArray['remixURL'];
			$dataArray['imgURL'] = $resultArray['imgURL'];
			$dataArray['thumbURL'] = $resultArray['thumbURL'];
			$dataArray['isFeatured'] = $resultArray['isFeatured'];
			$dataArray['dateCreated'] = $resultArray['dateCreated'];
			$dataArrays[] = $dataArray;
		}
		
		$result->free();
		return $dataArrays;
	}
	
	public function load($dataArray) {
		$this->itemID = isset($dataArray["itemID"])?$dataArray["itemID"]:0;
		$this->campaignID = isset($dataArray["campaignID"])?$dataArray["campaignID"]:"";
		$this->originalDOM = isset($dataArray["originalDOM"])?$dataArray["originalDOM"]:"";
		$this->originalURL = isset($dataArray["originalURL"])?$dataArray["originalURL"]:"";
		$this->remixDOM = isset($dataArray["remixDOM"])?$dataArray["remixDOM"]:"";
		$this->remixURL = isset($dataArray["remixURL"])?$dataArray["remixURL"]:"";
		$this->imgURL = isset($dataArray["imgURL"])?$dataArray["imgURL"]:"";
		$this->thumbURL = isset($dataArray["thumbURL"])?$dataArray["thumbURL"]:"";
		$this->isFeatured = isset($dataArray["isFeatured"])?$dataArray["isFeatured"]:"";
		$this->dateCreated = isset($dataArray["dateCreated"])?$dataArray["dateCreated"]:0;
	}
	
	
	# Data Methods
	public function validate() {
		return true;
	}
	
	public function save() {
		if(!$this->validate()) return;
		
		$mysqli = DBConn::connect();
		
		if($this->isUpdate()) {
			// Update an existing record
			$queryString = "UPDATE remixes
							   SET remixes.campaign_id = ".DBConn::clean($this->getCampaignID()).",
								   remixes.original_dom = ".DBConn::clean($this->getOriginalDOM()).",
								   remixes.original_url = ".DBConn::clean($this->getOriginalURL()).",
								   remixes.remix_dom = ".DBConn::clean($this->getRemixDOM()).",
								   remixes.remix_url = ".DBConn::clean($this->getRemixURL()).",
								   remixes.img_url = ".DBConn::clean($this->getImgURL()).",
								   remixes.thumb_url = ".DBConn::clean($this->getThumbURL()).",
								   remixes.is_featured = ".DBConn::clean($this->getIsFeatured())."
							 WHERE remixes.id = ".DBConn::clean($this->getItemID());
			
			$mysqli->query($queryString);
		} else {
			// Create a new record
			$queryString = "INSERT INTO remixes
								   (remixes.id,
									remixes.campaign_id,
									remixes.original_dom,
									remixes.original_url,
									remixes.remix_dom,
									remixes.remix_url,
									remixes.img_url,
									remixes.thumb_url,
									remixes.is_featured,
									remixes.date_created)
							VALUES (0,
									".DBConn::clean($this->getCampaignID()).",
									".DBConn::clean($this->getOriginalDOM()).",
									".DBConn::clean($this->getOriginalURL()).",
									".DBConn::clean($this->getRemixDOM()).",
									".DBConn::clean($this->getRemixURL()).",
									".DBConn::clean($this->getImgURL()).",
									".DBConn::clean($this->getThumbURL()).",
									".DBConn::clean($this->getIsFeatured()).",
									NOW())";
			
			$mysqli->query($queryString);
			$this->setItemID($mysqli->insert_id);
		}
		
		// Parent Operations
		return true;
	}
	
	public function delete() {
		parent::delete();
		$mysqli = DBConn::connect();
		
		// Delete this record
		$queryString = "DELETE FROM remixes
						 WHERE remixes.id = ".DBConn::clean($this->getItemID());
		$mysqli->query($queryString);
	}
	
	
	# Getters
	public function getCampaignID() { return $this->campaignID; }
	
	public function getOriginalDOM() { return $this->originalDOM; }
	
	public function getOriginalURL() { return $this->originalURL; }
	
	public function getRemixDOM() { return $this->remixDOM; }
	
	public function getRemixURL() { return $this->remixURL; }
	
	public function getImgURL() { return $this->imgURL; }
	
	public function getThumbURL() { return $this->thumbURL; }
	
	public function getIsFeatured() { return $this->isFeatured; }
	
	public function getDateCreated() { return $this->dateCreated; }
	
	
	# Setters
	public function setCampaignID($int) { $this->campaignID = $int; }
	
	public function setOriginalDOM($str) { $this->originalDOM = $str; }
	
	public function setOriginalUrl($str) { $this->originalURL = $str; }
	
	public function setRemixDOM($str) { $this->remixDOM = $str; }
	
	public function setRemixURL($str) { $this->remixURL = $str; }
	
	public function setImgURL($str) { $this->imgURL = $str; }

	public function setThumbURL($str) { $this->thumbURL = $str; }
	
	public function setIsFeatured($bool) { $this->isFeatured = $bool; }


	# Complex
	public function loadOriginalDOM($cache_timeout) {
		$url = $this->getOriginalURL();
		// Is this cached?
		$cache = Cache::getObjectByURL($url);
		
		if(is_null($cache) || (time() - $cache->getDateCreated()) >= $cache_timeout) {
			// Set up a new cache
			Cache::clearCache($url);
			$cache = new Cache();
			$cache->setCachedURL($url);
			
			// Cookie Jar
			$ckfile = tempnam ("/tmp", "CURLCOOKIE");
	
			// CURL
			$ch = curl_init();
			curl_setopt( $ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1" );
			curl_setopt($ch,CURLOPT_URL,$url);
			curl_setopt ($ch, CURLOPT_COOKIEJAR, $ckfile); 
			curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
			curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
			$data = curl_exec($ch);
			curl_close($ch);
			
			if(preg_match("/<meta http\-equiv=refresh content=\"15\;url\=\/\?(.*?)\"/" ,$data, $matches)) {
				$url = $url."/?".$matches[1];
				$ch = curl_init();
				curl_setopt( $ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1" );
				curl_setopt($ch,CURLOPT_URL,$url);
				curl_setopt ($ch, CURLOPT_COOKIEJAR, $ckfile); 
				curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
				curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
				$data = curl_exec($ch);
				curl_close($ch);
			}
			
			$url_parts = parse_url($url);
			$url_base = $url_parts["scheme"]."://".$url_parts["host"];
			
			// Remove all scripts (force a "noscript" environment)
			$data = preg_replace('/\<script.*?\>.*?\<\/script.*?\>/is',"", $data);
			$data = preg_replace('/<.*noscript>/i',"", $data);
			
			$data = preg_replace('/src=\".*\"(.*)dest_src=\"(.*)\"/i',"src=\"\\2\" \\1", $data);
			$data = preg_replace('/dest_src=\"(.*)\"(.*)src=\".*\"/i',"src=\"\\1\" \\2", $data);
		
			// General Image Fixes
			$data = preg_replace('/src=\"\/(.*?)\"/i', "src=\"".$url_base."/\\1\"", $data);
			$data = preg_replace('/src=\'\/(.*?)\'/i', "src='".$url_base."/\\1'", $data);
			
			// General Link Fixes
			$data = preg_replace('/href=\"\/(.*?)\"/i', "href=\"".$url_base."/\\1\"", $data);
			$data = preg_replace('/href=\'\/(.*?)\'/i', "href='".$url_base."/\\1'", $data);
			
			// CSS Link Fixes
			$data = preg_replace('/\<link(.*?)text\/css(.*?)src\=(.*?)\/\>/i', "<link\\1text/css\\2href=\\3/>", $data);
			
			$cache->setCachedHTML($data);
			$cache->save();
		}
		
		$data = $cache->getCachedHTML();
		$this->setOriginalDOM($data);
	}
	
	
	# Static Methods
	public static function getObjectsByCampaignID($campaignID, $start=FactoryObject::LIMIT_BEGINNING, $quantity = FactoryObject::LIMIT_ALL) {
		$query_string = "SELECT remixes.id as itemID 
						   FROM remixes
						  WHERE (remixes.campaign_id = ".DBConn::clean($campaignID)." OR ".DBConn::clean($campaignID)."=".DBConn::clean(Remix::CAMPAIGN_ALL).")
						    AND (remixes.remix_url != '')
					   ORDER BY remixes.id desc";
		
		return Remix::getObjects($query_string, $start, $quantity);
	}

	public static function getFeaturedObjectsByCampaignID($campaignID, $start=FactoryObject::LIMIT_BEGINNING, $quantity = FactoryObject::LIMIT_ALL) {
		$query_string = "SELECT remixes.id as itemID 
						   FROM remixes
						  WHERE remixes.is_featured = 1
						    AND (remixes.campaign_id = ".DBConn::clean($campaignID)." OR ".DBConn::clean($campaignID)."=".DBConn::clean(Remix::CAMPAIGN_ALL).")
						    AND (remixes.remix_url != '')
					   ORDER BY remixes.id desc";
		
		return Remix::getObjects($query_string, $start, $quantity);
	}
	
	public static function getAllObjects() {
		$query_string = "SELECT remixes.id as itemID 
						   FROM remixes
					   ORDER BY remixes.id";
		return Remix::getObjects($query_string);
	}
}
?>