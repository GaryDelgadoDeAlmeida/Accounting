<?php

namespace App\Controller\API;

use App\Enum\UserEnum;
use App\Manager\UserManager;
use App\Repository\UserRepository;
use App\Security\LoginFormAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;

#[Route(path: '/api', name: 'api_')]
class SecurityController extends AbstractController
{
    private UserManager $userManager;
    private UserRepository $userRepository;

    public function __construct(UserManager $userManager, UserRepository $userRepository) {
        $this->userManager = $userManager;
        $this->userRepository = $userRepository;
    }

    #[Route(path: '/login', name: 'login')]
    public function login(AuthenticationUtils $authenticationUtils): JsonResponse
    {
        // If the user is already connected
        if ($this->getUser()) {
            return $this->json("The user is already connected", Response::HTTP_FORBIDDEN);
        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->json([
            'last_username' => $lastUsername, 
            'error' => $error
        ], Response::HTTP_OK);
    }

    #[Route(path: '/logout', name: 'logout', methods: ["GET"])]
    public function logout(): JsonResponse
    {
        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    #[Route(path: "/register", name: "register", methods: ["POST"])]
    public function register(Request $request, UserAuthenticatorInterface $authenticator, LoginFormAuthenticator $formAuthenticator) : JsonResponse 
    {
        $jsonContent = json_decode($request->getContent());
        if(empty($jsonContent)) {
            return $this->json("Empty body", Response::HTTP_PRECONDITION_FAILED);
        }

        $credentials = [];
        foreach($jsonContent as $key => $value) {
            if(!in_array($key, UserEnum::getAvailableChoices())) {
                continue;
            }

            $credentials[$key] = $value;
        }

        // Find the user using
        $user = $this->userRepository->findOneBy(["email" => $credentials[UserEnum::USER_EMAIL]]);
        if($user) {
            return $this->json([
                "message" => "An user with the same email address already exist"
            ], Response::HTTP_NOT_FOUND);
        }

        // After all check, if everything is OK, then create the new user account
        $user = $this->userManager->newUser(
            $credentials[UserEnum::USER_FIRSTNAME],
            $credentials[UserEnum::USER_LASTNAME],
            $credentials[UserEnum::USER_EMAIL],
            $credentials[UserEnum::USER_PASSWORD]
        );

        if(!($user instanceof User)) {
            return $this->json([
                "message" => $user
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        dd(
            $authenticator->authenticateUser(
                $user, 
                $formAuthenticator, 
                $request
            )
        );
        
        // substitute the previous line (redirect response) with this one.
        return $this->json([
            "token" => $authenticator->authenticateUser(
                $user, 
                $formAuthenticator, 
                $request
            )
        ]); 
    }
}
