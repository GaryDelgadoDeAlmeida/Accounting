<?php

namespace App\Manager;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserManager {

    private EntityManagerInterface $em;
    private UserRepository $userRepository;

    function __construct(
        EntityManagerInterface $em,
        UserRepository $userRepository
    ) {
        $this->em = $em;
        $this->userRepository = $userRepository;
    }

    /**
     * Add a new user
     * 
     * @param string firstname
     * @param string lastname
     * @param string email
     * @param string password
     * @param array roles
     * @return User|string
     */
    public function newUser(
        string $firstname,
        string $lastname,
        string $email,
        string $password,
        array $roles = ["USER_ROLE"]
    ) {
        $user = (new User())
            ->setFirstname($firstname)
            ->setLastname($lastname)
            ->setEmail($email)
            ->setPassword($password)
            ->setRoles($roles)
        ;

        try {
            $this->userRepository->save($user, true);
        } catch(\Exception $e) {
            return $e->getMessage();
        }

        return $user;
    }
}