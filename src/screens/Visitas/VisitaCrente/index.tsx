// src/screens/VisitaCrente.tsx (ou onde quer que seu componente esteja)

import React from 'react';
import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaCrente() {
    return (
        <GenericScreen
            apiPath="crente"
            itemName="Visita ao Crente"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "crentes"
            }}
            modalTitle="Editar Data de Visita ao Crente"
            withNomeOnModal={true}
        />
    );
};