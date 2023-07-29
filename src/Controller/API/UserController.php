<?php

namespace App\Controller\API;

use App\Enum\UserEnum;
use App\Manager\FormManager;
use App\Manager\UserManager;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class UserController extends AbstractController
{
    private UserRepository $userRepository;
    private FormManager $formManager;
    private UserManager $userManager;
    private SerializeManager $serializeManager;

    function __construct(
        UserRepository $userRepository, 
        SerializeManager $serializeManager, 
        FormManager $formManager, 
        UserManager $userManager
    ) {
        $this->userRepository = $userRepository;
        $this->formManager = $formManager;
        $this->userManager = $userManager;
        $this->serializeManager = $serializeManager;
    }

    /**
     * @Route("/user", name="get_users", methods={"GET"})
     */
    public function get_users(Request $request): JsonResponse
    {
        $limit = 20;
        $offset = $request->get("offset", 0);
        $offset = is_numeric($offset) && $offset >= 1 ? $offset : 1;

        // Get users
        $users = $this->userRepository->findBy([], ["id" => "ASC"], $limit, ($offset - 1) * $limit);

        // Return a response to the user
        return $this->json(
            $this->serializeManager->serializeContent($users), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/user", name="post_user", methods={"POST"})
     */
    public function post_user(Request $request) : JsonResponse {
        // Get the body request (normally in JSON)
        $bodyContent = $request->getContent();

        // Decode the JSON
        $jsonContent = json_decode($bodyContent);

        // If the JSON couldn't be decoded then return an error to the client
        if(!$jsonContent) {
            return $this->json([
                "message" => "An error has been found with the sended body"
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $isValid = true;
        $userFields = [];
        try {
            foreach($jsonContent as $key => $row) {
                if(in_array($key, UserEnum::getChoices())) {
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
        } catch(\Exception $e) {
            return $this->json([
                "message" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Check if an account already exist with the same email
        if(!empty($this->userRepository->findOneBy(["email" => $userFields[UserEnum::USER_EMAIL]]))) {
            return $this->json([
                "message" => "An account with the email '{$userFields[UserEnum::USER_EMAIL]}' already exist"
            ], Response::HTTP_FORBIDDEN);
        }

        // After all check, if everything is OK, then create the new user account
        $response = $this->userManager->newUser(
            $userFields[UserEnum::USER_FIRSTNAME],
            $userFields[UserEnum::USER_LASTNAME],
            $userFields[UserEnum::USER_EMAIL],
            $userFields[UserEnum::USER_PASSWORD],
        );

        if(!($response instanceof User)) {
            return $this->json([
                "message" => $response
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Return a response to the client
        return $this->json([
            "message" => "The account {$userFields[UserEnum::USER_EMAIL]} has been successfully created"
        ], Response::HTTP_CREATED);
    }

    /**
     * @Route("/user/{userID}", name="single_user", methods={"GET"})
     */
    public function get_user(Request $request, int $userID) : JsonResponse {
        // Search the user
        $user = $this->userRepository->find($userID);

        // Return a response to the client
        return $this->json($user ?? [], $user ? Response::HTTP_OK : Response::HTTP_NOT_FOUND);
    }
}
