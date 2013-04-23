<?php
require_once("includes/engine/classes/FactoryObject.php");

class Article extends FactoryObject {
	
	# Constants
	
	
	# Instance Variables
	private $campaignID; // int
	private $url; // string
	private $title; // string
	private $dateCreated; // timestamp

	# Caches
	private $remixes; // array
	

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
			$dataArray['title'] = "";
			$dataArray['url'] = "";
			$dataArray['dateCreated'] = 0;
			$dataArrays[] = $dataArray;
			return $dataArrays;
		}
		
		// Load a default object
		if($objectString === FactoryObject::INIT_DEFAULT) {
			$dataArray = array();
			$dataArray['itemID'] = 0;
			$dataArray['campaignID'] = "";
			$dataArray['title'] = "";
			$dataArray['url'] = "";
			$dataArray['dateCreated'] = 0;
			$dataArrays[] = $dataArray;
			return $dataArrays;
		}
		
		// Set up for lookup
		$mysqli = DBConn::connect();
		
		// Load the object data
		$queryString = "SELECT articles.id AS itemID,
							   articles.campaign_id AS campaignID,
							   articles.title AS title,
							   articles.url AS url,
							   unix_timestamp(articles.date_created) AS dateCreated
						  FROM articles
						 WHERE articles.id IN (".$objectString.")";
		if($length != FactoryObject::LIMIT_ALL) {
			$queryString .= "
						 LIMIT ".DBConn::clean($start).",".DBConn::clean($length);
		}
		
		$result = $mysqli->query($queryString)
			or print($mysqli->error);
		
		while($resultArray = $result->fetch_assoc()) {
			$dataArray = array();
			$dataArray['itemID'] = $resultArray['itemID'];
			$dataArray['campaignID'] = $resultArray['campaignID'];
			$dataArray['title'] = $resultArray['title'];
			$dataArray['url'] = $resultArray['url'];
			$dataArray['dateCreated'] = $resultArray['dateCreated'];
			$dataArrays[] = $dataArray;
		}
		
		$result->free();
		return $dataArrays;
	}
	
	public function load($dataArray) {
		$this->itemID = isset($dataArray["itemID"])?$dataArray["itemID"]:0;
		$this->campaignID = isset($dataArray["campaignID"])?$dataArray["campaignID"]:0;
		$this->title = isset($dataArray["title"])?$dataArray["title"]:"";
		$this->url = isset($dataArray["url"])?$dataArray["url"]:"";
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
			$queryString = "UPDATE articles
							   SET articles.campaign_id = ".DBConn::clean($this->getCampaignID()).",
								   articles.title = ".DBConn::clean($this->getTitle()).",
								   articles.url = ".DBConn::clean($this->getURL())."
							 WHERE articles.id = ".DBConn::clean($this->getItemID());
			
			$mysqli->query($queryString);
		} else {
			// Create a new record
			$queryString = "INSERT INTO articles
								   (articles.id,
									articles.campaign_id,
									articles.title,
									articles.url,
									articles.date_created)
							VALUES (0,
									".DBConn::clean($this->getCampaignID()).",
									".DBConn::clean($this->getTitle()).",
									".DBConn::clean($this->getURL()).",
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
		$queryString = "DELETE FROM articles
						 WHERE articles.id = ".DBConn::clean($this->getItemID());
		$mysqli->query($queryString);
		
	}
	
	
	# Getters
	public function getCampaignID() { return $this->campaignID; }
	
	public function getTitle() { return $this->title; }
	
	public function getURL() { return $this->url; }
	
	public function getDateCreated() { return $this->dateCreated; }

	public function getRemixes() { 
		// Check cache first
		if(!is_null($this->remixes)) return $this->remixes;
		
		$this->remixes = Remix::getObjectsByArticleID($this->getItemID());
		return $this->remixes;
	}

	public function getFeaturedRemixes() {
		return array_filter($this->getRemixes(), function($item) { return $item->getIsFeatured(); });
	}
	
	
	# Setters
	public function setCampaignID($id) { $this->campaignID = $id; }
	
	public function setTitle($str) { $this->title = $str; }
	
	public function setUrl($str) { $this->url = $str; }
	
	
	# Static Methods
	public static function getObjectsByCampaignID($campaignID) {
		$query_string = "SELECT articles.id as itemID 
						   FROM articles
						  WHERE articles.campaign_id = ".DBConn::clean($campaignID)."
					   ORDER BY articles.title";
		return Article::getObjects($query_string);
	}

	public static function getObjects($start=FactoryObject::LIMIT_BEGINNING, $length=FactoryObject::LIMIT_ALL) {
		return parent::getObjects("select id from articles",$start, $length);
	}

}
?>