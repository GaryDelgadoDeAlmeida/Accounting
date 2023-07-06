<?php

namespace App\Manager;

class CountryManager {

    /**
     * Get all countries from an external API
     * 
     * @return array
     */
    public function getCountries() {
        try {
            $curl = \curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://restcountries.eu/rest/v2/all",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_0,
            ]);
            $execCurl = curl_exec($curl);
            $countries = json_decode($execCurl);
            curl_close($curl);

            return $countries;
        } catch(\Exeception $e) {
            throw new Error("An error encoutered : {$e->getMessage()}");
        }
    }
}