<?php
$file_contents  = json_encode(file_get_contents('sarah.json'),JSON_PRETTY_PAINT);
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Weather App for UD811">
	<title>Power Group | Admin</title>
	<!-- Insert link to stylesheet here -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
	<link rel='stylesheet' href='/styles/style.css'/>
</head>
<body>

<header class="header">
    <h1 class="header__title">Power Group</h1>
</header>

<div class="container">
    <div class="column add-bottom">
        <div id="mainwrap">
            <?php echo $file_contents; ?>
        </div>
    </div>
    <div class="column add-bottom center">
        <p>&copy; Sarah Sliman</p>
    </div>
</div>

<div class="loader">
    <svg viewBox="0 0 32 32" width="32" height="32">
        <circle id="ud811Spinner" cx="16" cy="16" r="14" fill="none"></circle>
    </svg>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>

</body>
</html>