<?php

namespace App\Manager;

use App\Entity\User;
use App\Enum\UserEnum;
use App\Manager\FormManager;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserManager {

    private EntityManagerInterface $em;
    private FormManager $formManager;
    private UserRepository $userRepository;

    function __construct(
        EntityManagerInterface $em, 
        FormManager $formManager,
        UserRepository $userRepository
    ) {
        $this->em = $em;
        $this->formManager = $formManager;
        $this->userRepository = $userRepository;
    }

    /**
     * Check field if limitation is respected
     * 
     * @param array field
     * @return array checked fields
     */
    public function checkUserFields(array $fields) {
        $userFields = [];
        $userEnumChoices = UserEnum::getChoices();
        
        foreach($fields as $key => $row) {
            if(!in_array($key, $userEnumChoices)) {
                continue;
            }

            if(!$this->formManager->isEmpty($row)) {
                throw new \Exception(sprintf("The field %s can't be empty", $key));
            }

            if($key === UserEnum::USER_FIRSTNAME) {
                if(!$this->formManager->checkMaxLength($row, 100)) {
                    throw new \Exception("The firstname exceed 100 characters length");
                }
            } elseif($key === UserEnum::USER_LASTNAME) {
                if(!$this->formManager->checkMaxLength($row, 150)) {
                    throw new \Exception("The lastname exceed 150 characters length");
                }
            } elseif($key === UserEnum::USER_BIRTH_DATE) {
                $row = \DateTime::createFromFormat("d/m/Y", $row);
                if(!$row) {
                    throw new \Exception("The birth date format isn't correct");
                }
            } elseif($key === UserEnum::USER_EMAIL) {
                // Check the length of the email
                if(!$this->formManager->checkMaxLength($row)) {
                    throw new \Exception("The email address exceed 255 characters length");
                }

                // Check if email is valid
                if(!$this->formManager->isEmail($row)) {
                    throw new \Exception("The email isn't valid");
                }
            } elseif($key === UserEnum::USER_PASSWORD) {
                // Check the password min length
                if(!$this->formManager->checkMinLength($row, 8)) {
                    throw new \Exception("The password length must be at least 8 characters");
                }

                // Check if the password is secured
                if(!$this->formManager->isSecurePassword($row)) {
                    throw new \Exception("The password is not secure enough");
                }
            }

            $userFields[$key] = $row;
        }

        return $userFields;
    }

    public function fillUser(array $fields, User $user = new User()) {
        foreach($fields as $key => $value) {
            if($key === UserEnum::USER_FIRSTNAME) $user->setFirstname($value);
            elseif($key === UserEnum::USER_LASTNAME) $user->setLastname($value);
            elseif($key === UserEnum::USER_BIRTH_DATE) $user->setBirthDate($value);
            elseif($key === UserEnum::USER_EMAIL) $user->setEmail($value);
            elseif($key === UserEnum::USER_PASSWORD) $user->setPassword($value);
        }

        $this->em->flush();
        return $user;
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
        \DateTime $birth_date,
        array $roles = ["USER_ROLE"]
    ) {
        $user = (new User())
            ->setFirstname($firstname)
            ->setLastname($lastname)
            ->setBirthDate($birth_date)
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