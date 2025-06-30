import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function Sermao() {
    return (
        <GenericScreen
            apiPath="sermao"
            itemName="Sermão"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "sermão"
            }}
            modalTitle="Editar Data de Sermão"
            withNomeOnModal={true}
        />
    );
};