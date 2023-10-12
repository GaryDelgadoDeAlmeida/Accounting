<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Manager\SerializeManager;
use App\Repository\UserRepository;
use App\Repository\CompanyRepository;
use App\Repository\InvoiceRepository;
use App\Repository\EstimateRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class DefaultController extends AbstractController
{
    private User $user;
    private SerializeManager $serializerManager;
    private CompanyRepository $companyRepository;
    private InvoiceRepository $invoiceRepository;
    private EstimateRepository $estimateRepository;

    function __construct(
        Security $security,
        UserRepository $userRepository, // Temporary : To delete after the login system has been implemented
        SerializeManager $serializeManager,
        CompanyRepository $companyRepository,
        InvoiceRepository $invoiceRepository,
        EstimateRepository $estimateRepository
    ) {
        $this->user = $security->getUser() ?? $userRepository->find(1); 
        $this->serializeManager = $serializeManager;
        $this->companyRepository = $companyRepository;
        $this->invoiceRepository = $invoiceRepository;
        $this->estimateRepository = $estimateRepository;
    }

    /**
     * @Route("/resume", name="index", methods={"GET"})
     */
    public function index(Request $request): JsonResponse
    {
        if(empty($this->user)) {
            return $this->json("The user is missing", Response::HTTP_FORBIDDEN);
        }

        $userID = $this->user->getId();
        $currentDate = new \DateTime();

        return $this->json($this->serializeManager->serializeContent([
            "nbrClients" => $this->companyRepository->countCompanies($userID),
            "lastMonthAmount" => $this->invoiceRepository->getMonthBenefit($this->user, (new \DateTime())->modify("-1 month")->format("m")),
            "ongoingMonthAmout" => $this->invoiceRepository->getMonthBenefit($this->user, $currentDate->format("Y")),
            "currentYearBenefit" => $this->invoiceRepository->getYearBenefit($this->user, $currentDate->format("Y")),
            "clients" => $this->companyRepository->getCompaniesByUser($userID, 1, 3),
            "invoices" => $this->invoiceRepository->getInvoices($userID, 1, 3),
            "estimates" => $this->estimateRepository->getEstimates($userID, 1, 3)
        ]), Response::HTTP_OK);
    }
}
