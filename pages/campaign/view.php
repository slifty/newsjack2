<?php
	include_once("includes/common.php");
	if(!User::isAdministrator()) {
		header("Location: ".$BASE_DIRECTORY."account/login");
		exit();
	}
	$campaign = null;
	$mods = array(
		"introduction:headline" => null,
		"introduction:explanation" => null,
		"mix-master-dialog:title" => null,
		"mix-master-dialog:html-header" => null,
		"dropdown:headline" => null,
		"dropdown:explanation" => null,
	);
	
	// Are we loading an existing campaign?
	if(array_key_exists('c', $_GET)) $campaign = Campaign::getObject($_GET['c']);
	else $campaign = Campaign::getObject(array_shift($CLEAN_PARAMS));
	if($campaign == null) $campaign = new Campaign();
	
	$suggestions = $campaign->getSuggestions();

	foreach($campaign->getLocaleMods() as $mod) {
		$mods[$mod->getModKey()] = $mod;
	}

	if($_SERVER['REQUEST_METHOD'] === 'POST') {
		$campaign->setTitle(isset($_POST['title'])?$_POST['title']:"");
		$campaign->setDescription(isset($_POST['description'])?$_POST['description']:"");
		$campaign->setCode(isset($_POST['code'])?$_POST['code']:"");
		$campaign->save();

		foreach($mods as $key=>$mod) {
			if(!isset($_POST[$key]))
				continue;
			
			$mods[$key] = ($mods[$key] == null)?new LocaleMod():$mods[$key];
			$mods[$key]->setModKey($key);
			$mods[$key]->setModValue($_POST[$key]);
			$mods[$key]->setCampaignID($campaign->getItemId());
			$mods[$key]->save();
			
			if($_POST[$key] == "")
				$mods[$key]->delete();
		}

		foreach($suggestions as $key=>$suggestion) {
			$suggestion->delete();
		}
		$suggestion_titles = isset($_POST['suggestion_titles'])?$_POST['suggestion_titles']:array();
		$suggestion_urls = isset($_POST['suggestion_urls'])?$_POST['suggestion_urls']:array();
		foreach($suggestion_titles as $index=>$title) {
			if($title == "") continue;
			$suggestion = new Suggestion();
			$suggestion->setCampaignID($campaign->getItemId());
			$suggestion->setTitle(array_key_exists($index, $suggestion_titles)?$suggestion_titles[$index]:"");
			$suggestion->setURL(array_key_exists($index, $suggestion_urls)?$suggestion_urls[$index]:"");
			$suggestion->save();
			array_push($suggestions, $suggestion);
		}

		
		if(isset($_POST['delete'])) {
			$campaign->delete();
		}
		header("Location: ".$BASE_DIRECTORY."campaign/view/".$campaign->getItemId());
		exit();
	}
?>

<html>
	<head>
		<title>Campaign</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/campaign_view.css" type="text/css" media="screen" title="no title" charset="utf-8">

	</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
		<div class="content">

			<h1>Campaign</h1>
			<form method="POST">
				<div class="section">
					<h2>Basic Information</h2>
					<p>Provide information about the campaign</p>
					<ul>
						<li><label for="title">Title</label><input type="text" name="title" id="title" value="<?php echo($campaign->getTitle()); ?>"/></li>
						<li><label for="description">Description</label><textarea name="description" id="description" /><?php echo($campaign->getDescription()); ?></textarea></li>
						<li><label for="code">Custom URL</label><div id="code_example">http://www.example.com/</div><input type="text" name="code" id="code" value="<?php echo($campaign->getCode()); ?>" /></li>
					</ul>
				</div>
				
				<div class="section">
					<h2>Suggested Pages</h2>
					<p>Give your users a few suggestions about what pages they should remix.</p>
					<table id="sites">
						<tr>
							<th>Title</th>
							<th>URL</th>
						</tr>
						<?php
							foreach($suggestions as $suggestion) {
								?>
								<tr>
									<td><input type="text" name="suggestion_titles[]" class="suggestion_title" value="<?php echo($suggestion->getTitle()); ?>"/></td>
									<td>http://<input type="text" name="suggestion_urls[]" class="suggestion_url" value="<?php echo($suggestion->getURL()); ?>" /></td>
								</tr>
								<?php
							}
						?>
						<tr>
							<td><input type="text" name="suggestion_titles[]" class="suggestion_title" /></td>
							<td>http://<input type="text" name="suggestion_urls[]" class="suggestion_url" /></td>
						</tr>
						<tr>
							<td><input type="text" name="suggestion_titles[]" class="suggestion_title" /></td>
							<td>http://<input type="text" name="suggestion_urls[]" class="suggestion_url" /></td>
						</tr>
						<tr>
							<td><input type="text" name="suggestion_titles[]" class="suggestion_title" /></td>
							<td>http://<input type="text" name="suggestion_urls[]" class="suggestion_url" /></td>
						</tr>
					</table>
				</div>
				
				<div class="section">
					<h2>Limit Tags</h2>
					<p>Restrict the type of content that users can remix</p>
					<ul>
						<li class="checkbox"><input type="checkbox" name="" id="" value="" /><label for="">Paragraphs</label></li>
						<li class="checkbox"><input type="checkbox" name="" id="" value="" /><label for="">Headings</label></li>
						<li class="checkbox"><input type="checkbox" name="" id="" value="" /><label for="">Links</label></li>
						<li class="checkbox"><input type="checkbox" name="" id="" value="" /><label for="">Images</label></li>
						<li class="checkbox"><input type="checkbox" name="" id="" value="" /><label for="">Lists</label></li>
					</ul>
				</div>
				<input type="submit" name="save" value="save"/>
				<?php if($campaign->getItemID() != 0) { ?>
				<input type="submit" name="delete" value="delete"/>
				<?php } ?>
			</form>
		</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>