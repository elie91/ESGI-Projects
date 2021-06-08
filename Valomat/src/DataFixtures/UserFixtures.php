<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture implements FixtureGroupInterface
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
         $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $admin = new User();
        $admin->setEmail("admin@gmail.com");
        $admin->setLastname("Bastide");
        $admin->setFirstname("Simon");
        $admin->setCompany("Valomat");
        $admin->setPhone("0600000000");
        $admin->setJob("test");
        $admin->setSiret("11111111111111");
        $admin->setPlainPassword('admin');
        $admin->setRoles(["ROLE_ADMIN"]);
        $admin->setState('1');
        $admin->setDeleted('0');
        $manager->persist($admin);



        $user = new User();
        $user->setEmail("user@gmail.com");
        $user->setRoles(["ROLE_USER"]);
        $user->setLastname("Bastide");
        $user->setFirstname("Simon");
        $user->setCompany("Valomat");
        $user->setJob("test");
        $user->setSiret("11111111111111");
        $user->setPhone("0600000000");
        $user->setPlainPassword('admin');
        $user->setState('0');
        $user->setDeleted('0');

        $manager->persist($user);

		$vendor = new User();
		$vendor->setEmail("vendor@gmail.com");
		$vendor->setRoles(["ROLE_USER"]);
		$vendor->setLastname("Esteve");
		$vendor->setFirstname("Fusia");
		$vendor->setCompany("Esteve Fusia");
		$vendor->setJob("test");
		$vendor->setSiret("11111111111111");
		$vendor->setPhone("0600000000");
		$vendor->setPlainPassword('vendor');
        $vendor->setState('0');
        $vendor->setDeleted('0');

		$manager->persist($vendor);

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['minimal'];
    }
}
