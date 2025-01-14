<?php
function exportUserData($data) {
  return userinfo($data);
}

function processGET() 
{
  global $user;
  if($_GET['q']) {
    $response = array();
    $conn = connect();
    $q = "'%".$_GET['q']."%'";
    $query = 'select * from users where (fullname like '.$q;
    $query .= ' || username like '.$q.')';
    $query .= ' order by username';
    $result = $conn->query($query);
    if ($result) {
      while ($row = $result->fetch_assoc()) {
        $row['permissions'] = json_decode($row['permissions']);
        array_push($response, exportUserData($row));
      }
    } else {
      $response = '';
    }
    header('Content-Type: application/json');
    echo(json_encode($response));
    $conn->close();
  } else if($_GET['id']) {
    $response = '';
    $conn = connect();
    $result = $conn->query('select * from users where id='.$_GET['id']);
    if ($row = $result->fetch_assoc()) {
      $response = exportUserData($row);
    }
    header('Content-Type: application/json');
    echo(json_encode($response));
    $conn->close();
  }
}

function processPOST() 
{
}

function processPUT() 
{
  global $code,$data,$cmd;
  $permissions = array ();
  if($data['may']['read'])
    array_push($permissions,'GET');
  if($data['may']['add'])
    array_push($permissions,'POST');
  if($data['may']['edit'])
    array_push($permissions,'PUT');
  if($data['may']['delete'])
    array_push($permissions,'DELETE');
  if($data['may']['editor'])
    array_push($permissions,'EDITOR');
  if($data['may']['debug'])
    array_push($permissions,'DEBUG');
  if($data['may']['admin'])
    array_push($permissions,'ADMIN');

  $conn = connect();
  $query = "update users set isauthorized=".($data['isAuthorized']?'true':'false');
  $query .= ",fullname='".forSQL($data['fullname'])."'";
  $query .= ",username='".forSQL($data['username'])."'";
  $query .= ",permissions='".json_encode($permissions)."'";
  $query .= " where id='".$data['id']."'";
  
  if($conn->query($query) === TRUE) {
    header('Content-Type: application/json');
    echo(json_encode($data));
  } else {
    $code = 400;
    header('Content-Type: application/json');
    $response = array('query' => $query, 'error' => $conn->error);
    echo(json_encode($response));
  }
  $conn->close();
}

function processDELETE() 
{
}

include 'base.php';
