import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaHospital() {
    return (
        <GenericScreen
            apiPath="hospital"
            itemName="Visita ao Hospital"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "hospitais"
            }}
            modalTitle="Editar Data de Visita ao Hospital"
            withNomeOnModal={true}
        />
    );
};