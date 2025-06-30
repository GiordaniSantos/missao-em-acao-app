import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaPresidio() {
    return (
        <GenericScreen
            apiPath="enfermo"
            itemName="Visita ao Enfermo"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "enfermos"
            }}
            modalTitle="Editar Data de Visita ao Enfermo"
            withNomeOnModal={true}
        />
    );
};