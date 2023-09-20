<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Manager\FormManager;
use App\Manager\InvoiceManager;
use App\Manager\SerializeManager;
use App\Repository\InvoiceRepository;
use App\Repository\InvoiceDetailRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class InvoiceController extends AbstractController
{
    private User $user;
    private FormManager $formManager;
    private InvoiceManager $invoiceManager;
    private SerializeManager $serializeManager;
    private InvoiceRepository $invoiceRepository;
    private InvoiceDetailRepository $invoiceDetailRepository;

    function __construct(
        Security $security,
        FormManager $formManager, 
        InvoiceManager $invoiceManager, 
        SerializeManager $serializeManager,
        InvoiceRepository $invoiceRepository,
        InvoiceDetailRepository $invoiceDetailRepository
    ) {
        $this->user = $security->getUser() ?? (new User());
        $this->formManager = $formManager;
        $this->invoiceManager = $invoiceManager;
        $this->serializeManager = $serializeManager;
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceDetailRepository = $invoiceDetailRepository;
    }

    /**
     * @Route("/invoice", name="get_invoices", methods={"GET"})
     */
    public function get_invoices(Request $request): JsonResponse
    {
        $limit = 20;
        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset >= 1 ? $offset : 1;

        return $this->json(
            $this->serializeManager->serializeConten(
                $this->invoiceRepository->findBy([], ["id" => "ASC"], $limit, ($offset - 1) * $limit)
            ),
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/invoice", name="new_invoice", methods={"POST"})
     */
    public function post_invoice(Request $request)
    {
        return $this->json(["All right"]);
    }

    /**
     * @Route("/invoice/{invoiceID}", name="get_invoice", requirements={"invoiceID"="\d+"}, methods={"GET"})
     */
    public function get_invoice(int $invoiceID = 0): JsonResponse
    {
        $invoice = $this->invoiceRepository->find($invoiceID);
        if(empty($invoice)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->json(
            $this->serializeManager->serializeContent($invoice), 
            Response::HTTP_OK
        );
    }

    /**
     * @Route("/invoice/{invoiceID}/update", name="update_invoice", requirements={"invoiceID"="\d+"}, methods={"PUT", "UPDATE"})
     */
    public function update_invoice(Request $request, int $invoiceID = 0): JsonResponse
    {
        $invoice = $this->invoiceRepository->find($invoiceID);
        if(!$invoice) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        $jsonContent = $request->getContent();
        if(!$jsonContent) {
            return $this->json(null, Response::HTTP_PRECONDITION_FAILED);
        }

        // udpate invoice

        // Return a response to the client
        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/invoice/{invoiceID}/pdf", name="get_invoice_pdf", requirements={"invoiceID"="\d+"}, methods={"GET"})
     */
    public function get_invoice_pdf(int $invoiceID)
    {
        $invoice = $this->invoiceRepository->find($invoiceID);
        if(empty($invoice)) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        return $this->invoiceManager->generateInvoice($invoice);
    }

    /**
     * @Route("/invoice/{invoiceID}/remove", name="remove_invoice", requirements={"invoiceID"="\d+"}, methods={"DELETE"})
     */
    public function remove_invoice(Request $request, int $invoiceID = 0) : JsonResponse 
    {
        if(empty($invoiceID)) {
            return $this->json(["message" => "Unknown invoice identification"], Response::HTTP_FORBIDDEN);
        }

        $invoice = $this->invoiceRepository->find($invoiceID);
        if(empty($invoice)) {
            return $this->json(["message" => "Not found invoice"], Response::HTTP_NOT_FOUND);
        }

        try {
            // Remove all details linked to the invoice
            foreach($invoice->getInvoiceDetails() as $invoiceDetail) {
                $this->invoiceDetailRepository->remove($invoiceDetail, true);
            }

            // Remove the invoice
            $this->invoiceRepository->remove($invoice, true);
        } catch(\Exception $e) {
            return $this->json(["message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
