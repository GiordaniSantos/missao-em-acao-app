import GenericItem from '~/components/GenericItem';
import GenericScreen from '~/components/GenericScreen';

export default function Estudo() {
    return (
        <GenericScreen
            apiPath="estudo"
            itemName="Estudo"
            renderItemComponent={GenericItem}
            placeHolderCampoNome={"Assunto do Estudo"}
            itemComponentProps={{
                textoAntesHora: "Realizado no dia",
                textoPosQtd: "estudo",
                textoNome: "Assunto: "
            }}
            modalTitle="Editar Data de Estudo"
            withNomeOnModal={true}
        />
    );
};