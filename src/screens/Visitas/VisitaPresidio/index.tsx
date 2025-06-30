import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaEnfermo() {
    return (
        <GenericScreen
            apiPath="presidio"
            itemName="Visita ao Presídio"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "presídios"
            }}
            modalTitle="Editar Data de Visita ao Presídio"
            withNomeOnModal={true}
        />
    );
};