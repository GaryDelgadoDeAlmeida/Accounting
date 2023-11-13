<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Manager\FormManager;
use App\Manager\ContactManager;
use App\Manager\SerializeManager;
use App\Repository\ContactRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class ContactController extends AbstractController
{
    private ?User $user;
    private FormManager $formManager;
    private ContactManager $contactManager;
    private SerializeManager $serializerManager;
    private ContactRepository $contactRepository;

    function __construct(
        Security $security,
        FormManager $formManager, 
        ContactManager $contactManager,
        SerializeManager $serializerManager,
        ContactRepository $contactRepository
    ) {
        $this->user = $security->getUser() ?? null;
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
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset > 1 ? $offset : 1;
        $limit = 20;

        return $this->json(
            $this->serializerManager->serializeContent(
                $this->contactRepository->findBy([], ["id" => "DESC"], $limit, ($offset - 1) * $limit)
            ), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/contact", name="post_contact", methods={"POST"})
     */
    public function post_contact(Request $request): JsonResponse
    {
        // Decode the JSON content into an array
        $jsonContent = json_decode($request->getContent());
        if(!$jsonContent) {
            return $this->json("Empty body", Response::HTTP_PRECONDITION_FAILED);
        }

        // Isolate fields
        $response = "";
        $isValid = true;
        $contactContent = [];
        foreach($jsonContent as $key => $value) {
            if(!in_array($key, ["subject", "message"])) {
                continue;
            }

            if($key === "subject") {
                if(!$this->formManager->isEmpty($value)) {
                    $isValid = false;
                    $response = "L'objet du mail ne peut pas être vide";
                    break;
                }

                if(!$this->formManager->checkMaxLength($value, 1, 255)) {
                    $isValid = false;
                    $response = "L'objet du mail est trop long";
                    break;
                }
            } elseif($key === "message") {
                if(!$this->formManager->isEmpty($value)) {
                    $isValid = false;
                    $response = "Le message ne peut pas être vide.";
                    break;
                }

                if(!$this->formManager->checkLimitLength($value, 1, 1000)) {
                    $response = "Le message ne respecte pas les limitations de caractères.";
                    $isValid = false;
                    break;
                }
            }

            $contactContent[$key] = $value;
        }

        if(!$isValid) {
            return $this->json($response, Response::HTTP_FORBIDDEN);
        }

        if(count($contactContent) < 2) {
            return $this->json("The subject or the message is missing", Response::HTTP_INTERNAL_SERVER_ERROR);
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

        return $this->json("The mail has been successfully sended", Response::HTTP_CREATED);
    }

    /**
     * @Route("/contact/{contactID}", requirements={"contactID"="\d+"}, name="remove_single_contact", methods={"DELETE"})
     */
    public function remove_single_contact(Request $request, int $contactID) : JsonResponse 
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        if(!$this->user->isAdmin()) {
            return $this->json("The user don't have the necessary rights", Response::HTTP_FORBIDDEN);
        }

        $contact = $this->contactRepository->find($contactID);
        if(!$contact) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        try {
            $this->contactRepository->remove($contact, true);
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
