<?php

namespace App\Controller\API;

use App\Manager\FormManager;
use App\Manager\ContactManager;
use App\Manager\SerializeManager;
use App\Repository\ContactRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class ContactController extends AbstractController
{
    private FormManager $formManager;
    private ContactManager $contactManager;
    private SerializeManager $serializerManager;
    private ContactRepository $contactRepository;

    function __construct(
        FormManager $formManager, 
        ContactManager $contactManager,
        SerializeManager $serializerManager,
        ContactRepository $contactRepository
    ) {
        $this->formManager = $formManager;
        $this->contactManager = $contactManager;
        $this->serializerManager = $serializerManager;
        $this->contactRepository = $contactRepository;
    }

    /**
     * @Route("/contact", name="get_contact", methods={"GET"})
     */
    public function get_contact(Request $request) : JsonResponse 
    {
        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset > 1 ? $offset : 1;
        $litmit = 20;

        $contacts = $this->contactRepository->findBy([], ["id" => "ASC"], $limit, ($offset - 1) * $limit);

        return $this->json(
            $this->serializerManager->serializeContent($contacts), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/contact", name="post_contact", methods={"POST"})
     */
    public function post_contact(Request $request): JsonResponse
    {
        $requestContent = $request->getContent();

        // Isolate fields
        $response = "";
        $isValid = true;
        $contactContent = [];
        foreach($requestContent as $key => $value) {
            if(in_array($key, ["email", "message"])) {
                if($key === "email") {
                    if(!$formManager->isEmpty($value)) {
                        $isValid = false;
                        $response = "Le champ email ne peut pas être vide";
                        break;
                    }

                    if(!$formManager->isEmail($value)) {
                        $isValid = false;
                        $response = "Une erreur a été rencontrée avec l'email.";
                        break;
                    }
                } elseif($key === "message") {
                    if(!$formManager->isEmpty($value)) {
                        $isValid = false;
                        $response = "Le message ne peut pas être vide.";
                        break;
                    }

                    if(!$formManager->checkLimitLength($value, 1, 1000)) {
                        $response = "Le message ne respecte pas les limitations de caractères.";
                        $isValid = false;
                        break;
                    }
                }

                $contactContent[$key] = $value;
            }
        }

        if(!$isValid) {
            return $this->json($response, Response::HTTP_FORBIDDEN);
        }

        if(count($contactContent) < 2) {
            return $this->json("Le sujet ou le message est manquant.", Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $contact = $this->contactManager->add(
                $contactContent["subject"], 
                $contactContent["message"],
                true
            );
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($bodyContent, Response::HTTP_OK);
    }

    /**
     * @Route("/contact/{contactID}", requirements={"contactID"="\d+"}, name="remove_single_contact", methods={"DELETE"})
     */
    public function remove_single_contact(Request $request, int $companyID) : JsonResponse 
    {
        return $this->json(["message" => "Route under construction"], Response::HTTP_OK);
    }
}
