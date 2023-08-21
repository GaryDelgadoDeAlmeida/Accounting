<?php

namespace App\Manager;

use App\Entity\User;
use App\Enum\UserEnum;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserManager {

    private EntityManagerInterface $em;
    private UserRepository $userRepository;

    function __construct(EntityManagerInterface $em, UserRepository $userRepository) {
        $this->em = $em;
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
            if(in_array($key, $userEnumChoices)) {
                if($this->formManager->isEmpty($row)) {
                    throw new \Error("The field {$key} can't be empty");
                }

                if($key === UserEnum::USER_FIRSTNAME) {
                    if(!$this->formManager->checkMaxLength($row, 100)) {
                        throw new \Error("The firstname exceed 100 caracters length");
                    }
                } elseif($key === UserEnum::USER_LASTNAME) {
                    if(!$this->formManager->checkMaxLength($row, 150)) {
                        throw new \Error("The lastname exceed 150 caracters length");
                    }
                } elseif($key === UserEnum::USER_ADDRESS) {
                    if(!$this->formManager->checkMaxLength($row, 255)) {
                        throw new \Error("Address exceed 255 caracters length");
                    }
                } elseif($key === UserEnum::USER_ZIPCODE) {
                    if(!$this->formManager->checkMaxLength($row, 10)) {
                        throw new \Error("Zip code exceed 10 caracters length");
                    }

                    if(!$this->formManager->isNumber($row)) {
                        throw new \Error("Zip code format isn't valid. Allow number only");
                    }
                } elseif($key === UserEnum::USER_CITY) {
                    if(!$this->formManager->checkMaxLength($row, 255)) {
                        throw new \Error("The city exceed 255 caracters length");
                    }
                } elseif($key === UserEnum::USER_COUNTRY) {
                    // 
                } elseif($key === UserEnum::USER_PHONE) {
                    // Remove all spaces
                    $row = str_replace(" ", "", $row);

                    // Check the length of the phone number
                    if(!$this->formManager->checkMaxLength($row, 10)) {
                        throw new \Error("The phone number exceed 10 caracters length");
                    }

                    // Check if the phone contains numbers only
                    if(!$this->formManager->isNumber($row)) {
                        throw new \Error("The phone number format isn't valid. Allow number only");
                    }
                } elseif($key === UserEnum::USER_EMAIL) {
                    // Check the length of the email
                    if(!$this->formManager->checkMaxLength($row)) {
                        throw new \Error("The email address exceed 255 caracters length");
                    }

                    // Check if email is valid
                    if(!$this->formManager->isEmail($row)) {
                        throw new \Error("The email isn't valid");
                    }
                } elseif($key === UserEnum::USER_PASSWORD) {
                    // Check the password min length
                    if(!$this->formManager->checkMinLength($row, 8)) {
                        throw new \Error("The password length must be at least 8 caracters");
                    }

                    // Check if the password is secured
                    if(!$this->formManager->isSecurePassword($row)) {
                        throw new \Error("The password is not secure enough");
                    }
                }

                $userFields[$key] = $row;
            }
        }

        return $userFields;
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