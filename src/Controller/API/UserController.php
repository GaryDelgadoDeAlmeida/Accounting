<?php

namespace App\Controller\API;

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
    private SerializeManager $serializeManager;

    function __construct(UserRepository $userRepository, SerializeManager $serializeManager)
    {
        $this->userRepository = $userRepository;
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

        foreach($jsonContent as $key => $row) {
            // 
        }

        // Return a response to the client
        return $this->json([], Response::HTTP_CREATED);
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
