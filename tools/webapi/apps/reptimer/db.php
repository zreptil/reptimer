<?php
include 'config.php';

function exportReptimerData($data) {
  $data['days'] = json_decode($data['days']);
  return $data;
}

function processGET() {
  global $user,$data;
  if($_GET['q']) {
    $response = array();
    $conn = connect();
    $q = "'%".$_GET['q']."%'";
    $query = 'select * from year where ';
    $query .= '(year like '.$q.')';
    $query .= " && (userid='".$user['id']."')";
    $query .= ' order by year';
    $result = $conn->query($query);
    if ($result) {
      while ($row = $result->fetch_assoc()) {
        array_push($response, exportReptimerData($row));
      }
    } else {
      $response = '';
    }
    header('Content-Type: application/json');
    echo(json_encode($response));
    $conn->close();
  } else if($_GET['year']) {
    readYear($_GET['year']);
  } else {
    switch($_GET['cmd'])
    {
      case 'userinfo':
        $ret = userinfo($user);
        $ret['checkov'] = $_SERVER['HTTP_AUTHORIZATION'];
        echo json_encode($ret);
        break;
      case 'year':
        readYear($data['year']);
        break;
    }
  }
}

function readYear($year) 
{
  global $user;
  $response = '';
  $conn = connect();
  $query = 'select * from years where year='.$year;
  $query .= " && (userid='".$user['id']."')";
  $result = $conn->query($query);
  if ($row = $result->fetch_assoc()) {
    $response = exportReptimerData($row);
  } else {
    $response = json_decode('{"userid":"'.$user['id'].'","year":"'.$year.'","days":[]}');
  }
  header('Content-Type: application/json');
  echo(json_encode($response));
  $conn->close();
}

function processPOST()
{
  global $code,$data,$cmd,$user;

  switch($cmd) {
    case 'create':
    case 'update':
      $conn = connect();
      $d = json_encode($data['days']);
      $query = "insert into years(userid,year,days) values('".$user['id']."','".forSQL($data['year'])."','".forSQL($d)."')";
      if($conn->query($query) === TRUE) {
        header('Content-Type: application/json');
        echo(json_encode($data));
      } else {
        $code = 400;
        header('Content-Type: application/json');
        $response = array('error' => $conn->error);
        echo(json_encode($response));
      }
      $conn->close();
      break;
    case 'userinfo':
      echo json_encode(userinfo($user));
      break;
  }
}

function processPUT() {
  global $code,$data,$cmd,$user;

  $conn = connect();

  $query = "select * from years";
  $query .= " where userid='".$user['id']."'";
  $query .= " and year=".$data['year'];
  if($result = $conn->query($query)) 
  {
    if ($result->num_rows == 0) 
    {
      $conn->close();
      $cmd = 'create';
      processPOST();
      return;
    }
  }

  $d = json_encode($data['days']);
  $query = "update years set days='".forSQL($d)."'";
  $query .= " where userid='".$user['id']."'";
  $query .= " and year=".$data['year'];
  if($conn->query($query) === TRUE) {
    header('Content-Type: application/json');
    echo(json_encode($data));
  } else {
    $code = 400;
    header('Content-Type: application/json');
    $response = array('error' => $conn->error);
    echo(json_encode($response));
  }
  $conn->close();
}

function processDELETE() {
  global $code,$data,$cmd,$user;

  if($_GET['id']) {
    $conn = connect();
    $query = "delete from years";
    $query .= " where userid='".$user['id']."'";
    $query .= " and year=".$data['year'];
    if($conn->query($query) !== TRUE) {
      $code = 400;
      header('Content-Type: application/json');
      $response = array('error' => $conn->error);
      echo(json_encode($response));
    }
    $conn->close();
  }
}

include '../../base.php';
