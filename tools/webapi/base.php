<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/PHPGangsta/GoogleAuthenticator.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: content-type, Authorization, Temp');

/*
apps/xxx/config.php contains the following code:

<?php
$appName = 'Name der Anwendung';
$db = (object)['host' => 'url der Datenbank',
               'port' => 'port fuer die Datenbank',
               'name' => 'Name der Datenbank',
               'user' => 'Benutzer der Datenbank',
               'pw' => 'Passwort fuer die Datenbank'
              ];
*/
function connect()
{
	global $db;
	return new mysqli($db->host,$db->user,$db->pw,$db->name,$db->port);
}

function forSQL($text)
{
  if($text)
  {
    $text = str_replace("'", "\\'", $text);
    $text = str_replace("\n", "\\n", $text);
  }
  return $text;
}

include 'users.php';

function handleError()
{
  global $scriptname;

  echo($scriptname);
}

function processOPTIONS() {
}

function checkPermission() {
  global $code,$headers,$user,$cmd;

  if($_SERVER['REQUEST_METHOD']=='OPTIONS')
    return true;

  if(in_array($_SERVER['REQUEST_METHOD'], $user['permissions']))
    return true;

  if(in_array('ADMIN', $user['permissions']))
    return true;

  if($_SERVER['REQUEST_METHOD'] == 'POST')
  {
    switch ($cmd)
    {
      case 'register':
      case 'tfacheck':
      case 'login':
        return true;
    }
  }

  $code = 401;
  header('Content-Type: application/json');
  $response = array('error' => 'access not allowed for '.$user['fullname']);
  echo(json_encode($response));
  return false;
}

$body = file_get_contents('php://input');
$raw = json_decode($body, TRUE);
$cmd = $raw['cmd'];
$data = $raw['data'];
$code = 200;

$func = 'process'.$_SERVER['REQUEST_METHOD'];
if(!function_exists($func)) {
  header('Error: unknown method '.$_SERVER['REQUEST_METHOD']);
  echo('this type of request is not supported');
  $code = 405;
} else {
  if(checkPermission()) {
    call_user_func('process'.$_SERVER['REQUEST_METHOD']);
  }
}

http_response_code($code);
die();
