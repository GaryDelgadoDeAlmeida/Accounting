<?php

namespace App\Controller\API;

use App\Manager\FormManager;
use App\Manager\CompanyManager;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use App\Repository\EstimateRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\InvoiceDetailRepository;
use App\Repository\EstimateDetailRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class CompanyController extends AbstractController {

    private EntityManagerInterface $em;
    private FormManager $formManager;
    private CompanyManager $companyManager;
    private SerializeManager $serializeManager;
    private UserRepository $userRepository;
    private CompanyRepository $companyRepository;
    private EstimateRepository $estimateRepository;
    private EstimateDetailRepository $estimateDetailRepository;
    private InvoiceRepository $invoiceRepository;
    private InvoiceDetailRepository $invoiceDetailRepository;

    function __construct(
        EntityManagerInterface $em,
        FormManager $formManager,
        SerializeManager $serializeManager,
        CompanyManager $companyManager,
        UserRepository $userRepository,
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        InvoiceDetailRepository $invoiceDetailRepository,
        EstimateRepository $estimateRepository,
        EstimateDetailRepository $estimateDetailRepository
    ) {
        $this->em = $em;
        $this->formManager = $formManager;
        $this->serializeManager = $serializeManager;
        $this->companyManager = $companyManager;
        $this->userRepository = $userRepository;
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
        $limit = 20;
        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset > 1 ? $offset : 1;

        return $this->json(
            $this->serializeManager->serializeContent(
                $this->companyRepository->getCompanies($offset, $limit)
            ), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/company", name="post_company", methods={"POST"})
     */
    public function post_company(Request $request): JsonResponse
    {
        // Get the body request
        $bodyContent = $request->getContent();

        // Decode the JSON content into array
        $jsonContent = json_decode($bodyContent);
        if(!$jsonContent) {
            return $this->json(null, Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Separate only the needed value
        $content = [];
        foreach($jsonContent as $key => $row) {
            if(!in_array($key, ["name", "address", "zip_code", "city", "country", "siren", "siret", "dns_number", "phone", "email"])) {
                continue;
            }

            // $this->formManager
            $content[$key] = $row;
        }

        try {
            $company = $this->companyManager->fillCompany($content);
        } catch(\Exeception $e) {
            return $this->json($e->getMessage());
        }

        return $this->json(null, Response::HTTP_CREATED);
    }

    /**
     * @Route("/company/{companyID}", requirements={"companyID"="\d+"}, name="get_company", methods={"GET"})
     */
    public function get_company(Request $request, int $companyID): JsonResponse
    {
        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        $userID = $request->get("userID", 1);
        $user = $this->userRepository->find($userID);
        if(empty($user)) {
            return $this->json("Not found user", Response::HTTP_FORBIDDEN);
        }

        return $this->json($this->serializeManager->serializeContent([
            "company" => $company,
            "estimates" => $this->estimateRepository->getEstimatesByCompanyAndUser($company, $user),
            "invoices" => $this->invoiceRepository->getInvoicesByClientAndUser($company, $user)
        ]), Response::HTTP_OK);
    }

    /**
     * @Route("/company/{companyID}/estimates", requirements={"companyID"="\d+"}, name="get_estimates_form_company", methods={"GET"})
     */
    public function get_estimates_form_company(Request $request, int $companyID) : JsonResponse {
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
    function update_estimate_form_company(Request $resquest, int $companyID, int $estimateID) : JsonResponse
    {
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
        $userID = $request->get("userID");
        $userID = is_numeric($userID) ? $userID : null;
        if(empty($userID)) {
            return $this->json("Missing user id", Response::HTTP_FORBIDDEN);
        }

        $user = $this->userRepository->find($userID);
        if(empty($user)) {
            return $this->json("Not found user", Response::HTTP_NOT_FOUND);
        }

        $company = $this->companyRepository->find($companyID);
        if(empty($company)) {
            return $this->json("The company couldn't be found", Response::HTTP_NOT_FOUND);
        }

        try {
            // Unlink the user and the company
            $company->removeUser($user);

            // Remove all invoices of the user and the company
            $invoices = $this->invoiceRepository->getInvoicesByClientAndUser($company, $user);
            foreach($invoices as $invoice) {
                foreach($invoice->getInvoiceDetails() as $invoiceDetail) {
                    $this->invoiceDetailRepository->remove($invoiceDetail);
                }

                $this->invoiceRepository->remove($invoice, true);
            }

            // Remove all estimates of the user and the company
            $estimates = $this->estimateRepository->getEstimatesByClientAndUser($company, $user);
            foreach($estimates as $estimate) {
                foreach($estimate->getEstimateDetails() as $estimateDetail) {
                    $this->estimateDetailRepository->remove($estimateDetail);
                }

                $this->estimateRepository->remove($estimate, true);
            }
        } catch(\Exception $e) {
            return $this->json($e->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}