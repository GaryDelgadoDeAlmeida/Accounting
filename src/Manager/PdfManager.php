<?php

namespace App\Manager;

use Dompdf\Dompdf;
use App\Entity\Estimate;

class PdfManager {

    private Dompdf $pdf;

    function __construct(Dompdf $pdf) {
        $this->pdf = $pdf;
    }

    public function generatePdf(Estimate $estimate)
    {
        $response = $this->pdf->loadHtml(
            $this->render("model/estimate.html.twig", [
                "estimate" => $estimate
            ])
        );
        return;
    }
}