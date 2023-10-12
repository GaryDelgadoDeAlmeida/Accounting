<?php

namespace App\Manager;

use Dompdf\Dompdf;
use Dompdf\Options;
use App\Entity\User;
use App\Entity\Company;
use App\Entity\Invoice;
use App\Enum\InvoiceEnum;
use App\Manager\FormManager;
use App\Entity\InvoiceDetail;
use App\Enum\InvoiceDetailEnum;
use App\Repository\InvoiceRepository;
use Psr\Container\ContainerInterface;
use App\Repository\InvoiceDetailRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceManager extends AbstractController {

    private FormManager $formManager;
    private InvoiceRepository $invoiceRepository;
    private InvoiceDetailRepository $invoiceDetailRepository;

    function __construct(
        FormManager $formManager,
        ContainerInterface $container,
        InvoiceRepository $invoiceRepository,
        InvoiceDetailRepository $invoiceDetailRepository
    ) {
        $this->setContainer($container);
        $this->formManager = $formManager;
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceDetailRepository = $invoiceDetailRepository;
    }

    /**
     * 
     * @param array json content
     * @return array
     */
    public function checkFields(array $jsonContent) {
        $fields = [];
        $invoiceAvailableFields = InvoiceEnum::getInvoiceAvailableChoices();

        foreach($jsonContent as $fieldName => $fieldValue) {
            if(!in_array($fieldName, $invoiceAvailableFields)) {
                continue;
            }

            if(in_array($fieldName, [InvoiceEnum::INVOICE_FILENAME, InvoiceEnum::INVOICE_FILEPATH, InvoiceEnum::INVOICE_DATE, InvoiceEnum::INVOICE_STATUS])) {
                if(!$this->formManager->isEmpty($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field name '[FIELD_NAME]' can't be empty")
                    );
                }
            }

            if(in_array($fieldName, [InvoiceEnum::INVOICE_FILENAME, InvoiceEnum::INVOICE_FILEPATH])) {
                if(!$this->formManager->checkMaxLength($fieldValue, 255)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field name '[FIELD_NAME]' can't be superior to 255 caracters length")
                    );
                }
            }

            if($fieldName === InvoiceEnum::INVOICE_DATE) {
                if(!$this->formManager->isDate($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The value in the '[FIELD_NAME]' isn't a valid date")
                    );
                }
            } elseif($fieldName === InvoiceEnum::INVOICE_STATUS) {
                if(!in_array($fieldValue, InvoiceEnum::getAvailableStatus())) {
                    throw new \Error(InvoiceEnum::getInvoiceStatus($fieldValue));
                }
            }

            $fields[$fieldName] = $fieldValue;
        }

        return $fields;
    }

    /**
     * 
     * @param array json content
     * @return array
     */
    public function checkDetailsFields(array $jsonContent) {
        $fields = [];
        $allowedFields = InvoiceDetailEnum::getAvailableChoices();

        foreach($jsonContent as $fieldName => $fieldValue) {

            // Check if the field name has to be checked
            if(!in_array($fieldName, $allowedFields)) {
                continue;
            }

            if(in_array($fieldName, [InvoiceDetailEnum::INVOICE_DETAIL_DESCRIPTION, InvoiceDetailEnum::INVOICE_DETAIL_QUANTITY])) {
                if(!$this->formManager->isEmpty($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field name '[FIELD_NAME]' must have a value")
                    );
                }
            }

            if($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_DESCRIPTION) {
                if(!$this->formManager->checkMaxLength($fieldValue, 255)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The value of the field '[FIELD_NAME]' musn't be greater than 255 caracters length")
                    );
                }
            } elseif($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_QUANTITY) {
                if(!$this->formManager->isNumeric($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field value of '[FIELD_NAME]' isn't numeric")
                    );
                }

                if(!$this->formManager->isInteger($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field '[FIELD_NAME]' must be an integer")
                    );
                }
            } elseif($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_PRICE) {
                if(!$this->formManager->isNumeric($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field value of '[FIELD_NAME]' isn't numeric")
                    );
                }
            } elseif($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_TVA) {
                if(!$this->formManager->isBool($fieldValue)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $fieldName, "The field value of '[FIELD_NAME]' isn't a boolean")
                    );
                }
            }

            $fields[$fieldName] = $fieldValue;
        }

        return $fields;
    }

    /**
     * 
     * @param array fields to fill the invoice object
     * @param Invoice invoice
     * @return Invoice
     */
    public function fillInvoice(array $fields, Invoice $invoice = new Invoice()) {
        foreach($fields as $fieldName => $fieldValue) {
            if($fieldName === InvoiceEnum::INVOICE_DATE) $invoice->setInvoiceDate(\DateTimeImmutable::createFromFormat("Y-m-d", $fieldValue));
            elseif($fieldName === InvoiceEnum::INVOICE_FILENAME) $invoice->setFilename($fieldValue);
            elseif($fieldName === InvoiceEnum::INVOICE_STATUS) $invoice->setStatus($fieldValue);
        }

        return $invoice;
    }

    /**
     * 
     * @param array fields to fill the invoice detail
     * @param InvoiceDetail invoice detail object
     * @return InvoiceDetail
     */
    public function fillInvoiceDetail(array $fields, InvoiceDetail $invoiceDetail = new InvoiceDetail()) {
        foreach($fields as $fieldName => $fieldValue) {
            if($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_DESCRIPTION) $invoiceDetail->setDescription($fieldValue);
            elseif($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_QUANTITY) $invoiceDetail->setQuantity($fieldValue);
            elseif($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_PRICE) $invoiceDetail->setPrice($fieldValue);
            elseif($fieldName === InvoiceDetailEnum::INVOICE_DETAIL_TVA) $invoiceDetail->setTva($fieldValue);
        }

        return $invoiceDetail;
    }

    /**
     * Add a new invoice to a company
     * 
     * @param User user
     * @param Company company
     * @param string filename
     * @param string filepath
     * @param \DateTimeImmutable invoice date
     * @return Invoice Return Invoice object
     */
    public function addInvoice(User $user, Company $company, string $filename, \DateTimeImmutable $invoiceDate): Invoice 
    {
        $invoice = (new Invoice())
            ->setUser($user)
            ->setCompany($company)
            ->setFilename($filename)
            ->setStatus(InvoiceEnum::STATUS_ONGOING)
            ->setInvoiceDate($invoiceDate)
            ->setCreatedAt(new \DateTimeImmutable())
        ;

        $this->invoiceRepository->save($invoice, true);
        return $invoice;
    }

    /**
     * 
     * @param Invoice invoice object
     * @param string description
     * @param int quantity
     * @param float price
     * @param bool apply tva or not
     * @return InvoiceDetail
     */
    public function addInvoiceDetail(Invoice $invoice, string $description, int $quantity, float $price, bool $tva) : InvoiceDetail {
        $invoiceDetail = (new InvoiceDetail())
            ->setInvoice($invoice)
            ->setDescription($description)
            ->setQuantity($quantity)
            ->setPrice($price)
            ->setTva($tva)
            ->setUpdatedAt(new \DateTimeImmutable())
            ->setCreatedAt(new \DateTimeImmutable())
        ;

        $this->invoiceDetailRepository->save($invoiceDetail, true);
        return $invoiceDetail;
    }

    /**
     * Generate a invoice
     * 
     * @param Invoice invoice object to generate the invoice pdf
     * @return Dompdf Return the generated invoice pdf
     */
    public function generateInvoice(Invoice $invoice)
    {
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'Arial');

        // Instantiate Dompdf with our options
        $dompdf = new Dompdf($pdfOptions);
        $html = null;
        
        // Retrieve the HTML generated in our twig file
        $html = $this->renderView('models/invoice.html.twig', [
            'invoice' => $invoice
        ]);
        
        // Load HTML to Dompdf
        $dompdf->loadHtml($html);
        
        // (Optional) Setup the paper size and orientation 'portrait' or 'portrait'
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF to Browser (force download)
        return $dompdf->stream("{$articleName}.pdf", [
            "Attachment" => false
        ]);
    }
}