<?php
try {
    // multiple recipients (note the commas)
    $to = "ekta@ajency.in";

    // subject
    $subject = "Contact form submitted on Westerncap.in";

    $postRequest = $_POST;
    $full_name = (isset($postRequest['full_name'])) ? $postRequest['full_name'] :'';
    $phone = (isset($postRequest['phone'])) ? $postRequest['phone'] :'';
    $email = (isset($postRequest['email'])) ? $postRequest['email']  :'';
    $message = (isset($postRequest['message'])) ? $postRequest['message'] :'';;

    // compose message
    $message = "
    <html>
      <head>
      </head>
      <body>
        <h1>Contact Us</h1>
        <p><b>FULL NAME :</b> ".$full_name." </p>
        <p><b>PHONE NUMBER :</b> ".$phone."</p>
        <p><b>EMAIL ID :</b> ".$email."</p>
        <p><b>MESSAGE :</b> ".$message."</p>
      </body>
    </html>
    ";

    // To send HTML mail, the Content-type header must be set
    // compose headers
    $headers = "From: ".$email."\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

    // send email
    mail($to, $subject, $message, $headers);

    // header('Location: /contact-us?success=true');
    // exit;
    $response = ['success'=>true,'code'=> 'contact-us','message'=>'success response'];
    echo json_encode($response);
    exit;
}
catch(Exception $e) {
  $response = ['success'=>false,'code'=> 'contact-us','message'=>'success response'];
  echo json_encode($response);
  exit;
}


?>