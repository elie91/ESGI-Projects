<?php

namespace App\Tests\Security;

use App\Entity\User;
use App\Security\UserChecker;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Translation\TranslatorInterface;

class UserCheckerTest extends TestCase
{

    /**
     * @param UserInterface $user
     * @param null          $exception
     *
     * @dataProvider usersProvider
     */
    public function testCheckPostAuth(UserInterface $user, $exception = null)
    {
        /** @var TranslatorInterface $translator */
        $translator  = $this->createMock(TranslatorInterface::class);
        $userChecker = new UserChecker($translator);
        if ($exception) {
            $this->expectException($exception);
        }

        $this->assertNull($userChecker->checkPostAuth($user));
    }

    public function usersProvider()
    {
        /** @var UserInterface $notAnEntityUser */
        $notAnEntityUser = $this->createMock(UserInterface::class);

        $userNotActive = $this->getMockBuilder(User::class)
                              ->setMethods(['isActive'])
                              ->getMock();
        $userNotActive->expects($this->once())
                      ->method('isActive')
                      ->willReturn(false);

        $userActive = $this->getMockBuilder(User::class)
                           ->setMethods(['isActive'])
                           ->getMock();
        $userActive->expects($this->once())
                   ->method('isActive')
                   ->willReturn(true);

        return [
            'not an entity user' => [
                $notAnEntityUser,
                null,
            ],
            'user not active'    => [
                $userNotActive,
                DisabledException::class,
            ],
            'user active'        => [
                $userActive,
                null,
            ],
        ];
    }
}
