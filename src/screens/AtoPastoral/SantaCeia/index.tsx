import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function SantaCeia() {
    return (
        <GenericScreen
            apiPath="santa-ceia"
            itemName="Santa Ceia"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "Santa Ceia"
            }}
            modalTitle="Editar Data de Santa Ceia"
            withNomeOnModal={false}
        />
    );
};