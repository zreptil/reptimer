<?php
function saveUser($data)
{
  global $code,$userkey;

  $conn = connect();
  if($data['id'] == $userkey)
  {
    $query = "update users set ";
    $query .= "username='".forSQL($data['username'])."'";
    $query .= ",fullname='".forSQL($data['fullname'])."'";
    $query .= ",pwd='".forSQL($data['pwd'])."'";
    $query .= ",tfacode='".forSQL($data['tfacode'])."'";
    $query .= ",permissions='".json_encode($data['permissions'])."'";
    $query .= " where id='".forSQL($data['id'])."'";
    if($conn->query($query) !== TRUE)
    {
      $code = 400;
      header('Content-Type: application/json');
      $response = array('error' => $conn->error);
      echo(json_encode($response));
    }
  } else {
    $query = 'insert into users(id,isauthorized,username,fullname,pwd,tfacode,permissions)values(';
    $query .= "'".forSQL($data['id'])."'";
    $query .= ",0";
    $query .= ",'".forSQL($data['username'])."'";
    $query .= ",'".forSQL($data['fullname'])."'";
    $query .= ",'".forSQL($data['pwd'])."'";
    $query .= ",'".forSQL($data['tfacode'])."'";
    $query .= ",'".json_encode($data['permissions'])."'";
    $query .= ')';
    if($conn->query($query) !== TRUE)
    {
      $code = 400;
      header('Content-Type: application/json');
      $response = array('error' => $conn->error);
      echo(json_encode($response));
    }
  }
  $conn->close();
}

function row2user($row)
{
  return array('id' => $row['id'],
               'isauthorized' => $row['isauthorized'] != 0,
               'username' => $row['username'],
               'fullname' => $row['fullname'],
               'pwd' => $row['pwd'],
               'tfacode' => $row['tfacode'],
               'permissions' => json_decode($row['permissions'])
               );
}

// Den user als objekt zurueckgeben
function userinfo($user)
{
  $user['may'] = array();
  if(in_array('GET',$user['permissions']))
    $user['may']['read'] = true;
  if(in_array('POST',$user['permissions']))
    $user['may']['add'] = true;
  if(in_array('PUT',$user['permissions']))
    $user['may']['edit'] = true;
  if(in_array('DELETE',$user['permissions']))
    $user['may']['delete'] = true;
  if(in_array('EDITOR',$user['permissions']))
    $user['may']['editor'] = true;
  if(in_array('DEBUG',$user['permissions']))
    $user['may']['debug'] = true;
  if(in_array('ADMIN',$user['permissions']))
    $user['may']['admin'] = true;
  unset($user['permissions']);
  unset($user['pwd']);
  unset($user['tfacode']);
  $user['isAuthorized'] = $user['isauthorized'] != 0;
  unset($user['isauthorized']);
  return $user;
}

$userkey = $_SERVER['HTTP_AUTHORIZATION'];
if($_GET['auth']) $userkey = $_GET['auth'];
$query = "select * from users where id='".forSQL($userkey)."'";
$conn = connect();
$result = $conn->query($query);
if($result && $row = $result->fetch_assoc())
{
  $user = row2user($row);
  $result->close();
  if($row['isauthorized'] != 0)
  {
    $query = "delete from users where id<>'' && isauthorized=0";
    $result = $conn->query($query);
  }
}
else
{
  $defNames = ['Karl Napf', 'Hurwanek Krustinak', 'John Doe', 'Max Mustermann',
               'Vrranz', 'Häuptling kranker Storch', 'Alfons Qumstdanetrein',
               'Susi Sorglos', 'Tamara Tüpfel', 'Katharina die Nichtsokleine',
               'Alex Gross', 'Arnold Einstein', 'Karola Kornfeld'
              ];
  $user = array('id' => '',
                'isauthorized' => false,
                'username' => '',
                'fullname' => $defNames[rand(0,count($defNames)-1)],
                'permissions' => array('GET','EDITOR')
               );
}

$conn->close();
