<?php

namespace App\Service;

use InvalidArgumentException;
use SendinBlue\Client\Api\SMTPApi;
use SendinBlue\Client\ApiException;
use SendinBlue\Client\Model\CreateSmtpEmail;
use SendinBlue\Client\Model\SendSmtpEmail;
use SendinBlue\Client\Model\SendSmtpEmailReplyTo;
use SendinBlue\Client\Model\SendSmtpEmailTo;
use Symfony\Component\PropertyAccess\PropertyAccess;

class Mailer
{
  private SMTPApi $mailer;
  private ?string $overrideEmailTo;

  const TEMPLATE_RESET_PASSWORD = 1;

  protected static array $configResetPassword = [
    "[contact][EMAIL]",
    "[contact][FIRSTNAME]",
    "[response][URL]",
    "[response][ADMIN]",
  ];

  public function __construct(SMTPApi $sendinblueMailer, $overrideEmailTo)
  {
    $this->mailer = $sendinblueMailer;
    $this->overrideEmailTo = $overrideEmailTo;
  }

  private function checkAttributes($array, $conf)
  {
    $propAccess = PropertyAccess::createPropertyAccessor();
    foreach ($conf as $validator) {
      if (!$propAccess->isReadable($array, $validator)) {
        throw new InvalidArgumentException("Attribute \"${validator}\" not filled: " . json_encode($array));
      }
    }
  }

  /**
   * @return SendSmtpEmail
   */
  private function generateDraftEmail()
  {
    $sendEmail = new SendSmtpEmail();
    $sendEmail->setReplyTo(new SendSmtpEmailReplyTo(["email" => "thomas@popotes.fr"]));

    return $sendEmail;
  }

  /**
   * @param int $templateId
   * @param array $conf
   * @param array $data
   * @return CreateSmtpEmail
   * @throws ApiException
   */
  private function sendEmail(int $templateId, array $conf, array $data)
  {
    $this->checkAttributes($data, $conf);

    $sendEmail = $this->generateDraftEmail();

    $to = [
      "email" => $this->overrideEmailTo ?: $data['contact']["EMAIL"]
    ];
    if (isset($data['contact']["FIRSTNAME"])) $to["name"] = $data['contact']["FIRSTNAME"];

    $sendEmail->setTo([
      new SendSmtpEmailTo($to),
    ]);
    $sendEmail->setTemplateId($templateId);
    $sendEmail->setParams($data);

    return $this->mailer->sendTransacEmail($sendEmail);
  }

  /**
   * @param array $data
   *
   * @return CreateSmtpEmail
   * @throws ApiException
   */
  public function sendResetPassword(array $data)
  {
    return $this->sendEmail(self::TEMPLATE_RESET_PASSWORD, static::$configResetPassword, $data);
  }

}
