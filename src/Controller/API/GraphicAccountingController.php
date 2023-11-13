<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Manager\TokenManager;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class GraphicAccountingController extends AbstractController
{
    private ?User $user;
    private TokenManager $tokenManager;
    private InvoiceRepository $invoiceRepository;

    function __construct(
        Security $security, 
        TokenManager $tokenManager,
        InvoiceRepository $invoiceRepository
    ) {
        $this->user = $security->getUser() ?? null;
        $this->tokenManager = $tokenManager;
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * @Route("/graphic-accounting", name="graphic_accounting", methods={"GET"})
     */
    public function index(Request $request): JsonResponse
    {
        $this->user = $this->user ?? $this->tokenManager->checkToken($request);
        if(empty($this->user)) {
            return $this->json("User unauthentified", Response::HTTP_FORBIDDEN);
        }

        $yearAmount = [];
        $year = $request->get("year", (new \DateTime())->format("Y"));
        $invoices = $this->invoiceRepository->getDetailYearBenefit($this->user, $year);
        foreach($invoices as $invoice) {
            $month = intval($invoice->getInvoiceDate()->format("m"));
            if(!isset($yearAmount[$month])) {
                $yearAmount[$month] = 0;
            }

            $yearAmount[$month] += $invoice->getAmount();
        }
        
        return $this->json($yearAmount, Response::HTTP_OK);
    }
}
