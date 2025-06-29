// src/screens/VisitaCrente.tsx (ou onde quer que seu componente esteja)

import React from 'react';
import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaNaoCrente() {
    return (
        <GenericScreen
            apiPath="incredulo"
            itemName="Visita aos Não Crente"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "crentes"
            }}
            modalTitle="Editar Data de Visita ao Não Crente"
            withNomeOnModal={true}
        />
    );
};