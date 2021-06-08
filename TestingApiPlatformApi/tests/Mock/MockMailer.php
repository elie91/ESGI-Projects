<?php

namespace App\Tests\Mock;

use App\Service\Mailer;
use SendinBlue\Client\Api\SMTPApi;

class MockMailer extends Mailer
{
    /**
     * @var Mailer
     */
    private $decorated;

    public function __construct(Mailer $decorated, SMTPApi $sendinblueMailer, $overrideEmailTo = 'test@vetixy.com')
    {
        parent::__construct($sendinblueMailer, $overrideEmailTo);
        $this->decorated = $decorated;
    }

    public function sendResetPassword(array $data)
    {
        return null;
    }

    public function sendShareInvite(array $data)
    {
        return null;
    }

    public function sendNewShareInvite(array $data)
    {
        return null;
    }

    public function sendTransferAnimal(array $data)
    {
        return null;
    }

    public function sendTransferAnimalNewUser(array $data)
    {
        return null;
    }


}
