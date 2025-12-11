import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function ReuniaoOracao() {
    return (
        <GenericScreen
            apiPath="reuniao-oracao"
            itemName="Reunião de Oração"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Pequena descrição..."}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "estudo",
                textoNome: "Descrição:"
            }}
            modalTitle="Editar Data da Reunião de Oração"
            withNomeOnModal={true}
        />
    );
};