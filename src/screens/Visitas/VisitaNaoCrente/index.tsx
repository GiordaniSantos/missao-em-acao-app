import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function VisitaNaoCrente() {
    return (
        <GenericScreen
            apiPath="incredulo"
            itemName="Visita ao Não Crente"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Visita realizada no dia",
                textoPosQtd: "não crentes"
            }}
            modalTitle="Editar Data de Visita ao Não Crente"
            withNomeOnModal={true}
        />
    );
};