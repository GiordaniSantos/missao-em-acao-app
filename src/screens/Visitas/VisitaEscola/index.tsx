import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaEscola() {
    return (
        <GenericScreen
            apiPath="escola"
            itemName="Visita à Escola"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "escola"
            }}
            modalTitle="Editar Data de Visita à Escola"
            withNomeOnModal={true}
        />
    );
};