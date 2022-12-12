<?php
function processPOST()
{
  global $appName,$cmd,$code,$data,$keepUsers,$user;

  switch($cmd) {
    case 'login':
      $code = 401;
      $error = 'user not found';
      $conn = connect();
      $query = 'select * from users where ';
      $query .= "username='".forSQL($data['username'])."'";
      $query .= " and pwd='".forSQL($data['password'])."'";
      $result = $conn->query($query);
      $ga = new PHPGangsta_GoogleAuthenticator();
      while ($row = $result->fetch_assoc())
      {
        // 2 = 2*30sec clock tolerance
        if($ga->verifyCode($row['tfacode'],$data['tfacode'],2))
        {
          $code = 200;
          $user = row2user($row);
          echo(json_encode(array('id' => $user['id'], 'user' => userinfo($user))));
        }
        else
        {
          $error = 'wrong tfa-Code';
        }
      }
      if($code == 401)
      {
        header('Content-Type: application/json');
        $response = array('error' => 'access denied - '.$error);
        echo(json_encode($response));
      }
      $conn->close();
      break;
    case 'register':
      $data['username'] = trim($data['username']);
      if(strlen($data['username']) < 4)
      {
        $code = 400;
        header('Content-Type: application/json');
        $response = array('error' => 'username must be at least 4 chars long');
        echo(json_encode($response));
        return;
      }
      $ga = new PHPGangsta_GoogleAuthenticator();
      $secret = $ga->createSecret();
      do {
        $key = base64_encode(openssl_random_pseudo_bytes(32));
      } while(array_key_exists($key,$users));
      $user = array(
        'id' => $key,
        'username' => $data['username'],
        'fullname' => $data['user']['fullname'],
        'pwd' => $data['password'],
        'permissions' => array('GET','EDITOR'),
        'tfacode' => $secret,
        'tfaurl' => $ga->getQRCodeGoogleUrl($appName.' ('.$data['user']['fullname'].')', $secret)
      );
      $userkey = '';
      saveUser($user);
      $user['userkey'] = $key;
      echo json_encode(userinfo($user));
      break;
    case 'tfacheck':
      $ga = new PHPGangsta_GoogleAuthenticator();
      // 2 = 2*30sec clock tolerance
      $isOk = $ga->verifyCode($user['tfacode'],$data['tfacheck'],2);
      if($isOk)
      {
        $conn = connect();
        $query = "update users set isauthorized=1 where id='".$user['id']."'";
        $conn->query($query);
        $conn->close();
        $user['isauthorized'] = 1;
        echo json_encode(userinfo($user));
      }
      else
      {
        $code = 401;
        echo('{"error":"Das war wohl nix!","key":"","data":'.json_encode($user).'}');
      }
      break;
  }
}

include 'base.php';
