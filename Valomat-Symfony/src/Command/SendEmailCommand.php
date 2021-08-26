<?php

namespace App\Command;

use App\Service\NotificationService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class SendEmailCommand extends Command
{
    protected static $defaultName = 'app:send-email';
    private $notificationService;

    public function __construct(NotificationService $notificationService)
    {

        $this->notificationService = $notificationService;
        /*
        $this->from = $from;
        $this->to = $to;
        */
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Send a test email.')
            ->addArgument('from', InputArgument::REQUIRED, 'sender')
            ->addArgument('to', InputArgument::REQUIRED, 'recever')
            ->addArgument('subject', InputArgument::REQUIRED, 'subject of the email');

    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {

        $output->writeln([
            "Test envoi d'email",
            '============',
        ]);



        $this->notificationService->sendEmail(
            $input->getArgument('from'),
            $input->getArgument('to'),
            $input->getArgument('subject')
        );

        return 0;
    }
}