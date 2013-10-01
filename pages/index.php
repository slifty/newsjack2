<?php
	include_once("includes/common.php");
?>
<!DOCTYPE html>
<html>
	<head>
		<title>NewsJack</title>
		<?php include("includes/partials/head.php"); ?>
		<link rel="stylesheet" href="<?php echo($BASE_DIRECTORY); ?>css/index.css" type="text/css" media="screen" title="no title" charset="utf-8">

		<script type="text/javascript">
			$(function(){
				$("#how-it-works-link").click(function(e) {
					$("#how-it-works").dialog({
						modal: true,
						height: 700,
						width: '50%',
						resizable: false,
						draggable: false,
					});

					$(".custom-dialog-close").click(function(){
						$("#how-it-works").dialog("close");
					});

					return false;
				});
			})
		</script>
		</head>
	<body>
		<?php include("includes/partials/header.php"); ?>
			<div id="navigation">
				<ul>
					<li class="nav-works"><a href="#" id="how-it-works-link">How it Works</a></li>
					<li class="nav-gallery"><a href="<?php echo($BASE_DIRECTORY); ?>site/gallery">Gallery</a></li>
				</ul>
			</div>
			<iframe src="http://player.vimeo.com/video/67487897" width="100%" height="500px" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
			<div id="how-it-works">
				<div class="custom-dialog-close">CLOSE</div>
				<div class="paper-wrapper">
					<div class="paper-content">
						<h2>How it Works</h2>
						<p>Alles is maakbaar met Koppenkapers. Deprimerend nieuws en fouter dan foute uitspraken van politici en zakenlui: jij kunt er je eigen draai aan geven. Met Koppenkapers van Greenpeace kun je een creatieve draai geven aan de tekst én het beeld van een willekeurige website. Zo maak je in een handomdraai meer waarheidsgetrouwe webteksten voor Shell en zet je een betere kop boven een interview met de CEO van Monsanto. Het is tijd om het heft in eigen handen te nemen. Creëer je eigen nieuws!</p>
						<h3>Basic omschrijving van de Tool</h3>
						<p>Koppenkapers scant en kopieert een webpagina (bijvoorbeeld een nieuwsbericht of de website van een bedrijf), waarna je met de opmaak van die pagina aan de slag kunt. Verander titels, uitspraken en zelfs afbeeldingen, en laat de wereld jouw versie van de werkelijkheid zien. Ga naar de gallerij [LINK GALLERY] als je een door Greenpeace voorgesteld artikel wilt hacken of voer direct een webadres [LINK OWN URL] in om zo een zelf gekozen pagina aan te passen.</p>
						<h3>Zelf een URL invoeren</h3>
						<p>Je kunt er ook voor kiezen een andere webpagina te kapen* die niet door Greenpeace is geselecteerd. Dat doe je door naar de betreffende website te gaan en de URL uit de adresbalk van je browser te kopiëren en in het veld hieronder te plakken. Enteren!</p>
						<p>* Afhankelijk van hoe de website is gebouwd, werkt Koppenkapers niet altijd naar wens. Onder andere websites met flash-elementen zijn niet te kapen.</p>
					</div>
				</div>
			</div>
		<?php include("includes/partials/footer.php"); ?>
	</body>
</html>