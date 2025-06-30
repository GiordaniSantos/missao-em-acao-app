import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function BencaoNupcial() {
    return (
        <GenericScreen
            apiPath="bencao-nupcial"
            itemName="Benção Nupcial"
            renderItemComponent={GenericItem}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "Benção Nupcial"
            }}
            modalTitle="Editar Data de Benção Nupcial"
            withNomeOnModal={true}
        />
    );
};