<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Enum\CompanyEnum;
use App\Manager\TokenManager;
use App\Manager\CompanyManager;
use App\Manager\SerializeManager;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use App\Repository\EstimateRepository;
use Doctrine\ORM\EntityManagerInterface;
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
class CompanyController extends AbstractController {

    private ?User $user = null;
    private EntityManagerInterface $em;
    private TokenManager $tokenManager;
    private CompanyManager $companyManager;
    private SerializeManager $serializeManager;
    private CompanyRepository $companyRepository;
    private InvoiceRepository $invoiceRepository;
    private EstimateRepository $estimateRepository;
    private InvoiceDetailRepository $invoiceDetailRepository;
    private EstimateDetailRepository $estimateDetailRepository;

    function __construct(
        Security $security,
        EntityManagerInterface $em,
        TokenManager $tokenManager,
        CompanyManager $companyManager,
        SerializeManager $serializeManager,
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        EstimateRepository $estimateRepository,
        InvoiceDetailRepository $invoiceDetailRepository,
        EstimateDetailRepository $estimateDetailRepository
    ) {
        $this->em = $em;
        $this->user = $security->getUser() ?? null;
        $this->tokenManager = $tokenManager;
        $this->serializeManager = $serializeManager;
        $this->companyManager = $companyManager;
        $this->companyRepository = $companyRepository;
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceDetailRepository = $invoiceDetailRepository;
        $this->estimateRepository = $estimateRepository;
        $this->estimateDetailRepository = $estimateDetailRepository;
    }

    /**
     * @Route("/companies", name="get_companies", methods={"GET"})
     */
    public function get_companies(Request $request): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }
        
        $limit = 20;
        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset > 1 ? $offset : 1;

        return $this->json(
            $this->serializeManager->serializeContent(
                $this->companyRepository->getCompaniesByUser($this->user->getId(), $offset, $limit)
            ), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/company", name="post_company", methods={"POST"})
     */
    public function post_company(Request $request): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        // Decode the JSON content into array
        $jsonContent = json_decode($request->getContent(), true);
        if(!$jsonContent) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            // Check all fields
            $fields = $this->companyManager->checkCompanyFields($jsonContent);

            // Search for an existing company using the siret number
            // $company = $this->companyRepository->findBy(["siret" => $fields[CompanyEnum::COMPANY_SIRET]]);

            // Fill the company object
            $company = $this->companyManager->fillCompany($fields, $this->user);
        } catch(\Exeception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_CREATED);
    }

    /**
     * @Route("/company/{companyID}", requirements={"companyID"="\d+"}, name="get_company", methods={"GET"})
     */
    public function get_company(Request $request, int $companyID): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $company = $this->user->getCompany($companyID);
        if(empty($company)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeManager->serializeContent([
            "company" => $company,
            "estimates" => $this->estimateRepository->getEstimatesByCompanyAndUser($company, $this->user),
            "invoices" => $this->invoiceRepository->getInvoicesByClientAndUser($company, $this->user)
        ]), Response::HTTP_OK);
    }

    /**
     * @Route("/company/{companyID}/estimates", requirements={"companyID"="\d+"}, name="get_estimates_form_company", methods={"GET"})
     */
    public function get_estimates_form_company(Request $request, int $companyID) : JsonResponse {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        // Return the response to the client
        return $this->json(
            $this->serializeManager->serializeContent(
                $company->getEstimates()
            ), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/company/{companyID}/estimate/{estimateID}/update", requirements={"companyID"="\d+", "estimateID"="\d+"}, name="update_estimate_form_company", methods={"PUT", "UPDATE"})
     */
    public function update_estimate_form_company(Request $resquest, int $companyID, int $estimateID) : JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $jsonContent = json_decode($request->getContent());
        if(empty($jsonContent)) {
            return $this->json("Empty body", Response::HTTP_PRECONDITION_FAILED);
        }

        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json("The company couldn't be found", Response::HTTP_NOT_FOUND);
        }

        $estimate = $this->estimateRepository->findBy(["id" => $estimateID, "company" => $company]);
        if(empty($estimate)) {
            return $this->json("The estimate couldn't be found", Response::HTTP_NOT_FOUND);
        }

        foreach($jsonContent as $key => $value) {
            // 
        }
        
        return $this->json(["message" => "Route under construction"], Response::HTTP_OK);
    }

    /**
     * @Route("/company/{companyID}/update", requirements={"companyID"="\d+"}, name="update_company", methods={"PUT"})
     */
    public function put_company(Request $request, int $companyID): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }
        
        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json("The company couldn't be found.", Response::HTTP_NOT_FOUND);
        }

        // Decode the JSON content into array
        $jsonContent = json_decode($request->getContent());
        if(empty($jsonContent)) {
            return $this->json("Empty body", Response::HTTP_FORBIDDEN);
        }

        $fields = [];

        try {
            // Check if all sended fields respect restriction on fields
            $fields = $this->companyManager->checkCompanyFields($jsonContent);
            
            // Update certain fields of the company
            $company = $this->companyManager->fillCompany($fields, $company);
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($this->serializeManager->serialiazeContent($company), Response::HTTP_OK);
    }

    /**
     * @Route("/company/{companyID}/remove", requirements={"companyID"="\d+"}, name="remove_company", methods={"DELETE"})
     */
    public function remove_company(Request $request, int $companyID): JsonResponse
    {
        // Check the cache or the token is cache don't exist
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $company = $this->user->getCompany($companyID);
        if(empty($company)) {
            return $this->json("The company couldn't be found", Response::HTTP_NOT_FOUND);
        }

        try {
            // Remove all invoices of the user and the company
            $invoices = $this->invoiceRepository->getInvoicesByClientAndUser($company, $this->user);
            foreach($invoices as $invoice) {
                foreach($invoice->getInvoiceDetails() as $invoiceDetail) {
                    $this->invoiceDetailRepository->remove($invoiceDetail);
                }

                $this->invoiceRepository->remove($invoice, true);
            }

            // Remove all estimates of the user and the company
            $estimates = $this->estimateRepository->getEstimatesByCompanyAndUser($company, $this->user);
            foreach($estimates as $estimate) {
                foreach($estimate->getEstimateDetails() as $estimateDetail) {
                    $this->estimateDetailRepository->remove($estimateDetail);
                }

                $this->estimateRepository->remove($estimate, true);
            }

            // Unlink the user and the company
            $company->removeUser($this->user);
            
            // Save change in the entity
            $this->em->flush();
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}