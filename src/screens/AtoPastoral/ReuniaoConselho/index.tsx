import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function ReuniaoConselho() {
    return (
        <GenericScreen
            apiPath="reunioes-conselho"
            itemName="Reunião do Conselho"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Observação"}
            itemComponentProps={{
                textoAntesHora: "Realizada no dia",
                textoPosQtd: "Reunião do Conselho",
                textoNome: "Observação: "
            }}
            modalTitle="Editar Data de Reunião do Conselho"
            withNomeOnModal={true}
        />
    );
};