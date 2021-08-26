<?php

namespace App\Tests\Mock;

use App\Service\Mailer;
use SendinBlue\Client\Api\SMTPApi;

class MockMailer extends Mailer
{
    /**
     * @var Mailer
     */
    private Mailer $decorated;

    public function __construct(Mailer $decorated, SMTPApi $sendinblueMailer, $overrideEmailTo = 'test@popotes.fr')
    {
        parent::__construct($sendinblueMailer, $overrideEmailTo);
        $this->decorated = $decorated;
    }

    public function sendResetPassword(array $data)
    {
        return null;
    }
}
