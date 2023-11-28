<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Enum\UserEnum;
use App\Manager\UserManager;
use App\Manager\TokenManager;
use App\Manager\FreelanceManager;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use App\Repository\EstimateRepository;
use App\Repository\FreelanceRepository;
use App\Repository\InvoiceDetailRepository;
use App\Repository\EstimateDetailRepository;
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
    private ?User $user;
    
    private UserManager $userManager;
    private TokenManager $tokenManager;
    private FreelanceManager $freelanceManager;
    private SerializeManager $serializeManager;
    
    private UserRepository $userRepository;
    private CompanyRepository $companyRepository;
    private InvoiceRepository $invoiceRepository;
    private EstimateRepository $estimateRepository;
    private FreelanceRepository $freelanceRepository;
    private InvoiceDetailRepository $invoiceDetailRepository;
    private EstimateDetailRepository $estimateDetailRepository;

    function __construct(
        Security $security,
        UserManager $userManager,
        TokenManager $tokenManager,
        FreelanceManager $freelanceManager,
        SerializeManager $serializeManager, 
        UserRepository $userRepository, 
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        EstimateRepository $estimateRepository,
        FreelanceRepository $freelanceRepository,
        InvoiceDetailRepository $invoiceDetailRepository,
        EstimateDetailRepository $estimateDetailRepository
    ) {
        $this->user = $security->getUser() ?? null;
        $this->userManager = $userManager;
        $this->tokenManager = $tokenManager;
        $this->freelanceManager = $freelanceManager;
        $this->serializeManager = $serializeManager;
        
        $this->userRepository = $userRepository;
        $this->companyRepository = $companyRepository;
        $this->invoiceRepository = $invoiceRepository;
        $this->estimateRepository = $estimateRepository;
        $this->freelanceRepository = $freelanceRepository;
        $this->invoiceDetailRepository = $invoiceDetailRepository;
        $this->estimateDetailRepository = $estimateDetailRepository;
    }

    /**
     * @Route("/users", name="get_users", methods={"GET"})
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
        $jsonContent = json_decode($request->getContent(), true);
        if(!$jsonContent) {
            return $this->json("An error has been found with the sended body", Response::HTTP_PRECONDITION_FAILED);
        }

        $userFields = [];
        try {
            $userFields = $this->userManager->checkUserFields($jsonContent);

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
                $userFields[UserEnum::USER_BIRTH_DATE]
            );

            if(!($response instanceof User)) {
                return $this->json($response, Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Return a response to the client
        return $this->json("The account {$userFields[UserEnum::USER_EMAIL]} has been successfully created", Response::HTTP_CREATED);
    }

    /**
     * @Route("/profile", name="get_profile", methods={"GET"})
     */
    public function get_profile(Request $request) : JsonResponse {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json(null, Response::HTTP_FORBIDDEN);
        }
        
        return $this->json(
            $this->serializeManager->serializeContent($this->user), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/profile", name="update_profile", methods={"UPDATE", "PUT"})
     */
    public function update_profile(Request $request) : JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $jsonContent = json_decode($request->getContent(), true);
        if(empty($jsonContent)) {
            return $this->json("An error has been encoutered with the sended body", Response::HTTP_PRECONDITION_FAILED);
        }

        try {
            if(isset($userFields["password"])) {
                if($userFields["password"] === $userFields["new_password"]) {
                    return $this->json(
                        "The old password and the new one are the same.", 
                        Response::HTTP_FORBIDDEN
                    );
                }

                if($userFields["new_password"] !== $userFields["confirm_password"]) {
                    return $this->json(
                        "The confirmation password field value isn't the same as the password", 
                        Response::HTTP_PRECONDITION_FAILED
                    );
                }
            }

            $userFields = $this->userManager->checkUserFields($jsonContent);
            if(empty($userFields)) {
                return $this->json("", Response::HTTP_PRECONDITION_FAILED);
            }

            // Update profile
            $this->user = $this->userManager->fillUser($userFields, $this->user);
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/profile/freelance", name="profile_post_freelance", methods={"POST", "UPDATE", "PUT"})
     */
    public function profile_post_freelance(Request $request) : JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $jsonContent = json_decode($request->getContent(), true);
        if(empty($jsonContent)) {
            return $this->json("", Response::HTTP_PRECONDITION_FAILED);
        }

        try {
            $fields = $this->freelanceManager->checkFields($jsonContent);
            if(empty($fields)) {
                return $this->json("", Response::HTTP_PRECONDITION_FAILED);
            }

            $this->freelanceManager->fillFreelance($fields, $this->user);
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/user/{userID}", name="single_user", requirements={"userID"="\d+"}, methods={"GET"})
     */
    public function get_user(Request $request, int $userID) : JsonResponse {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        if(!$this->user->isAdmin()) {
            return $this->json(null, Response::HTTP_FORBIDDEN);
        }

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
    public function update_user(Request $request, int $userID) : JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        if(!$this->user->isAdmin()) {
            return $this->json("The user don't have the necessary rigths to process an update on another user than himself", Response::HTTP_FORBIDDEN);
        }

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
        $company = $user->findCompanyBySiret($companyJsonContent["siret"]);
        if($company) {
            return $this->json("A company already exist with the same siret number", Response::HTTP_FORBIDDEN);
        }

        // Process to the insert

        return $this->json("Route under construction", Response::HTTP_OK);
    }

    /**
     * @Route("/profile/remove", name="user_profile_remove", methods={"DELETE"})
     */
    public function user_profile_remove(Request $request) : JsonResponse {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        try {
            // Remove all companies linked to the client
            foreach($this->user->getCompanies() as $company) {
                if(count($company->getUsers()) > 1) {
                    $this->companyRepository->remove($company);
                } else {
                    $company->removeUser($this->user);
                }

                $this->em->flush();
            }

            // Remove all estimates
            foreach($this->user->getEstimates() as $estimate) {
                foreach($estimate->getEstimateDetails() as $detail) {
                    $this->estimateDetailRepository->remove($detail);
                }
                $this->estimateRepository->remove($estimate, true);
            }

            // Remove all invoices
            foreach($this->user->getInvoices() as $invoice) {
                foreach($invoice->getInvoiceDetails() as $detail) {
                    $this->invoiceDetailRepository->remove($detail);
                }
                $this->invoiceRepository->remove($invoice, true);
            }

            // Remove freelance link
            if($this->user->getFreelance() != null) {
                $this->freelanceRepository->remove($this->user->getFreelance(), true);
            }

            // Remove the user account in the end
            $this->userRepository->remove($this->user, true);

        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
    
    /**
     * @Route("/user/{userID}/remove", name="user_remove", requirements={"userID"="\d+"}, methods={"DELETE"})
     */
    public function user_remove_account(Request $request, int $userID) : JsonResponse {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        try {
            // 
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
