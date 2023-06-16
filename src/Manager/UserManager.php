<?php

namespace App\Manager;

use App\Entity\User;

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

        $this->userRepository->save($user, true);

        return $user;
    }
}