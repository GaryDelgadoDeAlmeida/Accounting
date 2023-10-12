<?php

namespace App\Manager;

use App\Entity\Estimate;
use App\Entity\EstimateDetail;
use App\Enum\EstimateDetailEnum;
use App\Repository\CompanyRepository;
use Psr\Container\ContainerInterface;
use App\Repository\EstimateRepository;
use App\Repository\EstimateDetailRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EstimateManager extends AbstractController {

    private FormManager $formManager;
    private CompanyRepository $companyRepository;
    private EstimateRepository $estimateRepository;
    private EstimateDetailRepository $estimateDetailRepository;

    function __construct(
        ContainerInterface $container,
        FormManager $formManager,
        CompanyRepository $companyRepository,
        EstimateRepository $estimateRepository,
        EstimateDetailRepository $estimateDetailRepository
    ) {
        $this->setContainer($container);
        $this->formManager = $formManager;
        $this->companyRepository = $companyRepository;
        $this->estimateRepository = $estimateRepository;
        $this->estimateDetailRepository = $estimateDetailRepository;
    }

    public function checkFields(array $jsonContent) {
        $fields = [];
        $estimateDetailsFields = EstimateDetailEnum::getAvailableChoices();

        foreach($jsonContent as $index => $value) {
            if(!in_array($index, ["company", "date", "details"])) {
                continue;
            }

            if(in_array($index, ["company", "date", "details"])) {
                if(!$this->formManager->isEmpty($value)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $index, "The value of the field '[FIELD_NAME]' must have a value.")
                    );
                }
            }

            if($index === "company") {
                if(!$this->formManager->isNumber($value)) {
                    throw new \Error(
                        str_replace(["[FIELD_NAME]", $index, "The value of the field '[FIELD_NAME]' couldn't treated as a numeric value."])
                    );
                }

                $value = (int)$value;
                if(!$this->formManager->isInteger($value)) {
                    throw new \Error(
                        str_replace("[FIELD_NAME]", $index, "The field '[FIELD_NAME]' expect to be an integer.")
                    );
                }

                $value = $this->companyRepository->find($value);
                if(!$this->formManager->isEmpty($value)) {
                    throw new \Error("The company couldn't be found");
                }
            } elseif($index === "date") {
                if(!$this->formManager->isDate($value)) {
                    throw new \Error(
                        str_replace(["[FIELD_NAME]", "[DATE]"], [$index, $value], "An error has been encountered with the field '[FIELD_NAME]'. The value '[DATE]' couldn't be treated as a date.")
                    );
                }
            } elseif($index === "details") {
                foreach($value as $detailIndex => $detailValue) {
                    if(!in_array($detailIndex, $estimateDetailsFields)) {
                        continue;
                    }

                    if(in_array($detailIndex, ["title", "budget"])) {
                        if(!$this->formManager->isEmpty($detailValue)) {
                            throw new \Error(
                                str_replace("[FIELD_NAME]", $detailIndex, "The value of the field '[FIELD_NAME]' of an estimate detail must have a value.")
                            );
                        }
                    }

                    if(in_array($detailIndex, [EstimateDetailEnum::DETAIL_QUANTITY, EstimateDetailEnum::DETAIL_NBR_DAYS, EstimateDetailEnum::DETAIL_BUDGET])) {
                        if(!$this->formManager->isNumber($detailValue)) {
                            throw new \Error(
                                str_replace("[FIELD_NAME]", $detailIndex, "The field '[FIELD_NAME]' of a detail of the estimate isn't a number")
                            );
                        }
                    }

                    if($detailIndex === EstimateDetailEnum::DETAIL_TITLE) {
                        if(!$this->formManager->checkMaxLength($detailValue, 255)) {
                            throw new \Error(
                                str_replace("[FIELD_NAME]", $detailIndex, "")
                            );
                        }
                    } elseif($detailIndex === EstimateDetailEnum::DETAIL_DESCRIPTION) {
                        if(!$this->formManager->checkMaxLength($detailValue, 1000)) {
                            throw new \Error(
                                str_replace("[FIELD_NAME]", $detailIndex, "")
                            );
                        }
                    }
                }
            }

            $fields[$index] = $value;
        }

        return $fields;
    }

    public function fillEstimateDetail(array $fields, Estimate $estimate, EstimateDetail $estimateDetail = new EstimateDetail()) : EstimateDetail {
        return $estimateDetail
            ->setEstimate($estimate)
            ->setLabel($fields["title"])
            ->setDescription($fields["description"])
            ->setQuantity($fields["quantity"])
            ->setNbrDays($fields["nbr_days"])
            ->setPrice($fields["budget"])
            ->setCreatedAt(new \DateTimeImmutable())
        ;
    }

    public function generateEstimate(Shop $shop)
    {
        return;
    }
}