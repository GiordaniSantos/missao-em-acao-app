import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function Sermao() {
    return (
        <GenericScreen
            apiPath="sermao"
            itemName="Sermão"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Assunto do Sermão"}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "sermão",
                textoNome: "Assunto: "
            }}
            modalTitle="Editar Data de Sermão"
            withNomeOnModal={true}
        />
    );
};