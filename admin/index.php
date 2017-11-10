<?php
$url    = 'https://health.sarahsliman.com/admin/index.php';
$file   = '/var/www/health.sarahsliman.com/admin/sarah.json';
$msg    = '/var/www/health.sarahsliman.com/admin/msg.json';

// check if form has been submitted
$success    = FALSE;
if (isset($_POST['text']) && isset($_POST['msg'])) {

    // save the text contents
    file_put_contents($file, $_POST['text']);
    file_put_contents($msg, $_POST['msg']);
    $success    = TRUE;

    header("Location: /");
    exit;
}

$workouts   = file_get_contents($file);
$message    = file_get_contents($msg);

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
        <div id="mainwrap" style="padding-top:30px;">

            <?php
            if ($success):
            ?>

            <div class="row">
                <div class="col-xs-12">
                    <div style="width:100%; height:50px;background:#ff9900;">
                        <p style="font-weight:bold;">Successfully updated!</p>
                    </div>
                </div>
            </div>

            <?php
            endif;
            ?>

            <form class="form-horizontal" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
                <fieldset>

                    <!-- Textarea -->
                    <div class="form-group">
                        <div class="col-xs-12">                     
                            <textarea class="form-control" id="textarea" style="height:300px;" name="msg"><?php echo htmlspecialchars($message); ?></textarea>
                        </div>
                    </div>

                    <!-- Textarea -->
                    <div class="form-group">
                        <div class="col-xs-12">                     
                            <textarea class="form-control" id="textarea" style="height:300px;" name="text"><?php echo htmlspecialchars($workouts); ?></textarea>
                        </div>
                    </div>

                    <!-- Submit -->
                    <div class="form-group">
                        <div class="col-xs-12">                     
                            <input type="submit" />
                        </div>
                    </div>

                    <!-- Reset -->
                    <div class="form-group">
                        <div class="col-xs-12">                     
                            <input type="reset" />
                        </div>
                    </div>

                </fieldset>
            </form>

        </div>
    </div>
    <div class="column add-bottom center">
        <p>&copy; Sarah Sliman</p>
    </div>
</div>


<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>

</body>
</html>