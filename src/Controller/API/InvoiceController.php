<?php

namespace App\Controller\API;

use App\Manager\FormManager;
use App\Manager\InvoiceManager;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @Route("/api", name="api_")
 */
class InvoiceController extends AbstractController
{
    private FormManager $formManager;
    private InvoiceManager $invoiceManager;
    private InvoiceRepository $invoiceRepository;

    function __construct(
        FormManager $formManager, 
        InvoiceManager $invoiceManager, 
        InvoiceRepository $invoiceRepository
    ) {
        $this->formManager = $formManager;
        $this->invoiceManager = $invoiceManager;
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * @Route("/invoice", name="invoice", methods={"GET"})
     */
    public function get_invoices(Request $request): Response
    {
        $limit = 20;
        $offset = $request->get("offset", 1);
        $offset = is_numeric($offset) && $offset >= 1 ? $offset : 1;

        return $this->json($this->invoiceRepository->findBy([], ["id" => "ASC"], $limit, ($offset - 1) * $limit));
    }

    /**
     * @Route("/invoice", name="invoice_add", methods={"POST"})
     */
    public function post_invoice(Request $request)
    {
        return $this->json(["All right"]);
    }

    /**
     * @Route("/invoice/{invoiceID}", name="single_invoice", methods={"GET"})
     */
    public function get_invoice(int $invoiceID = 0)
    {
        $invoice = $this->invoiceRepository->find($invoiceID);

        return $this->json($invoice ?? [], $invoice ? Response::HTTP_OK : Response::HTTP_NOT_FOUND);
    }

    /**
     * @Route("/invoice/{invoiceID}/update", name="update_invoice", methods={"PUT", "UPDATE"})
     */
    public function update_invoice(Request $request, int $invoiceID = 0)
    {
        $invoice = $this->invoiceRepository->find($invoiceID);
        if(!$invoice) {
            return $this->json(null, Response::HTTP_NOT_FOUND);
        }

        $jsonContent = $request->getContent();
        if(!$jsonContent) {
            if(!$invoice) {
                return $this->json(null, Response::HTTP_FORBIDDEN);
            }
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }

    /**
     * @Route("/invoice/{invoiceID}/remove", name="remove_invoice", methods={"DELETE"})
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

        // Remove the invoice
        try {
            $this->invoiceRepository->remove($invoice, true);
        } catch(\Exception $e) {
            return $this->json(["message" => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json(null, Response::HTTP_ACCEPTED);
    }
}
