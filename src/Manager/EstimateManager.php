<?php

namespace App\Manager;

use App\Entity\Estimate;
use App\Enum\EstimateEnum;
use App\Entity\EstimateDetail;
use App\Enum\EstimateDetailEnum;
use App\Repository\CompanyRepository;
use App\Repository\EstimateRepository;
use App\Repository\EstimateDetailRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class EstimateManager extends AbstractController {

    private FormManager $formManager;
    private CompanyRepository $companyRepository;
    private EstimateRepository $estimateRepository;
    private EstimateDetailRepository $estimateDetailRepository;

    function __construct(
        FormManager $formManager,
        CompanyRepository $companyRepository,
        EstimateRepository $estimateRepository,
        EstimateDetailRepository $estimateDetailRepository
    ) {
        $this->formManager = $formManager;
        $this->companyRepository = $companyRepository;
        $this->estimateRepository = $estimateRepository;
        $this->estimateDetailRepository = $estimateDetailRepository;
    }

    /**
     * @param array json content
     * @return array fields
     */
    public function checkFields(array $jsonContent) {
        $fields = [];
        $estimateAllowedChoices = EstimateEnum::getAvailableChoices();
        $estimateDetailsAllowedChoices = EstimateDetailEnum::getAvailableChoices();

        foreach($jsonContent as $index => $value) {
            if(!in_array($index, $estimateAllowedChoices)) {
                continue;
            }

            if(in_array($index, [EstimateEnum::ESTIMATE_COMPANY, EstimateEnum::ESTIMATE_DATE, EstimateEnum::ESTIMATE_DETAILS])) {
                if(!$this->formManager->isEmpty($value)) {
                    throw new \Exception(
                        str_replace("[FIELD_NAME]", $index, "The value of the field '[FIELD_NAME]' must have a value.")
                    );
                }
            }

            if($index === EstimateEnum::ESTIMATE_COMPANY) {
                if(!$this->formManager->isNumber($value)) {
                    throw new \Exception(
                        str_replace(["[FIELD_NAME]", $index, "The value of the field '[FIELD_NAME]' couldn't treated as a numeric value."])
                    );
                }

                $value = (int)$value;
                if(!$this->formManager->isInteger($value)) {
                    throw new \Exception(
                        str_replace("[FIELD_NAME]", $index, "The field '[FIELD_NAME]' expect to be an integer.")
                    );
                }

                $value = $this->companyRepository->find($value);
                if(!$this->formManager->isEmpty($value)) {
                    throw new \Exception("The company couldn't be found");
                }
            } elseif($index === EstimateEnum::ESTIMATE_DATE) {
                if(!$this->formManager->isDate($value)) {
                    throw new \Exception(
                        str_replace(["[FIELD_NAME]", "[DATE]"], [$index, $value], "An error has been encountered with the field '[FIELD_NAME]'. The value '[DATE]' couldn't be treated as a date.")
                    );
                }

                $value = new \DateTime($value);
            } elseif($index === EstimateEnum::ESTIMATE_APPLY_TVA) {
                if(!$this->formManager->isBool($value)) {
                    throw new \Exception(
                        str_replace("[FIELD_NAME]", $detailIndex, "The value of the field '[FIELD_NAME]' must be a boolean")
                    );
                }
            } elseif($index === EstimateEnum::ESTIMATE_TVA) {
                // If tva isn't allowed than skip it
                if(!$jsonContent[EstimateEnum::ESTIMATE_APPLY_TVA]) {
                    continue;
                }

                if(!$this->formManager->isNumber($value)) {
                    throw new \Exception(
                        str_replace("[FIELD_NAME]", $detailIndex, "The value of the field '[FIELD_NAME]' must be a number")
                    );
                }

                $value = floatval($value);
                if($value < 0) {
                    throw new \Exception(
                        str_replace("[FIELD_NAME]", $detailIndex, "The value of the field '[FIELD_NAME]' must be equal or greater than 0")
                    );
                }
            } elseif($index === EstimateEnum::ESTIMATE_DETAILS) {
                foreach($value as $detailIndex => $detailValue) {
                    if(!in_array($detailIndex, $estimateDetailsAllowedChoices)) {
                        continue;
                    }

                    if(in_array($detailIndex, ["title", "budget"])) {
                        if(!$this->formManager->isEmpty($detailValue)) {
                            throw new \Exception(
                                str_replace("[FIELD_NAME]", $detailIndex, "The value of the field '[FIELD_NAME]' of an estimate detail must have a value.")
                            );
                        }
                    }

                    if(in_array($detailIndex, [EstimateDetailEnum::DETAIL_QUANTITY, EstimateDetailEnum::DETAIL_NBR_DAYS, EstimateDetailEnum::DETAIL_BUDGET])) {
                        if(!$this->formManager->isNumber($detailValue)) {
                            throw new \Exception(
                                str_replace("[FIELD_NAME]", $detailIndex, "The field '[FIELD_NAME]' of a detail of the estimate isn't a number")
                            );
                        }
                    }

                    if($detailIndex === EstimateDetailEnum::DETAIL_TITLE) {
                        if(!$this->formManager->checkMaxLength($detailValue, 255)) {
                            throw new \Exception(
                                str_replace("[FIELD_NAME]", $detailIndex, "")
                            );
                        }
                    } elseif($detailIndex === EstimateDetailEnum::DETAIL_DESCRIPTION) {
                        if(!$this->formManager->checkMaxLength($detailValue, 1000)) {
                            throw new \Exception(
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

    /**
     * @param array fields
     * @param Estimate estimate
     * @return Estimate|string Return an estimate object or string if an error has been encountered
     */
    public function fillEstimate(array $fields, Estimate $estimate = new Estimate()): Estimate|string {
        $estimate
            ->setCreatedAt(new \DateTimeImmutable())
        ;

        try {
            foreach($fields as $fieldName => $fieldValue) {
                if($fieldName == EstimateEnum::ESTIMATE_USER) $estimate->setUser($fieldValue);
                elseif($fieldName == EstimateEnum::ESTIMATE_COMPANY) $estimate->setCompany($fieldValue);
                elseif($fieldName == EstimateEnum::ESTIMATE_DATE) $estimate->setEstimateDate($fieldValue);
                elseif($fieldName == EstimateEnum::ESTIMATE_STATUS) $estimate->setStatus($fieldValue);
                elseif($fieldName == EstimateEnum::ESTIMATE_APPLY_TVA) $estimate->setApplyTVA($fieldValue);
                elseif($fieldName == EstimateEnum::ESTIMATE_TVA) $estimate->setTva($fields[EstimateEnum::ESTIMATE_APPLY_TVA] ? $fieldValue : null);
            }

            $this->estimateRepository->save($estimate, true);
        } catch(\Exception $e) {
            return $e->getMessage();
        }

        return $estimate;
    }

    /**
     * @param array fields
     * @param EstimateDetail
     * @param Estimate estimate
     * @return EstimateDetail
     */
    public function fillEstimateDetail(
        array $fields, 
        ?EstimateDetail $estimateDetail = new EstimateDetail(), 
        ?Estimate $estimate = null
    ) : EstimateDetail {
        try {
            if(!$estimateDetail->getId()) {
                $estimateDetail->setCreatedAt(new \DateTimeImmutable());
            }
    
            if($estimate) {
                $estimateDetail->setEstimate($estimate);
            }
    
            foreach($fields as $fieldName => $fieldValue) {
                if($fieldName == EstimateDetailEnum::DETAIL_TITLE) $estimateDetail->setLabel($fieldValue);
                elseif($fieldName == EstimateDetailEnum::DETAIL_DESCRIPTION) $estimateDetail->setDescription($fieldValue);
                elseif($fieldName == EstimateDetailEnum::DETAIL_QUANTITY) $estimateDetail->setQuantity($fieldValue);
                elseif($fieldName == EstimateDetailEnum::DETAIL_NBR_DAYS) $estimateDetail->setNbrDays($fieldValue);
                elseif($fieldName == EstimateDetailEnum::DETAIL_PRICE) $estimateDetail->setPrice($fieldValue);
            }

            $this->estimateDetailRepository->save($estimateDetail, true);
        } catch(\Exception $e) {
            return $e->getMessage();
        }

        return $estimateDetail;
    }
}