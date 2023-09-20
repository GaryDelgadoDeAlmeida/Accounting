<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Enum\UserEnum;
use App\Manager\FormManager;
use App\Manager\UserManager;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class UserController extends AbstractController
{
    private User $user;
    private FormManager $formManager;
    private UserManager $userManager;
    private SerializeManager $serializeManager;
    private UserRepository $userRepository;

    function __construct(
        Security $security,
        FormManager $formManager, 
        UserManager $userManager,
        SerializeManager $serializeManager, 
        UserRepository $userRepository, 
    ) {
        $this->user = $security->getUser() ?? (new User())->setRoles(["ROLE_USER"]);
        $this->formManager = $formManager;
        $this->userManager = $userManager;
        $this->serializeManager = $serializeManager;
        $this->userRepository = $userRepository;
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

        // If the JSON couldn't be decoded then return an error to the client
        $jsonContent = json_decode($request->getContent());
        if(!$jsonContent) {
            return $this->json("An error has been found with the sended body", Response::HTTP_PRECONDITION_FAILED);
        }

        $userFields = [];
        try {
            $userFields = $this->userManager->checkUserFields($jsonContent);
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Check if an account already exist with the same email
        if(!empty($this->userRepository->findOneBy(["email" => $userFields[UserEnum::USER_EMAIL]]))) {
            return $this->json("An account with the email '{$userFields[UserEnum::USER_EMAIL]}' already exist", Response::HTTP_FORBIDDEN);
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
     * @Route("/user/{userID}", name="single_user", requirements={"userID"="\d+"}, methods={"GET"})
     */
    public function get_user(Request $request, int $userID) : JsonResponse {
        $user = $this->userRepository->find($userID);
        if(empty($user)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        // Return a response to the client
        return $this->json(
            $this->serializeManager->serializeContent($user), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/user/{userID}", name="update_single_user", requirements={"userID"="\d+"}, methods={"PUT", "UPDATE"})
     */
    public function update_user(Request $request, int $userID) : JsonResponse {

        $user = $this->userRepository->find($userID);
        if(empty($user)) {
            return $this->json(null, Response::HTTP_FORBIDDEN);
        }

        $jsonContent = json_decode($request->getContent());
        if(empty($userFields)) {
            return $this->json("An error has been encoutered with the sended body", Response::HTTP_PRECONDITION_FAILED);
        }

        try {
            $userFields = $this->userManager->checkUserFields($jsonContent);
        } catch(\Exception $e) {
            return $this->json([
                "message" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/user/{userID}/freelance", name="user_get_freelance", requirements={"userID"="\d+"}, methods={"GET"})
     */
    public function user_get_freelance(Request $request, int $userID) : JsonResponse {
        $user = $this->userRepository->find($userID);
        if(!$user) {
            return $this->json("The user coundn't be found", Response::HTTP_FORBIDDEN);
        }

        return $this->json(
            $this->serializeManager->serializeContent($user->getFreelance()), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/user/{userID}/freelance", name="user_post_freelance", requirements={"userID"="\d+"}, methods={"POST"})
     */
    public function user_post_freelance(Request $request, int $userID) : JsonResponse {
        $user = $this->userRepository->find($userID);
        if(!$user) {
            return $this->json("The user coundn't be found", Response::HTTP_FORBIDDEN);
        }
        
        $jsonContent = json_decode($request->getContent(), true);
        if(empty($jsonContent)) {
            return $this->json("Empty body", Response::HTTP_PRECONDITION_FAILED);
        }
        // FreelanceEnum::getAvalaibleChoices
    }

    /**
     * @Route("/user/{userID}/company", name="user_post_company", requirements={"userID"="\d+"}, methods={"POST"})
     */
    public function user_post_company(Request $request, int $userID) : JsonResponse {
        $user = $this->userRepository->find($userID);
        if(!$user) {
            return $this->json("Unknown user", Response::HTTP_FORBIDDEN);
        }

        $companyJsonContent = json_decode($request->getContent());
        if(!$companyJsonContent) {
            return $this->json("Empty body", Response::HTTP_PRECONDITION_FAILED);
        }

        // check if a company linked to the user already use the siret (has to be unique)
        $company = $user->getCompany($companyJsonContent["siret"]);
        if($company) {
            return $this->json("A company already exist with the same siret number", Response::HTTP_FORBIDDEN);
        }

        // Process to the insert

        return $this->json("Route under construction", Response::HTTP_OK);
    }
}
