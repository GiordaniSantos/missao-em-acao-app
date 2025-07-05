import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function BencaoNupcial() {
    return (
        <GenericScreen
            apiPath="bencao-nupcial"
            itemName="Benção Nupcial"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Nome"}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "Benção Nupcial",
                textoNome: "Nome: "
            }}
            modalTitle="Editar Data de Benção Nupcial"
            withNomeOnModal={true}
        />
    );
};