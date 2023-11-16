<?php

namespace App\Manager;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;

class TokenManager {

    private UserRepository $userRepository;

    function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function checkToken(Request $request) {
        $authorization = $request->headers->get('Authorization', null);
        if(!$authorization) {
            throw new \Error("The 'Authorization' header is missing", 403);
        }

        // skip beyond "Bearer "
        $tokenBearer = substr($authorization, 7);
        if(empty($tokenBearer)) {
            throw new \Error("The 'Authorization' header miss the token bearer", 403);
        }
        
        if(!$decodeToken = base64_decode($tokenBearer)) {
            throw new \Error("An error has been encountered with the sended token", 500);
        }

        $jsonToken = json_decode($decodeToken, true);
        if(!$jsonToken) {
            throw new \Error("An error has been encountered with the sended token", 500);
        }

        // Check the content of the token (normally, we have a json who have the email, roles and the user id)
        return $this->userRepository->find($jsonToken["userID"]);
    }
}