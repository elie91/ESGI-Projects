<?php

namespace App\Tests\Security;

use ApiPlatform\Core\Serializer\SerializerContextBuilderInterface;
use App\Annotation\AdminExtraData;
use App\Serializer\AdminContextBuilder;
use App\Tests\BaseTestCase;
use App\Tests\Mock\Dummy;
use Doctrine\Common\Annotations\Reader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class AdminContextBuilderTest extends BaseTestCase
{
    /**
     * @param $data
     *
     * @dataProvider providerTest
     * @throws \ReflectionException
     */
    public function testSupportClass($data)
    {
        $stub = new AdminContextBuilder(
            $this->mockDecorated($data['hasGroups'], false),
            $this->mockAuthorizationChecker($data['isAdminExtraData'], $data['hasGroups'], $data['isAdmin'], false),
            $this->mockReader($data['isAdminExtraData'])
        );

        $this->assertEquals(
            $data['isAdminExtraData'],
            $this->invokePrivateProtectedMethod($stub, 'supportClass', [Dummy::class])
        );
    }

    /**
     * @param $data
     * @param $return
     *
     * @dataProvider providerTest
     */
    public function testCreateFromRequest($data, $return)
    {
        $stub = new AdminContextBuilder(
            $this->mockDecorated($data['hasGroups']),
            $this->mockAuthorizationChecker($data['isAdminExtraData'], $data['hasGroups'], $data['isAdmin'],
                                            ($data['isAdminExtraData'] && $data['hasGroups']) ?: false),
            $this->mockReader($data['isAdminExtraData'])
        );

        $context = $stub->createFromRequest($this->createMock(Request::class), $data['isNormalization']);

        if ($data['hasGroups']) {
            $this->assertArrayHasKey('groups', $context);
            if ($return) {
                $this->assertContains($return, $context['groups']);
            }
        } else {
            $this->assertArrayNotHasKey('groups', $context);
        }
    }

    public function providerTest()
    {
        return [
            'denomalization - no groups - no admin extra data - no admin' => [
                ['isNormalization' => false, 'hasGroups' => false, 'isAdminExtraData' => false, 'isAdmin' => false],
                null
            ],
            'denomalization - no groups - no admin extra data - admin'    => [
                ['isNormalization' => false, 'hasGroups' => false, 'isAdminExtraData' => false, 'isAdmin' => true],
                null
            ],
            'denomalization - no groups - admin extra data - no admin'    => [
                ['isNormalization' => false, 'hasGroups' => false, 'isAdminExtraData' => true, 'isAdmin' => false],
                null
            ],
            'denomalization - no groups - admin extra data - admin'       => [
                ['isNormalization' => false, 'hasGroups' => false, 'isAdminExtraData' => true, 'isAdmin' => true],
                null
            ],
            'denomalization - groups - no admin extra data - no admin'    => [
                ['isNormalization' => false, 'hasGroups' => true, 'isAdminExtraData' => false, 'isAdmin' => false],
                null
            ],
            'denomalization - groups - no admin extra data - admin'       => [
                ['isNormalization' => false, 'hasGroups' => true, 'isAdminExtraData' => false, 'isAdmin' => true],
                null
            ],
            'denomalization - groups - admin extra data - no admin'       => [
                ['isNormalization' => false, 'hasGroups' => true, 'isAdminExtraData' => true, 'isAdmin' => false],
                null
            ],
            'denomalization - groups - admin extra data - admin'          => [
                ['isNormalization' => false, 'hasGroups' => true, 'isAdminExtraData' => true, 'isAdmin' => true],
                'admin_write'
            ],
            'normalization - no groups - no admin extra data - no admin'  => [
                ['isNormalization' => true, 'hasGroups' => false, 'isAdminExtraData' => false, 'isAdmin' => false],
                null
            ],
            'normalization - no groups - no admin extra data - admin'     => [
                ['isNormalization' => true, 'hasGroups' => false, 'isAdminExtraData' => false, 'isAdmin' => true],
                null
            ],
            'normalization - no groups - admin extra data - no admin'     => [
                ['isNormalization' => true, 'hasGroups' => false, 'isAdminExtraData' => true, 'isAdmin' => false],
                null
            ],
            'normalization - no groups - admin extra data - admin'        => [
                ['isNormalization' => true, 'hasGroups' => false, 'isAdminExtraData' => true, 'isAdmin' => true],
                null
            ],
            'normalization - groups - no admin extra data - no admin'     => [
                ['isNormalization' => true, 'hasGroups' => true, 'isAdminExtraData' => false, 'isAdmin' => false],
                null
            ],
            'normalization - groups - no admin extra data - admin'        => [
                ['isNormalization' => true, 'hasGroups' => true, 'isAdminExtraData' => false, 'isAdmin' => true],
                null
            ],
            'normalization - groups - admin extra data - no admin'        => [
                ['isNormalization' => true, 'hasGroups' => true, 'isAdminExtraData' => true, 'isAdmin' => false],
                null
            ],
            'normalization - groups - admin extra data - admin'           => [
                ['isNormalization' => true, 'hasGroups' => true, 'isAdminExtraData' => true, 'isAdmin' => true],
                'admin_read'
            ],
        ];
    }

    /**
     * @param $hasGroups
     * @param bool $used
     *
     * @return \PHPUnit\Framework\MockObject\MockObject
     */
    private function mockDecorated($hasGroups, $used = true)
    {
        $decorated = $this->getMockBuilder(SerializerContextBuilderInterface::class)
                          ->setMethods(['createFromRequest'])->getMockForAbstractClass();
        $decorated->expects($used ? $this->once() : $this->never())
                  ->method('createFromRequest')
                  ->willReturn($hasGroups ? ['groups' => ['test'], 'resource_class' => Dummy::class] : ['resource_class' => Dummy::class]);

        return $decorated;
    }

    /**
     * @param $isAdminExtraData
     * @param $hasGroups
     * @param $isAdmin
     * @param bool $used
     *
     * @return \PHPUnit\Framework\MockObject\MockObject|AuthorizationCheckerInterface
     */
    private function mockAuthorizationChecker($isAdminExtraData, $hasGroups, $isAdmin, $used = true)
    {
        $authorizationChecker = $this->getMockBuilder(AuthorizationCheckerInterface::class)
                                     ->setMethods(['isGranted'])->getMock();
        $authorizationChecker->expects($used && $isAdminExtraData && $hasGroups ? $this->once() : $this->never())
                             ->method('isGranted')
                             ->willReturn($isAdmin);

        return $authorizationChecker;
    }

    /**
     * @param $isAdminExtraData
     *
     * @return \PHPUnit\Framework\MockObject\MockObject
     */
    private function mockReader($isAdminExtraData)
    {
        $adminExtraData = new AdminExtraData();

        $reader = $this->getMockBuilder(Reader::class)
                       ->setMethods(['getClassAnnotation'])->getMockForAbstractClass();
        $reader->expects($this->once())
               ->method('getClassAnnotation')
               ->willReturn($isAdminExtraData ? $adminExtraData : null);

        return $reader;
    }
}
