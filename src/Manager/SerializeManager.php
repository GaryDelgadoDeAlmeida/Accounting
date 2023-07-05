<?php

namespace App\Manager;

use Symfony\Component\Serializer\SerializerInterface;

class SerializeManager {

    private SerializerInterface $serializer;

    function __construct(SerializerInterface $serializer) {
        $this->serializer = $serializer;
    }

    /**
     * @param array entities
     */
    public function serializeContent(array $entities) {
        return $this->serializer->normalize($entities, null);
    }
}