<?php

namespace App\Controller\API;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

#[Route(path: '/api', name: 'api_')]
class SecurityController extends AbstractController
{
    #[Route(path: '/login', name: 'login', methods: ["POST"])]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // If the user is already connected
        if ($this->getUser()) {
            return $this->json(["message" => "The user is already connected"], Response::HTTP_FORBIDDEN);
        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->json(['last_username' => $lastUsername, 'error' => $error], Response::HTTP_OK);
    }

    #[Route(path: '/logout', name: 'logout', methods: ["GET"])]
    public function logout(): JsonResponse
    {
        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
